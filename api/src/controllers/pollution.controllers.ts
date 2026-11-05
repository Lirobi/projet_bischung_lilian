import { Request, Response } from "express";
import { ValidationError } from "sequelize";
import db from "../models";
import { PollutionCreationAttributes } from "../models/pollutions.model";

const Pollutions = db.pollutions;

const toMessage = (err: unknown): string => (err instanceof Error ? err.message : String(err));

/** Lit l'id de l'URL, null s'il n'est pas un entier positif. */
const readId = (req: Request): number | null => {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

/** Garde uniquement les champs modifiables (l'id est attribué par la base). */
const readBody = (body: Record<string, unknown>): PollutionCreationAttributes => ({
  title: body.title as string,
  type: body.type as string,
  description: body.description as string,
  observedAt: body.observedAt as string,
  location: body.location as string,
  latitude: body.latitude as number,
  longitude: body.longitude as number,
  photoUrl: (body.photoUrl as string | null) ?? null
});

const sendError = (res: Response, err: unknown, context: string): void => {
  if (err instanceof ValidationError) {
    res.status(400).json({
      message: "Données invalides : " + err.errors.map((e) => e.message).join(", ")
    });
    return;
  }
  res.status(500).json({ message: `${context} : ` + toMessage(err) });
};

/**
 * Récupère la liste de toutes les pollutions.
 */
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Pollutions.findAll({
      order: [["id", "ASC"]]
    });
    res.status(200).json(data);
  } catch (err: unknown) {
    sendError(res, err, "Erreur lors de la récupération des pollutions");
  }
};

/**
 * Récupère une pollution par son identifiant.
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = readId(req);
  if (id === null) {
    res.status(400).json({ message: "Identifiant invalide." });
    return;
  }
  try {
    const data = await Pollutions.findByPk(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`
      });
    }
  } catch (err: unknown) {
    sendError(res, err, `Erreur lors de la récupération de la pollution id=${id}`);
  }
};

/**
 * Ajoute une pollution.
 */
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Pollutions.create(readBody(req.body ?? {}));
    res.status(201).json(data);
  } catch (err: unknown) {
    sendError(res, err, "Erreur lors de l'ajout de la pollution");
  }
};

/**
 * Modifie une pollution existante.
 */
export const update = async (req: Request, res: Response): Promise<void> => {
  const id = readId(req);
  if (id === null) {
    res.status(400).json({ message: "Identifiant invalide." });
    return;
  }
  try {
    const pollution = await Pollutions.findByPk(id);
    if (!pollution) {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`
      });
      return;
    }
    await pollution.update(readBody(req.body ?? {}));
    res.status(200).json(pollution);
  } catch (err: unknown) {
    sendError(res, err, `Erreur lors de la modification de la pollution id=${id}`);
  }
};

/**
 * Supprime une pollution.
 */
export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = readId(req);
  if (id === null) {
    res.status(400).json({ message: "Identifiant invalide." });
    return;
  }
  try {
    const deleted = await Pollutions.destroy({ where: { id } });
    if (deleted === 0) {
      res.status(404).json({
        message: `Aucune pollution trouvée avec l'id=${id}.`
      });
      return;
    }
    res.status(204).send();
  } catch (err: unknown) {
    sendError(res, err, `Erreur lors de la suppression de la pollution id=${id}`);
  }
};

export default { getAll, getById, create, update, remove };
