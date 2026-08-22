import Image from "next/image";
import Link from "next/link";
import styles from "./VerkePriorityShowcase.module.css";

const whatsappHref = "https://wa.me/573508299233?text=Hola%20REMBERT%2C%20necesito%20confirmar%20un%20amortiguador%20Verke.%20Marca%20del%20veh%C3%ADculo%3A%20___%20Modelo%3A%20___%20A%C3%B1o%3A%20___%20Motor%3A%20___%20Posici%C3%B3n%3A%20___%20VIN%3A%20___%20N%C3%BAmero%20de%20parte%20de%20la%20caja%3A%20___";

export default function VerkePriorityShowcase({ inventoryCount = 0 }) {
  return (
    <section className={styles.section} aria-labelledby="verke-priority-title">
      <div className={styles.layout}>
        <div className={styles.gallery} aria-label="Fotografías reales de amortiguación Verke">
          <div className={styles.mainImage}>
            <Image
              src="/catalogo-verke/verke-amortiguador-con-empaque-real.webp"
              alt="Amortiguador Verke junto a su empaque original"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
              className={styles.image}
            />
          </div>
          <div className={styles.sideImages} aria-hidden="true">
            <div className={styles.sideImage}>
              <Image src="/catalogo-verke/verke-amortiguador-delantero-vista-frontal.webp" alt="" fill sizes="24vw" className={styles.image} />
            </div>
            <div className={styles.sideImage}>
              <Image src="/catalogo-verke/verke-amortiguador-delantero-vista-lateral.webp" alt="" fill sizes="24vw" className={styles.image} />
            </div>
          </div>
        </div>

        <div className={styles.copy}>
          <span className={styles.badge}>Marca prioritaria · fotografía real</span>
          <h2 id="verke-priority-title">Verke: amortiguación para automóviles</h2>
          <p className={styles.lead}>
            Consulta amortiguadores delanteros, traseros, puntales y componentes afines. La referencia se valida por vehículo, posición, lado, motorización y VIN antes del despacho.
          </p>
          <dl className={styles.facts}>
            <div><dt>{inventoryCount}</dt><dd>referencias con existencia en la línea de amortiguación</dd></div>
            <div><dt>Real</dt><dd>producto y empaque fotografiados por REMBERT</dd></div>
            <div><dt>VIN</dt><dd>confirmación técnica antes de la venta</dd></div>
          </dl>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/catalogo?category=frenos-y-suspension&line=AMORTIGUADORES#productos">
              Ver amortiguadores disponibles
            </Link>
            <a className={styles.secondary} href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Identificar referencia Verke
            </a>
          </div>
          <p className={styles.note}>
            Importante: la caja visible no muestra un número de parte legible. No asignamos compatibilidad Verke por apariencia; envíanos la etiqueta lateral o el SKU para comprobar la aplicación exacta.
          </p>
        </div>
      </div>
    </section>
  );
}
