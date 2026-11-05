import { Application, Router } from "express";
import userController from "../controllers/user.controllers";

export default (app: Application): void => {
  const router = Router();

  // Route POST /api/users
  router.post("/", userController.create);

  // Route GET /api/users
  router.get("/", userController.getAll);

  // Route POST /api/users/login (authentification fictive)
  router.post("/login", userController.login);

  // Route DELETE /api/users/:id
  router.delete("/:id", userController.remove);

  app.use("/api/users", router);
};
