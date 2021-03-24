import {app, initializeApp} from "./src/server/app";

export const runLocalServer = () => {
    initializeApp();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`listening at port ${port}`));
  };
  