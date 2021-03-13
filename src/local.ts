import "module-alias/register";
import "dotenv/config";

import { app } from "server/app";
import { attachPrivateRoutes } from "server/routes";

app.use("/", attachPrivateRoutes());

const port = process.env.PORT || 5000;
app.listen(() => console.log(`listening at port ${port}`));
