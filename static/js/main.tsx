import "mobx-react-lite/batchingForReactDom";
import React from "react";
import ReactDOM from "react-dom";
import issues from "services/issues";
import App from "./app";
import noopConsole from "./noop-console";

export const main = async (): Promise<void> => {
  const hello = `
  Hello! Coded by us:
  🧐matt@gun.net.au | @ktingvoar
  😋ramkumarshankar@hey.com | @ramkumarshankar
  
  Version: ${process.env.REACT_APP_VERSION}
  `;
  console.log(hello);

  // Disable all logging in prod
  if (process.env && process.env.NODE_ENV === "production") noopConsole();

  await issues.init();

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
};
