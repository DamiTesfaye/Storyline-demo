import React from "react";
import { storeContext } from "context";
import type { AppStore } from "store";

export const useStore = (): AppStore => React.useContext(storeContext).store;
