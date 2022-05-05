import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { useDispatch } from 'react-redux';


const pages = []; // ['Products', 'Pricing', 'Blog'];
const settings = [
  { text: 'Profile', link: 'user-profile' } ,
  {  text: 'Designs', link : 'dashboard' },
];

const MenuAppBar = () => {

  const useStyles = makeStyles({
    newDesign:{
      borderColor:'white',
      color:'white'
    },
    flexRow:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
      backgroundColor: "rgba(77,77,77,0.6)",
      zIndex: "100",
      display: 'flex',
      alignItems: 'center',
  
    },
    form: {
      marginTop: '1rem !important'
    },
    formMargin0: {
      marginTop: '0rem !important'
    },
  
  });
  
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showSigninModal, setShowSigninModal] = React.useState(false);
  const classes = useStyles();
  const {isAuthenticated,user} = useSelector(state=>state.user)
  const dispatch = useDispatch()
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };



  return (
    <AppBar style={{background:'linear-gradient(60deg, #ab47bc, #8e24aa)'}} position="static">

        <Toolbar  >
        
          <div className={classes.flexRow} >
          <img src="https://freepngimg.com/thumb/sparkle/27358-8-sparkle-transparent-background.png" style={{ height: '80px'}}/>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          </div>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
           
            </Menu>
          </Box>
         
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Link style={{marginRight:'1vmax'}} href= '/admin/newdesign'> 
        <Button  className={classes.newDesign} variant="outlined">New Design</Button>
        </Link>
          
        {isAuthenticated?
        <> 
        
        <Box sx={{textAlign:'center',marginLeft:'1vmax'}}>
          Welcome
         <br/>
          {user.firstName}
          </Box>
          
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Link href={setting.link}>
                    <Typography >{setting.text}</Typography>
                  </Link>
                </MenuItem>
              ))}
                <MenuItem onClick={()=>dispatch({ type: "LOGOUT_SUCCESS" })}>
                  <Link href=' '>
                    <Typography >Logout</Typography>
                  </Link>
                </MenuItem>
            </Menu>
          </Box>
          </>
          :
          <Button onClick={()=>setShowLoginModal(true)} className={classes.newDesign} variant="outlined">Sign in</Button>
          }
{
  showLoginModal&&
  <LoginModal setShowLoginModal={setShowLoginModal} setShowSigninModal={setShowSigninModal} classes={classes} />
  
}
{
  showSigninModal&&
  <SignupModal setShowLoginModal={setShowLoginModal} setShowSigninModal={setShowSigninModal} classes={classes} />
  
}
         
          
        </Toolbar>
     
    </AppBar>
  );
};
export default MenuAppBar;
