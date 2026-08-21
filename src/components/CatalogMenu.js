import Link from "next/link";
import styles from "./CatalogMenu.module.css";

const groups = [
  {
    title: "Motor y transmisión",
    links: [
      ["Motor y distribución", "motor-y-distribucion"],
      ["Cajas y transmisión", "transmision"],
      ["Embragues y clutch", "embrague"],
      ["Rodamientos y tracción", "rodamientos-y-traccion"],
      ["Mangueras y tubos", "mangueras-y-tubos"],
      ["Soportes, retenedores y guayas", "soportes-retenedores-y-guayas"],
    ],
  },
  {
    title: "Seguridad y sistemas",
    links: [
      ["Frenos, dirección y suspensión", "frenos-y-suspension"],
      ["Partes eléctricas", "electrico-y-encendido"],
      ["Radiadores y refrigeración", "radiadores"],
      ["Filtros", "filtros"],
      ["Combustible e inyección", "combustible"],
      ["Carrocería e iluminación", "carroceria-iluminacion"],
    ],
  },
  {
    title: "Mantenimiento",
    links: [
      ["Lubricantes y fluidos", "lubricantes-gasolina"],
      ["Otros repuestos en inventario", "repuestos-varios"],
    ],
  },
];

export default function CatalogMenu() {
  return (
    <li className={styles.item}>
      <details className={styles.details}>
        <summary className={styles.summary}>CATÁLOGO</summary>
        <div className={styles.panel}>
          {groups.map((group) => (
            <section className={styles.group} key={group.title}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              {group.links.map(([label, category]) => (
                <Link className={styles.link} href={`/catalogo?category=${category}`} key={category}>{label}</Link>
              ))}
            </section>
          ))}
        </div>
      </details>
    </li>
  );
}
