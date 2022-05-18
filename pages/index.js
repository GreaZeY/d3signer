import React from "react";
import Router from "next/router";
import { Provider } from "react-redux";
import {  store } from "../lib/store";

export default function Index() {
  React.useEffect(() => {
    Router.push("/admin/newdesign");
  });

  return (
    <Provider store={store} >
  <div />
  </Provider>
  );
}
