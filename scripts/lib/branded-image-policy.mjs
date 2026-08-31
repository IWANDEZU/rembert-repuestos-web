import sharp from "sharp";

export const BRAND_TREATMENT_VERSION = 3;
export const COLOR_POLICY = "natural-materials-no-orange-recolor";
export const MAX_ORANGE_RATIO = 0.08;

export async function measureOrangeRatio(filePath) {
  const { data, info } = await sharp(filePath, { limitInputPixels: 60_000_000 })
    .flatten({ background: "#ffffff" })
    .resize({ width: 160, height: 160, fit: "contain", background: "#ffffff" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let nonWhitePixels = 0;
  let orangePixels = 0;
  for (let offset = 0; offset < data.length; offset += info.channels) {
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    if (red > 244 && green > 244 && blue > 244) continue;
    nonWhitePixels += 1;
    const looksOrange = red >= 170
      && green >= 65
      && green <= 165
      && blue <= 105
      && red >= green * 1.35
      && green >= blue * 1.18;
    if (looksOrange) orangePixels += 1;
  }
  return nonWhitePixels ? orangePixels / nonWhitePixels : 0;
}
