

import { makeStyles } from "@material-ui/core/styles";

export  const useStyles = makeStyles({
    infoTip: {
      position: 'absolute',
      left: -10,
      zIndex: "100",
      display: 'flex',
      background: 'black',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      textAlign: 'center',

    },
    flexRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    main: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      "@media screen and (max-width: 640px)": {
        flexDirection: 'column',
      }
    },
    settings: {
      padding: '1rem',
    },
    preview: {
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '.5rem',
      "@media screen and (max-width: 640px)": {
        marginLeft: 0,

      }
    },
    base: {
      width: '1rem',
      height: '1rem',
      borderRadius: '50%',
      cursor: 'pointer',
      border: '2px Solid white',
      transition: '.5s',
      marginRight: '.2rem',
      "&:hover": {
        border: '2px Solid gray',
      }
    },
    stoneShape: {
      width: '1rem',
      height: '1rem',
      borderRadius: '50%',
      cursor: 'pointer',
      border: '2px Solid white',
      transition: '.5s',
      marginRight: '.2rem',
      "&:hover": {
        border: '2px Solid gray',
      }
    },
    img: {
      width: '1rem',
      height: '1rem',
      objectFit: 'cover',
    },
    symbol: {
      border: '1px solid #ECEBEB',
      width: '1rem',
      height: '1rem',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      transition: '.5s',
      justifyContent: 'center',
      marginRight: '.2rem',
      color: 'gray',
      fontSize: '12px',
      "&:hover": {
        border: '1px Solid gray',

      }
    },
    formMargin0: {
      marginTop: '0rem !important',
      marginBottom: '1rem !important'
    },
    loaderContainer: {
      height: "calc(100-10)% !important",
      background: 'black',
      position: 'absolute',
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 100
    },
    delete: {
      marginTop: '.7rem',
      cursor: 'pointer',
      transition: '.3s',
      "&:hover": {
        color: 'red'
      }
    },


    modalStyle:{
        height:'15vh',
        width:'40vw',
        background:'#2b2d42'

    }
  });