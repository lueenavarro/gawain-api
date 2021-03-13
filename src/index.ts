import serverless from "serverless-http";
import express from "express";
import cors from "cors";

import { addRespondToResponse } from "middleware/response";
import { handleError } from "middleware/errors";
import { RouteNotFoundError } from "errors";

import { createDatabaseConnection } from "database/createConnection";
import { attachPrivateRoutes } from "routes";

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

  app.use(rootPath, attachPrivateRoutes());

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);
};

const initializeApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress();
};

let rootPath = "/";
const app = express();

export const handler = async (event: any, context: any) => {
  rootPath = "/.netlify/functions/index";
  await initializeApp();
  return serverless(app)(event, context);
};

export const runLocalServer = () => {
  initializeApp();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`listening at port ${port}`));
};
