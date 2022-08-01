import { useEffect } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import DeleteForever from "@material-ui/icons/DeleteForever";
import CloudDownload from "@material-ui/icons/CloudDownload";

// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";
import { useDispatch, useSelector } from "react-redux";
import { deleteDesigns, designProps, getAllDesigns } from "../../lib/actions/designAction";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

import { useAlert } from 'react-alert';
import { Typography } from "@material-ui/core";
import { designProps as initialDesign } from "../../lib/reducers/designPropsReducer";
import { Button } from "@material-ui/core";
import Router from "next/router";
import Spinner from "../../components/loaders/spinner";

function Dashboard() {

  const alert = useAlert()
  const useStyles = makeStyles(styles);
  const classes = useStyles();


  const { designs, loading } = useSelector(state => state.designProps);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDesigns());

  }, [])

  const handleEdit = (design) => {
    dispatch(designProps({ ...initialDesign, ...design }));
    Router.push("/admin/newdesign");
  }

  const handleDelete = (design) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className={classes.alert}>
            <Typography style={{ margin: 0 }} >Delete {design.text}</Typography>
            <p>Are you sure you want to delete this Design?</p>
            <div>
              <Button onClick={onClose} color="secondary" className={classes.confirmNo} >No</Button>
              <Button variant="outlined" color="danger" className={classes.confirmYes}
                onClick={() => dispatch(deleteDesigns(design._id, alert, onClose))
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
    <>
      <div>
        <GridContainer>

          {designs.map((design) => (
            <GridItem xs={12} sm={12} md={4}>
              <Card chart>
                <CardHeader color="primary" style={{ padding: 0 }}>

                  <img style={{ background: 'white', width: '100%',height:'20rem', objectFit: 'cover' }} className="ct-chart" src={design.url} />
                </CardHeader>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 className={classes.cardTitle}>{design.text}</h4>
                    <div className={classes.stats}>
                      {/* <div> <CloudDownload /> STL</div>
                      <div> <CloudDownload style={{ marginLeft: '.5rem' }} /> OBJ</div> */}
                    </div>
                  </div>
                  <p className={classes.cardCategory}>
                    <div style={{ display: 'flex', marginBottom: '.5rem' }}>
                      {/* <AccessTime style={{marginRight: '.5rem', marginBottom: '.5rem'}} /> */}
                      Created on {design.createdAt}
                    </div>
                    {/* <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                time and some other parameter */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ borderRadius: '50%', backgroundColor: design.base, width: '1rem', height: '1rem', color: design.color, marginRight: '.25rem' }}></div>
                      base {design.currStoneShape?<>/ {design.length} mm with {design.currStoneShape}</>:''}
                    </div>
                  </p>
                </CardBody>
                <CardFooter chart>
                  <div className={classes.stats}>
                    <div onClick={() => handleEdit(design)} style={{ cursor: 'pointer' }}>
                      <Edit /> Edit
                    </div>
                    <div onClick={() => handleDelete(design)} style={{ cursor: 'pointer' }}>
                      <DeleteForever style={{ marginLeft: '1rem' }} /> Delete
                    </div>

                  </div>
                </CardFooter>
              </Card>
            </GridItem>
          ))}

        </GridContainer>

      </div>

      {loading && 
      <div style={{height:'70vh'}} className={classes.flexRow} >
        <Spinner style={{ height: '2rem', width: '2rem', alignSelf: 'center' }} />
      </div>}
     
      </>
      );
}

      Dashboard.layout = Admin;

      export default Dashboard;
