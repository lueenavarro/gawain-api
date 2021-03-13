import "dotenv/config";

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

  app.use("/.netlify/functions/index", attachPrivateRoutes());

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);
};

const initializeApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress();
};

export const app = express();
export const handler = async (event: any, context: any) => {
  await initializeApp();
  return await serverless(app)(event, context);
};
