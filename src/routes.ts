import * as tasks from "controllers/tasks";
import { Router } from "express";

export const attachPrivateRoutes = (router: Router): void => {
  router.get("/tasks", tasks.find);
  router.post("/tasks", tasks.create);
  router.post("/tasks/move", tasks.move);
  router.patch("/tasks/complete/:id", tasks.complete);
  router.delete("/tasks/:id", tasks.remove);
};
