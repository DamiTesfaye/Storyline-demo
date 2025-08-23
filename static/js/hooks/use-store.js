import React from "react";
import { storeContext } from "contexts";
//import { AppStore } from "store";

//const store = new AppStore();
//export const useStore = () => store; /* React.useContext(storeContext) */
export const useStore = () => React.useContext(storeContext).store;
