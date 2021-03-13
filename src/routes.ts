import * as tasks from "controllers/tasks";

export const attachPrivateRoutes = (app: any): void => {
  app.get("/tasks", tasks.find);
  app.post("/tasks", tasks.create);
  app.post("/tasks/move", tasks.move);
  app.patch("/tasks/complete/:id", tasks.complete);
  app.delete("/tasks/:id", tasks.remove);
};
