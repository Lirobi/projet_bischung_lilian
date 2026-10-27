/** Corps envoyé à l'API pour créer un compte. */
export interface SignUpRequest {
  login: string;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
}

/** Utilisateur renvoyé par l'API (sans mot de passe). */
export interface User {
  id: number;
  login: string;
  lastName: string;
  firstName: string;
  email: string;
}
