import React, { useEffect } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Edit from "@material-ui/icons/Edit";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import CloudDownload from "@material-ui/icons/CloudDownload";
import Cloud from "@material-ui/icons/Cloud";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
// import { bugs, website, server } from "variables/general.js";

// import {
//   dailySalesChart,
//   emailsSubscriptionChart,
//   completedTasksChart,
// } from "variables/charts.js";

import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";
import { useDispatch ,useSelector} from "react-redux";
import { deleteDesigns, getAllDesigns } from "../../lib/actions/designAction";
import Link from "next/link";

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

import { useAlert } from 'react-alert';
import { Typography } from "@material-ui/core";

import { Button } from "@material-ui/core";


function Dashboard() {

  const alert =  useAlert()
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  

  const {designs,loading}= useSelector(state => state.designProps);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDesigns());

  }, [])


  const handleDelete=(design)=>{
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className={classes.alert}>
            <Typography style={{margin:0}} >Delete {design.text}</Typography>
            <p>Are you sure you want to delete this Item?</p>
            <div>
            <Button onClick={onClose} color="secondary" className={classes.confirmNo} >No</Button>
            <Button variant="outlined" color="danger" className={classes.confirmYes} 
              onClick={() => dispatch(deleteDesigns(design._id,alert,onClose))
              }
              
            >
              Yes, Delete it!
            </Button>
            </div>
          </div>
        );
      }
    });
    

    


  }



  
  
  return (
    <div>
      {/* <h3>Your Design</h3> */}
      <GridContainer>
        {designs.map((design) => (
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="primary" style={{ padding: 0 }}>

                <img style={{ background:'white',width: '100%', height: '250px', objectFit: 'cover' }} className="ct-chart" src={design.url} />
              </CardHeader>
              <CardBody>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 className={classes.cardTitle}>{design.text}</h4>
                  <div className={classes.stats}>
                    <div> <CloudDownload /> STL</div>
                    <div> <CloudDownload style={{ marginLeft: '.5rem' }} /> OBJ</div>
                  </div>
                </div>
                <p className={classes.cardCategory}>
                  <div style={{ display: 'flex', marginBottom: '.5rem' }}>
                    {/* <AccessTime style={{marginRight: '.5rem', marginBottom: '.5rem'}} /> */}
                    Created on
                    {design.createdAt}
                  </div>
                  {/* <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                time and some other parameter */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ borderRadius: '50%', backgroundColor: design.base, width: '1rem', height: '1rem', color: design.color, marginRight: '.25rem' }}></div>
                    base / {design.length} mm with {design.currStoneShape}
                  </div>
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <Link  href='/admin/newdesign'>
                  <div style={{cursor:'pointer'}}>
                  <Edit /> Edit
                  </div>
                  </Link>
                  <div onClick={()=>handleDelete(design)} style={{cursor:'pointer'}}>
                    <DeleteForever style={{ marginLeft: '1rem' }} /> Delete
                  </div>
                  
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        ))}

      </GridContainer>

    </div>
  );
}

Dashboard.layout = Admin;

export default Dashboard;
