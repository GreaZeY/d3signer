import React from "react";
import { useRouter } from "next/router";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import MenuAppBar from "./menubar.js"


import styles from "assets/jss/nextjs-material-dashboard/layouts/adminStyle.js";


let ps;

export default function Admin({ children, ...rest }) {
  // used for checking current route
  const router = useRouter();
  // styles
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions

 


  const getRoute = () => {
    return router.pathname !== "/admin/maps";
  };

  // const [color, setColor] = React.useState("white");
  // const [fixedClasses, setFixedClasses] = React.useState("dropdown show");
  // const [mobileOpen, setMobileOpen] = React.useState(false);

  // const handleColorClick = (color) => {
  //   setColor(color);
  // };
  // const handleFixedClick = () => {
  //   if (fixedClasses === "dropdown") {
  //     setFixedClasses("dropdown show");
  //   } else {
  //     setFixedClasses("dropdown");
  //   }
  // };
  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen);
  // };
  // const resizeFunction = () => {
  //   if (window.innerWidth >= 960) {
  //     setMobileOpen(false);
  //   }
  // };

  // initialize and destroy the PerfectScrollbar plugin
  // React.useEffect(() => {
  //   if (navigator.platform.indexOf("Win") > -1) {
  //     ps = new PerfectScrollbar(mainPanel.current, {
  //       suppressScrollX: true,
  //       suppressScrollY: false,
  //     });
  //     document.body.style.overflow = "hidden";
  //   }
  //   window.addEventListener("resize", resizeFunction);
  //   // Specify how to clean up after this effect:
  //   return function cleanup() {
  //     if (navigator.platform.indexOf("Win") > -1) {
  //       ps.destroy();
  //     }
  //     window.removeEventListener("resize", resizeFunction);
  //   };
  // }, [mainPanel]);
  return (
    <div >
      {/* <Sidebar
        routes={routes}
        logoText={"Creative Tim"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      /> */}
      <div ref={mainPanel}>
        <MenuAppBar></MenuAppBar>
        {/* <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        /> */}
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content} style={{marginTop: 0}}>
            <div className={classes.container}>{children}</div>
          </div>
        ) : (
          <div className={classes.map}>{children}</div>
        )}
        {/* {getRoute() ? <Footer /> : null} */}
        
      </div>
    </div>
  );
}
