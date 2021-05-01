import * as tasks from "controllers/tasks";
import * as user from "controllers/user";
import express from "express";

export const attachPrivateRoutes = () => {
  const routes = express.Router();
  routes.get("/", (_req, res) => res.respond("ONESTEP API"));
  routes.get("/tasks", tasks.find);
  routes.post("/tasks", tasks.create);
  routes.post("/tasks/move", tasks.move);
  routes.patch("/tasks/complete/:id", tasks.complete);
  routes.delete("/tasks/:id", tasks.remove);

  routes.get("/user", user.findUser)
  routes.post("/user/signup", user.signup)
  routes.post("/user/login")
  return routes;
};
