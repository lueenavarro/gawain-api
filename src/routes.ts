import * as tasks from "controllers/tasks";
import express from "express";

export const attachPrivateRoutes = (app: any): void => {
  const taskRoutes = express.Router();
  taskRoutes.get("/", tasks.find);
  taskRoutes.post("/", tasks.create);
  taskRoutes.post("/move", tasks.move);
  taskRoutes.patch("/complete/:id", tasks.complete);
  taskRoutes.delete("/:id", tasks.remove);
  console.log(taskRoutes);
  app.use("/tasks", taskRoutes);
};
