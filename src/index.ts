import serverless from "serverless-http";

import { app } from "server/app";
import { attachPrivateRoutes } from "./server/routes";

export const handler = async (event: any, context: any) => {
  app.use("/.netlify/functions/index", attachPrivateRoutes());
  return await serverless(app)(event, context);
};
