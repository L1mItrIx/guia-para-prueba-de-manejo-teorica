import { expect, test } from "@playwright/test";

test("inicio: elegir carro; moto aparece como próximamente", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("prueba teórica");
  await expect(page.locator('[data-licencia="moto"]')).toContainText("Próximamente");
  await page.locator('[data-licencia="carro"]').click();
  await expect(page).toHaveURL(/\/carro\/$/);
  await expect(page.getByRole("heading", { name: /Intersecciones y derecho de vía/ })).toBeVisible();
});

test("tema: resumen con fuentes y multas 2026", async ({ page }) => {
  await page.goto("/carro/intersecciones/");
  await expect(page.getByRole("heading", { name: "Señal de ALTO" })).toBeVisible();
  await expect(page.getByText("¢245 195,06").first()).toBeVisible();
  await expect(page.getByText(/Art\. 105/).first()).toBeVisible();
});

test("quiz completo y el progreso persiste al recargar", async ({ page }) => {
  await page.goto("/carro/intersecciones/quiz/");
  await page.getByRole("button", { name: "Empezar quiz" }).click();
  for (;;) {
    await page.locator("ul li button").first().click();
    const siguiente = page.getByRole("button", { name: /Siguiente|Ver resultado/ });
    const texto = await siguiente.textContent();
    await siguiente.click();
    if (texto?.includes("Ver resultado")) break;
  }
  await expect(page.getByTestId("nota-quiz")).toBeVisible();
  await page.goto("/progreso/");
  await page.reload();
  await expect(page.getByText("Mejor nota en el quiz").first()).toBeVisible();
  const intentos = await page.evaluate(() => JSON.parse(localStorage.getItem("prueba-teorica-cr:progreso") ?? "{}").state?.quizzes?.intersecciones?.intentos);
  expect(intentos).toBe(1);
});

test("flashcards: voltear y marcar", async ({ page }) => {
  await page.goto("/carro/intersecciones/flashcards/");
  await page.getByRole("button", { name: "Repasar todas" }).click();
  await page.getByRole("button", { name: "Ver respuesta" }).click();
  await page.getByRole("button", { name: /La sabía/ }).first().click();
  await expect(page.getByText(/Tarjeta 2 de/)).toBeVisible();
});

test("presentación: avanzar con teclado", async ({ page }) => {
  await page.goto("/carro/intersecciones/presentacion/");
  await expect(page.getByText("1 / 9")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("2 / 9")).toBeVisible();
});

test("escena 3D: monta el canvas y se puede responder con botones", async ({ page }) => {
  const errores: string[] = [];
  page.on("pageerror", (e) => errores.push(e.message));
  await page.goto("/carro/intersecciones/escena/");
  await expect(page.getByTestId("canvas-3d").locator("canvas")).toBeVisible({ timeout: 20_000 });
  await page.getByRole("group", { name: "¿Quién pasa primero?" }).getByRole("button", { name: /Carro azul/ }).click();
  await expect(page.getByText("¡Correcto!")).toBeVisible();
  expect(errores).toEqual([]);
});

test("simulacro: empezar y entregar", async ({ page }) => {
  await page.goto("/carro/simulacro/");
  await page.getByRole("button", { name: "Empezar simulacro" }).click();
  await expect(page.getByText(/⏱/)).toBeVisible();
  await page.getByRole("button", { name: /Entregar ahora/ }).click();
  await expect(page.getByTestId("nota-simulacro")).toHaveText("0");
});

test("moto muestra próximamente", async ({ page }) => {
  await page.goto("/moto/");
  await expect(page.getByRole("heading", { name: "Moto: próximamente" })).toBeVisible();
});
