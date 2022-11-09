import React from "react";
import { Provider } from "react-redux";
import {  store } from "../lib/store";
import NewDesign from "../components/NewDesignComponent/NewDesign";

export default function Index() {


  return (
    <Provider store={store} >
      <NewDesign/>
  </Provider>
  );
}
