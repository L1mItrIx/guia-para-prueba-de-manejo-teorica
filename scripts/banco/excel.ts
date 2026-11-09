import ExcelJS from "exceljs";
import { COLUMNAS, type Aviso, type Fila } from "./lib";

const ANCHOS: Partial<Record<keyof Fila, number>> = {
  tema: 16, id: 10, enunciado: 60, opcion_a: 40, opcion_b: 40, opcion_c: 40, opcion_d: 40,
  correcta: 10, explicacion: 60, fuente: 14, detalle: 26, verificado: 13,
};

export async function crearLibro(filas: Fila[], avisos: Aviso[]): Promise<ExcelJS.Workbook> {
  const libro = new ExcelJS.Workbook();
  libro.creator = "Teórico CR";
  const hoja = libro.addWorksheet("Preguntas", { views: [{ state: "frozen", ySplit: 1, xSplit: 2 }] });
  hoja.columns = COLUMNAS.map((c) => ({ header: c, key: c, width: ANCHOS[c] ?? 20 }));
  hoja.addRows(filas);
  hoja.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  hoja.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0B3D91" } };
  hoja.autoFilter = { from: "A1", to: { row: 1, column: COLUMNAS.length } };
  const ultima = Math.max(filas.length + 200, 500);
  const col = (k: keyof Fila) => hoja.getColumn(COLUMNAS.indexOf(k) + 1).letter;
  for (let r = 2; r <= ultima; r++) {
    hoja.getCell(`${col("correcta")}${r}`).dataValidation = { type: "list", allowBlank: true, formulae: ['"A,B,C,D"'] };
    for (const k of ["enunciado", "explicacion", "opcion_a", "opcion_b", "opcion_c", "opcion_d"] as const) {
      hoja.getCell(`${col(k)}${r}`).alignment = { wrapText: true, vertical: "top" };
    }
  }

  const rev = libro.addWorksheet("Revisión");
  rev.columns = [
    { header: "id", key: "id", width: 12 },
    { header: "tipo", key: "tipo", width: 22 },
    { header: "detalle", key: "detalle", width: 90 },
  ];
  rev.addRows(avisos);
  rev.getRow(1).font = { bold: true };

  const ayuda = libro.addWorksheet("Instrucciones");
  [
    "Editá solo la hoja \"Preguntas\". Una fila = una pregunta.",
    "correcta: letra A, B, C o D. Puede haber 3 o 4 opciones (dejá opcion_d vacía).",
    "fuente: id de src/content/fuentes.ts (p. ej. ley-9078). detalle: artículo e inciso.",
    "verificado: AAAA-MM-DD cuando se comprobó contra la fuente, o \"pendiente\".",
    "Para una pregunta nueva usá un id nuevo (p. ej. int-23) y el slug del tema en \"tema\".",
    "Después: npm run banco:importar -- banco/preguntas.xlsx",
  ].forEach((t) => ayuda.addRow([t]));
  ayuda.getColumn(1).width = 100;
  return libro;
}

export async function leerFilas(archivo: string): Promise<Partial<Fila>[]> {
  const libro = new ExcelJS.Workbook();
  await libro.xlsx.readFile(archivo);
  const hoja = libro.getWorksheet("Preguntas");
  if (!hoja) throw new Error('El archivo no tiene una hoja llamada "Preguntas"');
  const encabezados = (hoja.getRow(1).values as unknown[]).map((v) => String(v ?? "").trim());
  const filas: Partial<Fila>[] = [];
  hoja.eachRow((row, n) => {
    if (n === 1) return;
    const f: Record<string, string> = {};
    encabezados.forEach((h, i) => {
      if (!h) return;
      const v = row.getCell(i).value;
      f[h] = typeof v === "object" && v !== null && "richText" in v ? v.richText.map((t) => t.text).join("") : String(v ?? "");
    });
    filas.push(f as Partial<Fila>);
  });
  return filas;
}
