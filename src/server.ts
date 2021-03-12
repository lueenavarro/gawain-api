import "module-alias/register";
import "dotenv/config";

import serverless from "serverless-http";
import express from "express";
import cors from "cors";

import { addRespondToResponse } from "middleware/response";
import { handleError } from "middleware/errors";
import { RouteNotFoundError } from "errors";

import { createDatabaseConnection } from "database/createConnection";

import * as tasks from "controllers/tasks";

const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection();
  } catch (error) {
    console.log(error);
  }
};

const initializeExpress = (): void => {
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(addRespondToResponse);

  const router = express.Router();
  router.get("/tasks", tasks.find);
  router.post("/tasks", tasks.create);
  router.post("/tasks/move", tasks.move);
  router.patch("/tasks/complete/:id", tasks.complete);
  router.delete("/tasks/:id", tasks.remove);
  app.use("/.netlify/functions/server", router); // path must route to lambda

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);
};

const initializeApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress();
};

let app = express();
initializeApp();

module.exports = app;
module.exports.handler = serverless(app);
