import { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CloseIcon from '@material-ui/icons/Close';
import CustomInput from "components/CustomInput/CustomInput.js";
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors } from "../lib/actions/userAction";
import { useAlert } from 'react-alert';
import Spinner from "components/loaders/spinner";


export default function SignIn(props) {
  const { setShowLoginModal, setShowSigninModal, classes } = props
  const { error, loading } = useSelector(state => state.user)
  const alert = useAlert()


  const dispatch = useDispatch()
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await dispatch(login(
      data.get('email'),
      data.get('password'),
      () => {
        setShowLoginModal(false)
      }
    ))

  };

  useEffect(() => {
    if (error) {
      alert.error(error.message)
      dispatch(clearErrors());
    }

  }, [error])

  return (
    <div className={classes.modal}  >
      <Container component="main" maxWidth="xs">

        <Box
          className={classes.loginForm}
          sx={{
            display: 'flex',
            borderRadius: '8px',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            position: 'relative',
            padding: '2rem',

          }}
        >
          {/* <Avatar style={{ background: 'linear-gradient(60deg, #ab47bc, #8e24aa)' }} >
            <LockOutlinedIcon />

          </Avatar> */}
          <img src={'/assets/img/logosample.png'} style={{ height: '50px' }} />
          <Typography style={{ color: 'gray' }} component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate >

            <CustomInput

              labelText="Email"
              id="email"

              className={classes.form}
              formControlProps={{
                fullWidth: true,
                className: classes.formMargin0
              }}
            />

            <CustomInput
              labelText="Password"
              id="password"
              inputProps={{ type: 'password' }}
              formControlProps={{
                fullWidth: true,
                className: classes.form
              }}
            />
            <FormControlLabel
              style={{ marginTop: '1rem' }}
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              style={{ marginTop: '1rem', color: 'white', background: 'linear-gradient(60deg, #ab47bc, #8e24aa)' }}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {
                loading ?
                  <Spinner style={{width:'1rem',height:'1rem'}}  />
                  :
                  <>
                    Sign In
                  </>

              }

            </Button>



            <Link href="#" variant="body2">
              <p style={{ textAlign: 'right' }} >Forgot password?</p>
            </Link>

            <div style={{ marginTop: '2rem' }} >
              <Link href="#" variant="body2" onClick={() => {
                setShowLoginModal(false)
                setShowSigninModal(true)
              }} >

                <p style={{ textAlign: 'center' }} >Don't have an account? Sign Up</p>
              </Link>
            </div>

          </Box>
          <CloseIcon style={{ position: 'absolute', top: 0, right: 0, color: 'gray', cursor: 'pointer' }} onClick={() => setShowLoginModal(false)} />
        </Box>



      </Container>
    </div>
  );
}