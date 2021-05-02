import * as tasks from "controllers/tasks";
import * as user from "controllers/user";
import * as token from "controllers/token";
import express from "express";

export const attachPrivateRoutes = () => {
  const routes = express.Router();
  routes.get("/", (_req, res) => res.respond("ONESTEP API"));
  routes.get("/tasks", tasks.find);
  routes.post("/tasks", tasks.create);
  routes.post("/tasks/move", tasks.move);
  routes.patch("/tasks/complete/:id", tasks.complete);
  routes.delete("/tasks/:id", tasks.remove);

  routes.get("/user", user.findUser);
  routes.get("/user/logout", user.logout)
  routes.post("/user/login", user.login);
  routes.post("/user/signup", user.signup);

  routes.get("/token/decode", token.getUserFromAccessToken);
  routes.get("/token/refresh", token.refreshAccessToken);

  return routes;
};
