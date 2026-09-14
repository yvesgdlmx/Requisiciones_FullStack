import React from "react";
import fs from "fs/promises";
import path from "path";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";

const rootDir = path.resolve(process.cwd(), "..");
const outputPath = path.join(rootDir, "docs", "reporte-cambios-requisiciones.pdf");
const annotatedImagePath = path.join(rootDir, "docs", "capturas-cambios-anotadas.png");
const annotatedImage = `data:image/png;base64,${await fs.readFile(
  annotatedImagePath,
  "base64",
)}`;

const styles = StyleSheet.create({
  page: {
    padding: 34,
    fontFamily: "Helvetica",
    color: "#17233f",
    backgroundColor: "#f8fafc",
  },
  cover: {
    padding: 46,
    fontFamily: "Helvetica",
    color: "#17233f",
    backgroundColor: "#f8fafc",
  },
  band: {
    backgroundColor: "#163f91",
    borderRadius: 8,
    padding: 28,
    color: "#ffffff",
    marginBottom: 26,
  },
  eyebrow: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#b6d7ff",
    marginBottom: 8,
  },
  title: {
    fontSize: 29,
    fontWeight: 700,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 1.5,
    color: "#dbeafe",
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  metaPill: {
    backgroundColor: "#e0f2fe",
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    fontSize: 10,
    color: "#075985",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10,
    color: "#17233f",
  },
  sectionSubtitle: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 14,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    border: "1px solid #dbe3ef",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  cardNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#2563eb",
    color: "#ffffff",
    textAlign: "center",
    paddingTop: 5,
    fontSize: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: 6,
  },
  body: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#334155",
  },
  bullet: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0ea5e9",
    marginTop: 5,
  },
  visualPage: {
    padding: 18,
    backgroundColor: "#ffffff",
  },
  visualTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
    color: "#17233f",
  },
  annotatedImage: {
    width: "100%",
    height: 500,
    objectFit: "contain",
    border: "1px solid #dbe3ef",
  },
  table: {
    backgroundColor: "#ffffff",
    border: "1px solid #dbe3ef",
    borderRadius: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #e2e8f0",
  },
  rowLast: {
    flexDirection: "row",
  },
  cellHead: {
    width: "28%",
    padding: 8,
    fontSize: 9,
    fontWeight: 700,
    color: "#475569",
    backgroundColor: "#eef2ff",
  },
  cell: {
    width: "72%",
    padding: 8,
    fontSize: 9,
    lineHeight: 1.45,
    color: "#334155",
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 34,
    right: 34,
    fontSize: 8,
    color: "#94a3b8",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const bullets = {
  internacional: [
    "Cuando la compra es internacional, el administrador puede capturar cotizacion, numero de guia, numero de orden de venta y factura.",
    "Los campos se agrupan dentro de Datos Internacionales para separarlos de proveedor, tipo de compra, categoria, monto y ETA.",
    "Si el tipo de compra no es internacional, esos campos se limpian para evitar datos residuales.",
  ],
  pdf: [
    "La requisicion ahora acepta archivos PDF ademas de imagenes JPG, JPEG y PNG.",
    "Los PDFs se guardan en Cloudinary como archivo real, no como imagen convertida.",
    "Cada documento conserva URL, public_id, resource_type, formato, mimetype y nombre original.",
  ],
  historial: [
    "Se agrego la seccion Historial de Movimientos para consultar cambios de status.",
    "Cada cambio registra folio, status anterior, status nuevo, usuario, rol y fecha del cambio.",
    "El historial se alimenta automaticamente desde los flujos de administrador y autorizador.",
  ],
  exportacion: [
    "Se agrego la seccion Exportar Requisiciones con descarga en Excel.",
    "Permite exportar por rango de fechas, por folio o el listado completo.",
    "El archivo incluye la mayoria de los datos de la requisicion y una hoja de articulos.",
  ],
};

function BulletList({ items }) {
  return React.createElement(
    View,
    null,
    items.map((item) =>
      React.createElement(
        View,
        { key: item, style: styles.bullet },
        React.createElement(View, { style: styles.dot }),
        React.createElement(Text, { style: styles.body }, item),
      ),
    ),
  );
}

function ChangeCard({ number, title, children }) {
  return React.createElement(
    View,
    { style: styles.card },
    React.createElement(Text, { style: styles.cardNumber }, String(number)),
    React.createElement(Text, { style: styles.cardTitle }, title),
    children,
  );
}

function Footer({ page }) {
  return React.createElement(
    View,
    { style: styles.footer, fixed: true },
    React.createElement(Text, null, "Sistema de Gestion de Requisiciones"),
    React.createElement(Text, null, `Pagina ${page}`),
  );
}

const Report = () =>
  React.createElement(
    Document,
    {
      title: "Reporte de cambios en requisiciones",
      author: "Laboratorio Optimex",
      subject: "Resumen funcional de mejoras implementadas",
    },
    React.createElement(
      Page,
      { size: "A4", style: styles.cover },
      React.createElement(
        View,
        { style: styles.band },
        React.createElement(Text, { style: styles.eyebrow }, "Laboratorio Optimex"),
        React.createElement(Text, { style: styles.title }, "Reporte de cambios en requisiciones"),
        React.createElement(
          Text,
          { style: styles.subtitle },
          "Resumen de mejoras implementadas en compras internacionales, carga documental, trazabilidad de status y exportacion de requisiciones.",
        ),
      ),
      React.createElement(
        View,
        { style: styles.metaRow },
        React.createElement(Text, { style: styles.metaPill }, "Fecha: 02/09/2026"),
        React.createElement(Text, { style: styles.metaPill }, "Modulo: Requisiciones"),
        React.createElement(Text, { style: styles.metaPill }, "Formato: PDF ejecutivo"),
      ),
      React.createElement(Text, { style: [styles.sectionTitle, { marginTop: 26 }] }, "Resumen ejecutivo"),
      React.createElement(
        Text,
        { style: styles.body },
        "Los cambios fortalecen la operacion diaria de compras: permiten documentar mejor importaciones, conservar PDFs como evidencia original, auditar movimientos de status y generar archivos Excel para analisis o reportes.",
      ),
      React.createElement(
        View,
        { style: [styles.cardGrid, { marginTop: 18 }] },
        React.createElement(
          ChangeCard,
          { number: 1, title: "Campos de compra internacional" },
          React.createElement(BulletList, { items: bullets.internacional }),
        ),
        React.createElement(
          ChangeCard,
          { number: 2, title: "PDFs en requisiciones" },
          React.createElement(BulletList, { items: bullets.pdf }),
        ),
        React.createElement(
          ChangeCard,
          { number: 3, title: "Historial de movimientos" },
          React.createElement(BulletList, { items: bullets.historial }),
        ),
        React.createElement(
          ChangeCard,
          { number: 4, title: "Exportacion a Excel" },
          React.createElement(BulletList, { items: bullets.exportacion }),
        ),
      ),
      React.createElement(Footer, { page: 1 }),
    ),
    React.createElement(
      Page,
      { size: "A4", orientation: "landscape", style: styles.visualPage },
      React.createElement(Text, { style: styles.visualTitle }, "Evidencia visual anotada"),
      React.createElement(Image, { src: annotatedImage, style: styles.annotatedImage }),
      React.createElement(Footer, { page: 2 }),
    ),
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(Text, { style: styles.sectionTitle }, "Detalle de comportamiento"),
      React.createElement(Text, { style: styles.sectionSubtitle }, "Cambios funcionales y alcance operativo"),
      React.createElement(
        View,
        { style: styles.table },
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: styles.cellHead }, "Compra internacional"),
          React.createElement(
            Text,
            { style: styles.cell },
            "El formulario administrativo muestra Datos Internacionales cuando el tipo de compra es Internacional. Ahi se capturan cotizacion, numero de guia, numero de orden de venta y factura.",
          ),
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: styles.cellHead }, "Carga de PDF"),
          React.createElement(
            Text,
            { style: styles.cell },
            "La carga documental acepta imagenes y PDFs. Los PDFs se suben como resource_type raw en Cloudinary, por lo que se conserva el documento original en lugar de convertir solo la primera pagina a imagen.",
          ),
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: styles.cellHead }, "Trazabilidad"),
          React.createElement(
            Text,
            { style: styles.cell },
            "Cada cambio de status genera un registro consultable en Historial de Movimientos, incluyendo usuario, rol, status anterior, status nuevo y fecha de cambio.",
          ),
        ),
        React.createElement(
          View,
          { style: styles.rowLast },
          React.createElement(Text, { style: styles.cellHead }, "Exportacion"),
          React.createElement(
            Text,
            { style: styles.cell },
            "La seccion Exportar Requisiciones permite generar Excel por rango de fechas, folio o listado completo. Incluye informacion principal de requisiciones y articulos para facilitar reportes.",
          ),
        ),
      ),
      React.createElement(Text, { style: [styles.sectionTitle, { marginTop: 24 }] }, "Notas tecnicas"),
      React.createElement(BulletList, {
        items: [
          "Los archivos se mantienen en el campo JSON archivos de la requisicion.",
          "El limite visible y de backend permanece en maximo 5 documentos por requisicion.",
          "Los PDFs subidos antes del ajuste como JPG deben volver a cargarse si se requiere conservar el PDF original.",
        ],
      }),
      React.createElement(Footer, { page: 3 }),
    ),
  );

await fs.mkdir(path.dirname(outputPath), { recursive: true });
const blob = await pdf(React.createElement(Report)).toBlob();
const buffer = Buffer.from(await blob.arrayBuffer());
await fs.writeFile(outputPath, buffer);
console.log(`PDF generado: ${outputPath}`);
