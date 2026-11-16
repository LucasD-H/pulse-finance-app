import { expect, test } from "@playwright/test";
import { registerAndLogin, uniqueEmail } from "./utils";

test("usuário autenticado consegue criar e excluir uma transação", async ({ page }) => {
  const email = uniqueEmail("e2e-tx");
  await registerAndLogin(page, "Usuário Transações", email);
  await expect(page).toHaveURL("/");

  await page.goto("/transacoes");

  const title = `Transação E2E ${Date.now()}`;
  await page.getByLabel("Título").fill(title);
  await page.getByLabel("Valor (R$)").fill("123,45");
  // "Categoria" também existe como <select> na barra de filtros, então
  // precisamos restringir ao campo de texto do formulário de criação.
  await page.getByRole("textbox", { name: "Categoria" }).fill("Testes");
  await page.getByRole("button", { name: "Adicionar" }).click();

  await expect(page.getByText(title)).toBeVisible();

  const row = page.locator("tr", { hasText: title });
  await row.getByRole("button", { name: `Excluir ${title}` }).click();

  await expect(page.getByText(title)).not.toBeVisible();
});
