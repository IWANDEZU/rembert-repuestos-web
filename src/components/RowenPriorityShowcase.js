import Image from "next/image";
import Link from "next/link";
import styles from "./VerkePriorityShowcase.module.css";

const whatsappHref = "https://wa.me/573508299233?text=Hola%20REMBERT%2C%20necesito%20confirmar%20un%20amortiguador%20Rowen.%20Marca%3A%20___%20Modelo%3A%20___%20A%C3%B1o%3A%20___%20Motor%3A%20___%20Posici%C3%B3n%3A%20___%20VIN%3A%20___%20Referencia%20de%20la%20caja%3A%20___";

export default function RowenPriorityShowcase() {
  return (
    <section className={styles.section} aria-labelledby="rowen-priority-title">
      <div className={styles.layout}>
        <div className={styles.gallery} aria-label="Fotografías reales de amortiguadores Rowen y su empaque">
          <div className={styles.mainImage}>
            <Image
              src="/catalogo-rowen/rowen-amortiguadores-macpherson-empaque-real.webp"
              alt="Amortiguadores Rowen MacPherson con empaque rojo original"
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
              className={styles.image}
            />
          </div>
          <div className={styles.sideImages} aria-hidden="true">
            <div className={styles.sideImage}>
              <Image src="/catalogo-rowen/rowen-amortiguadores-macpherson-detalle.webp" alt="" fill sizes="24vw" className={styles.image} />
            </div>
            <div className={styles.sideImage}>
              <Image src="/catalogo-rowen/rowen-empaque-original-detalle.webp" alt="" fill sizes="24vw" className={styles.image} />
            </div>
          </div>
        </div>

        <div className={styles.copy}>
          <span className={styles.badge}>Rowen · inventario auditado</span>
          <h2 id="rowen-priority-title">Amortiguación y frenos Rowen</h2>
          <p className={styles.lead}>
            El inventario actual contiene seis amortiguadores Rowen cruzados por número de parte y dos juegos de pastillas declarados como Rowen en el informe oficial. Las pastillas se muestran con compatibilidad condicional hasta confirmar su referencia fabricante, geometría y VIN.
          </p>
          <dl className={styles.facts}>
            <div><dt>8</dt><dd>productos Rowen auditados con existencia positiva</dd></div>
            <div><dt>6</dt><dd>amortiguadores cruzados por referencia externa</dd></div>
            <div><dt>$90.250</dt><dd>precio desde, sujeto a existencia registrada</dd></div>
          </dl>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/catalogo?category=frenos-y-suspension&brand=rowen#productos">
              Ver productos Rowen
            </Link>
            <a className={styles.secondary} href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Confirmar aplicación
            </a>
          </div>
          <p className={styles.note}>
            Precio competitivo comprobado para 96424027. La referencia 333723 está en el extremo alto del mercado observado y debe revisarse con costo y margen antes de descontar. Todas las aplicaciones requieren validación por VIN.
          </p>
        </div>
      </div>
    </section>
  );
}
