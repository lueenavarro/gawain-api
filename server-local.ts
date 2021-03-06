import "module-alias/register";
import "dotenv/config";

import { app, initializeApp } from "./src/server/app";

initializeApp();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening at port ${port}`));
