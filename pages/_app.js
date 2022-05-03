
import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Router from "next/router";
import { Provider } from "react-redux";
import { wrapper, store } from "../lib/store";
import PageChange from "components/PageChange/PageChange.js";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import './app.css'
import "assets/css/nextjs-material-dashboard.css?v=1.1.0";

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  transition: transitions.SCALE
}



Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  document.body.classList.add("body-page-transition");
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

export default class MyApp extends App {

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <Provider store={store} >
        <AlertProvider template={AlertTemplate} {...options}>
  
            <Layout>
              <Component {...pageProps} />
            </Layout>
          
        </AlertProvider>
      </Provider>
    );
  }
}
