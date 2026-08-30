import sharp from "sharp";

const ANALYSIS_SIZE = 256;

const roundMetric = (value) => Number(value.toFixed(4));

export async function classifyCiosaMedia(input) {
  const image = sharp(input, { limitInputPixels: 40_000_000 }).rotate();
  const [{ data }, stats] = await Promise.all([
    image
      .clone()
      .resize(ANALYSIS_SIZE, ANALYSIS_SIZE, { fit: "fill" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true }),
    image.clone().stats(),
  ]);

  let blackPixels = 0;
  let darkSurfacePixels = 0;
  let saturationTotal = 0;
  const pixelCount = data.length / 3;

  for (let offset = 0; offset < data.length; offset += 3) {
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    saturationTotal += maximum - minimum;
    if (maximum < 32) blackPixels += 1;
    if (maximum < 160) darkSurfacePixels += 1;
  }

  const averageSaturation = saturationTotal / pixelCount;
  const blackFraction = blackPixels / pixelCount;
  const darkSurfaceFraction = darkSurfacePixels / pixelCount;
  const sharpness = Number(stats.sharpness || 0);

  // Los planos de Ciosa son casi monocromos, con líneas muy agudas y sin
  // superficies oscuras continuas. Las fotografías de pastillas y discos,
  // aun sobre fondo blanco, conservan gradientes, textura o color real.
  const isTechnicalDiagram = averageSaturation <= 2
    && blackFraction <= 0.005
    && (
      sharpness >= 3
      || (darkSurfaceFraction < 0.015 && sharpness >= 2)
    );

  return {
    mediaType: isTechnicalDiagram ? "technical-diagram" : "photo",
    analysis: {
      averageSaturation: roundMetric(averageSaturation),
      blackFraction: roundMetric(blackFraction),
      darkSurfaceFraction: roundMetric(darkSurfaceFraction),
      sharpness: roundMetric(sharpness),
    },
  };
}
