#!/usr/bin/env node
/**
 * Graba un video explicativo corto a partir de un guion JSON (videos/guiones/*.json),
 * usando las escenas reales del sitio exportado (out/). No se usa dentro de la app.
 *
 *   npm run build
 *   npm run video -- videos/guiones/ceda-vs-alto.json
 *
 * Salida: videos/salida/<id>.mp4 (H.264, subtítulos quemados) y <id>.srt.
 * Ver skill video-making.
 */
import { chromium } from "playwright";
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const FORMATOS = {
  vertical: { ancho: 540, alto: 960, salida: "1080:1920", tamañoLetra: 15 },
  horizontal: { ancho: 1280, alto: 720, salida: "1920:1080", tamañoLetra: 22 },
};

const archivo = process.argv[2];
if (!archivo) {
  console.error("Uso: grabar.mjs videos/guiones/<guion>.json");
  process.exit(1);
}
const guion = JSON.parse(readFileSync(archivo, "utf8"));
const formato = FORMATOS[guion.formato ?? "vertical"];
if (!formato) throw new Error(`formato desconocido: ${guion.formato}`);
const PUERTO = 4174;
const base = `http://localhost:${PUERTO}`;
const dir = "videos/salida";
mkdirSync(dir, { recursive: true });

if (!existsSync("out/index.html")) {
  console.error("✘ Falta el export estático. Primero hay que correr: npm run build");
  process.exit(1);
}
const servidor = spawn("npx", ["serve", "out", "-l", String(PUERTO), "--no-clipboard"], { stdio: "ignore" });
const cerrar = () => servidor.kill();
process.on("exit", cerrar);

async function esperarServidor() {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("El servidor local no respondió");
}

const srtTiempo = (ms) => {
  const h = String(Math.floor(ms / 3.6e6)).padStart(2, "0");
  const m = String(Math.floor((ms % 3.6e6) / 6e4)).padStart(2, "0");
  const s = String(Math.floor((ms % 6e4) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s},${String(Math.floor(ms % 1000)).padStart(3, "0")}`;
};

async function main() {
  await esperarServidor();
  const navegador = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const contexto = await navegador.newContext({
    viewport: { width: formato.ancho, height: formato.alto },
    deviceScaleFactor: 1,
    colorScheme: guion.tema ?? "light",
    recordVideo: { dir, size: { width: formato.ancho, height: formato.alto } },
  });
  const pagina = await contexto.newPage();
  const t0 = Date.now();
  const subtitulos = [];

  await pagina.goto(base + guion.ruta, { waitUntil: "networkidle" });
  if (guion.ocultarInterfaz !== false) {
    await pagina.addStyleTag({ content: 'header, footer, nav[aria-label="Ruta de navegación"], h1 { display: none !important; } main { padding-top: 8px !important; }' });
  }

  for (const paso of guion.pasos) {
    const inicio = Date.now() - t0;
    if (paso.texto) subtitulos.push({ inicio, texto: paso.texto });
    const objetivo = () =>
      paso.rol ? pagina.getByRole(paso.rol, { name: paso.nombre, exact: paso.exacto ?? false }).first() : pagina.locator(paso.selector).first();
    switch (paso.accion) {
      case "esperar":
        break;
      case "clic":
        await objetivo().click();
        break;
      case "centrar":
        await objetivo().evaluate((el) => el.scrollIntoView({ block: "center" }));
        break;
      case "esperarElemento":
        await objetivo().waitFor({ timeout: 20000 });
        break;
      default:
        throw new Error(`acción desconocida: ${paso.accion}`);
    }
    await pagina.waitForTimeout(paso.ms ?? 1500);
  }
  const fin = Date.now() - t0;
  const video = pagina.video();
  await contexto.close();
  await navegador.close();

  const srt = subtitulos
    .map((s, i) => `${i + 1}\n${srtTiempo(s.inicio)} --> ${srtTiempo(i + 1 < subtitulos.length ? subtitulos[i + 1].inicio : fin)}\n${s.texto}\n`)
    .join("\n");
  const rutaSrt = join(dir, `${guion.id}.srt`);
  writeFileSync(rutaSrt, srt);
  const webm = join(dir, `${guion.id}.webm`);
  renameSync(await video.path(), webm);

  const estilo = `FontName=DejaVu Sans,FontSize=${formato.tamañoLetra},Bold=1,PrimaryColour=&H00FFFFFF,BackColour=&H990B3D91,BorderStyle=3,Outline=6,Shadow=0,MarginV=40,Alignment=2`;
  const mp4 = join(dir, `${guion.id}.mp4`);
  const r = spawnSync(
    "ffmpeg",
    ["-y", "-loglevel", "error", "-i", webm, "-vf", `scale=${formato.salida}:flags=lanczos,subtitles=${rutaSrt}:force_style='${estilo}'`, "-r", "30", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4],
    { stdio: "inherit" },
  );
  if (r.status !== 0) throw new Error("ffmpeg falló");
  console.log(`✔ ${mp4} (${(fin / 1000).toFixed(1)} s) · subtítulos: ${rutaSrt}`);
}

main()
  .catch((e) => {
    console.error("✘", e.message);
    process.exitCode = 1;
  })
  .finally(cerrar);
