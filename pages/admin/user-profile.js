import React,{useEffect,useState} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Link from 'next/link'
import Typography from '@material-ui/core/Typography';
import { useSelector,useDispatch } from 'react-redux';
import {useRouter} from 'next/router'
import { updateProfile } from '../../lib/actions/userAction';
import { useAlert } from 'react-alert';
const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
 
};

function UserProfile() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const router = useRouter()
  const dispatch = useDispatch()
  const {isAuthenticated,user} = useSelector(state=>state.user)
  const alert =  useAlert()
  const [email,setEmail] = useState('')
  const [firstName,setFName] = useState('')
  const [lastName,setLName] = useState('')
  const [bio,setBio] = useState('')

  useEffect(()=>{
    if(!isAuthenticated){
      router.push('/admin/dashboard')
    }else{
      setEmail(user.email)
      setFName(user.firstName)
      setLName(user.lastName)
      setBio(user.bio)
    }
   
 
  },[isAuthenticated])
  
  const update=()=>{
    console.log('fdf')
    let userData = {
      email,
      firstName,
      lastName,
      bio
    }
    dispatch(updateProfile({id:user._id,userData},
      alert.success
    ))
    // setTimeout(()=>{
    //   location.reload()
    // },2000)
    
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Email address"
                    id="email-address"
                    
                    inputProps={{ type: 'email',value:email,onChange:(e)=>setEmail(e.target.value),readOnly:true }}
                    formControlProps={{
                      fullWidth: true,
                     
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    id="first-name"
                    inputProps={{ value:firstName,onChange:(e)=>setFName(e.target.value) }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last Name"
                    id="last-name"
                    inputProps={{ value:lastName,onChange:(e)=>setLName(e.target.value) }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  
                  <CustomInput
                    labelText="About me"
                    id="about-me"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 3,
                      value:bio,
                      onChange:(e)=>setBio(e.target.value) 
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button onClick={update} color="primary">Update Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={'/assets/img/faces/marc.jpg'} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardTitle}>Alec Thompson</h4>
              <p className={classes.description}>
                Don{"'"}t be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves Kanye
                I love Rick Owens’ bed design but the back is...
              </p>
              <Button color="primary" round>
                <Link href="/admin/dashboard"> 
                  <Typography textAlign="center">My Designs</Typography>
                </Link>
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

UserProfile.layout = Admin;

export default UserProfile;
