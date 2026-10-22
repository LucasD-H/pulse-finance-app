// Aumenta a interface Request do Express para carregar o id do usuário
// autenticado, preenchido pelo middleware `ensureAuthenticated`.
declare namespace Express {
  export interface Request {
    userId?: string;
  }
}
