import { expect, test } from "@playwright/test";

test("inicio: elegir carro; moto aparece como próximamente", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("prueba teórica");
  await expect(page.locator('[data-licencia="moto"]')).toContainText("Próximamente");
  await page.locator('[data-licencia="carro"]').click();
  await expect(page).toHaveURL(/\/carro\/$/);
  await expect(page.getByText("Es una práctica.")).toBeVisible();
});

test("tema: se elige cómo estudiar (resumen, quiz o flashcards)", async ({ page }) => {
  await page.goto("/carro/intersecciones/");
  await expect(page.getByRole("heading", { name: "Cómo estudiar este tema" })).toBeVisible();
  for (const modo of ["resumen", "quiz", "flashcards"]) await expect(page.locator(`[data-modo="${modo}"]`)).toBeVisible();
  await expect(page.getByText(/presentaci/i)).toHaveCount(0);
});

test("resumen: la animación de una sección se monta al llegar y se reproduce", async ({ page }) => {
  const errores: string[] = [];
  page.on("pageerror", (e) => errores.push(e.message));
  await page.goto("/carro/intersecciones/resumen/#ceda");
  const escena = page.locator('[data-escena="ceda-vs-alto"]');
  await escena.scrollIntoViewIfNeeded();
  await expect(escena.locator("canvas")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText("¢245 195,06").first()).toBeVisible();
  await escena.getByRole("button", { name: "Reproducir animación" }).click();
  await expect(escena).toHaveAttribute("data-fase", "fin", { timeout: 25_000 });
  await expect(escena.getByRole("button", { name: "Repetir animación" })).toBeVisible();
  expect(errores).toEqual([]);
});

test("quiz: las preguntas de situación muestran la animación y el progreso persiste", async ({ page }) => {
  await page.goto("/carro/intersecciones/quiz/");
  await page.getByRole("button", { name: "Empezar" }).click();
  let conEscena = 0;
  for (let n = 1; ; n++) {
    await expect(page.getByText(`Pregunta ${n} de 22`)).toBeVisible();
    await page.waitForTimeout(350); // termina la transición entre preguntas
    const figura = page.locator("figure[data-escena]");
    const tiene = (await figura.count()) === 1;
    await page.locator("ul li button").first().click();
    if (tiene) {
      conEscena++;
      await expect(figura).not.toHaveAttribute("data-fase", "inicio");
    }
    const siguiente = page.getByRole("button", { name: /Siguiente|Ver resultado/ });
    const final = (await siguiente.textContent())?.includes("Ver resultado");
    await siguiente.click();
    if (final) break;
  }
  expect(conEscena).toBeGreaterThan(5);
  await expect(page.getByTestId("nota-quiz")).toBeVisible();
  await page.goto("/progreso/");
  const intentos = await page.evaluate(() => JSON.parse(localStorage.getItem("prueba-teorica-cr:progreso") ?? "{}").state?.quizzes?.intersecciones?.intentos);
  expect(intentos).toBe(1);
});

test("flashcards: al voltear se ve la animación de la situación", async ({ page }) => {
  await page.goto("/carro/intersecciones/flashcards/");
  await page.getByRole("button", { name: "Repasar todas" }).click();
  await page.getByRole("button", { name: "Ver respuesta" }).click();
  await expect(page.locator('[data-escena="alto-vs-libre"] canvas')).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button", { name: /Acertada/ }).click();
  await expect(page.getByText(/Tarjeta 2 de/)).toBeVisible();
});

test("simulacro: es una práctica; empezar y entregar", async ({ page }) => {
  await page.goto("/carro/simulacro/");
  await expect(page.getByText(/La prueba oficial la aplica la Dirección General de Educación Vial/)).toBeVisible();
  await page.getByRole("button", { name: "Empezar el simulacro" }).click();
  await expect(page.getByTestId("cronometro")).toBeVisible();
  await page.getByRole("button", { name: /Entregar ahora/ }).click();
  await expect(page.getByTestId("nota-simulacro")).toHaveText("0");
});

test("moto muestra próximamente", async ({ page }) => {
  await page.goto("/moto/");
  await expect(page.getByRole("heading", { name: "Moto: próximamente" })).toBeVisible();
});

test("sin scroll horizontal en el resumen", async ({ page }) => {
  await page.goto("/carro/intersecciones/resumen/");
  const sobra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(sobra).toBeLessThanOrEqual(0);
});
