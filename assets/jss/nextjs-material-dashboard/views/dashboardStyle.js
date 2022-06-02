import {
  successColor,
  whiteColor,
  grayColor,
  hexToRgb,
} from "assets/jss/nextjs-material-dashboard.js";

const dashboardStyle = {
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: successColor[0],
  },
  upArrowCardCategory: {
    width: "16px",
    height: "16px",
  },
  stats: {
    color: grayColor[0],
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px",
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px",
    },
  },
  cardCategory: {
    color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0",
  },
  cardCategoryWhite: {
    color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  cardTitleWhite: {
    color: whiteColor,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  confirmNo:{
    color:'black',
    fontSize:'.7rem',
    padding:'.5rem .8rem',
    transition:'.7s',
    '&:hover':{
      color:'grey !important'
    }
  },
  confirmYes:{
    fontSize:'.7rem',
    color:'red',
    borderColor:'red',
    padding:'.5rem .8rem',
    transition:'.7s',
    '&:hover':{
      color:'white',
      background:'red',
    }
  },

  
  alert:{
    borderRadius:'8px',
    background:'white',
    padding:'2rem',
    width:'40vw',
    paddingBottom:'4rem',
    '& p':{
      marginBottom:'1rem',
      fontSize:'1rem',
    },
    '& div':{
      float:'right',
 
    }
  }
};

export default dashboardStyle;
