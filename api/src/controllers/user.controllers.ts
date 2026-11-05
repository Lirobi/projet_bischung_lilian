import { Request, Response } from "express";
import { randomBytes, scryptSync } from "crypto";
import { UniqueConstraintError, ValidationError } from "sequelize";
import db from "../models";

const Users = db.users;

const MIN_PASSWORD_LENGTH = 8;

const toMessage = (err: unknown): string => (err instanceof Error ? err.message : String(err));

/** Hache le mot de passe avec un sel aléatoire, stocké sous la forme "sel:hash". */
const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

/**
 * Crée un utilisateur. Le login et l'e-mail doivent être uniques.
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  const { login, lastName, firstName, email, password } = req.body ?? {};

  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({
      message: `Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères.`
    });
    return;
  }

  try {
    const user = await Users.create({
      login,
      lastName,
      firstName,
      email,
      password: hashPassword(password)
    });
    const { password: _password, ...data } = user.get({ plain: true });
    res.status(201).json(data);
  } catch (err: unknown) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({ message: "Ce login ou cet e-mail est déjà utilisé." });
    } else if (err instanceof ValidationError) {
      res.status(400).json({
        message: "Données invalides : " + err.errors.map((e) => e.message).join(", ")
      });
    } else {
      res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur : " + toMessage(err)
      });
    }
  }
};

/**
 * Récupère la liste des utilisateurs, sans les mots de passe.
 */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Users.findAll({
      attributes: { exclude: ["password"] },
      order: [["id", "ASC"]]
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs : " + toMessage(err)
    });
  }
};

export default { create, getAll };
