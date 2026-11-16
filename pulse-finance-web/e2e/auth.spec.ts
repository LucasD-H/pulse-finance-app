import { expect, test } from "@playwright/test";
import { registerAndLogin, uniqueEmail } from "./utils";

test.describe("Autenticação", () => {
  test("cadastro novo leva ao dashboard autenticado", async ({ page }) => {
    const email = uniqueEmail("e2e-register");

    await registerAndLogin(page, "Usuário E2E", email);

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Usuário E2E")).toBeVisible();
  });

  test("login com credenciais erradas mostra mensagem de erro", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("inexistente@test.com");
    await page.getByLabel("Senha").fill("senha-errada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Credenciais inválidas")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("logout redireciona para a tela de login", async ({ page }) => {
    const email = uniqueEmail("e2e-logout");

    await registerAndLogin(page, "Usuário Logout", email);
    await expect(page).toHaveURL("/");

    await page.getByRole("button", { name: "Sair" }).click();

    await expect(page).toHaveURL("/login");
  });
});
