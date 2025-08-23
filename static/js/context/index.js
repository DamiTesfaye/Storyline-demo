import React from "react";
import { AppStore } from "store";

export const storeContext = React.createContext({ store: new AppStore() });
