import express from "express";

import * as tasks from "controllers/tasks";
import * as user from "controllers/user";
import * as token from "controllers/token";
import { authorize } from "middleware/authorize";

export const attachPrivateRoutes = () => {
  const routes = express.Router();
  routes.get("/", (_req, res) => res.respond("ONESTEP API"));
  routes.get("/tasks", authorize, tasks.find);
  routes.post("/tasks", authorize, tasks.create);
  routes.post("/tasks/move", authorize, tasks.move);
  routes.patch("/tasks/complete/:id", authorize, tasks.complete);
  routes.delete("/tasks/:id", authorize, tasks.remove);

  routes.get("/user", user.findUser);
  routes.get("/user/logout", user.logout);
  routes.post("/user/login", user.login);
  routes.post("/user/signup", user.signup);

  routes.get("/token/decode", token.getUserFromAccessToken);
  routes.get("/token/refresh", token.refreshAccessToken);

  return routes;
};
