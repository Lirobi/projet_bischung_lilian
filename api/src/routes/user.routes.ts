import { Application, Router } from "express";
import userController from "../controllers/user.controllers";

export default (app: Application): void => {
  const router = Router();

  // Route POST /api/users
  router.post("/", userController.create);

  // Route GET /api/users
  router.get("/", userController.getAll);

  app.use("/api/users", router);
};
