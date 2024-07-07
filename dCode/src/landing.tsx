import { Avatar, Box, Button, Checkbox, FormControlLabel, Grid, Link, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import './App.css';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Landing() {
  const navigate = useNavigate();  

  const handleSignIn = () => {
    navigate('/dcode');  
  };

  return (
    <div>
      <Typography variant="h1" gutterBottom style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)' }}>
        dCode
      </Typography>
      <Typography variant="h4" gutterBottom style={{ position: 'absolute', top: '19%', left: '50%', transform: 'translateX(-50%)' }}>
        From Code to Clarity
      </Typography>
      {/* Code below for sign in uses material-ui template for its base https://github.com/mui/material-ui/tree/v5.16.0/docs/data/material/getting-started/templates/sign-in */}
      <Box
        sx={{
          marginTop: 25,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form">
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSignIn}  
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </div>
  );
}

export default Landing;
