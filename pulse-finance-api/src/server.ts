import "dotenv/config";
import { app } from "./app.js";

// Falha rápido e com uma mensagem clara se faltar alguma variável de
// ambiente essencial, em vez de deixar o erro aparecer de forma confusa
// só na primeira requisição que precisar dela (ex: "secretOrPrivateKey
// must have a value" no login).
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"] as const;

for (const name of requiredEnvVars) {
  if (!process.env[name]) {
    console.error(`❌ Variável de ambiente obrigatória ausente: ${name}`);
    process.exit(1);
  }
}

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
