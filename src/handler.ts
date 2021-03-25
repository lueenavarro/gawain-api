import serverless from "serverless-http";

import { app, initializeApp } from "server/app";

export const handler = async (event: any, context: any) => {
    await initializeApp("/.netlify/functions/handler");
    return serverless(app)(event, context);
  };