// src/home.tsx
import { Outlet, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';

function Home() {
  const navigate = useNavigate();  

  const handleLogout = () => {
    navigate('/logout');
    window.location.reload();
    navigate('/');
  };

  return (
    <div>
      <AppBar>
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
          <Grid>
          <Button color="inherit" component={Link} to="/dcode/problems">Problems</Button>
          <Button color="inherit" component={Link} to="/dcode/placement">Placement</Button>
          <Button color="inherit" component={Link} to="/dcode/about">About</Button>
          </Grid>
          <Grid sx={{display: "flex", justifyContent: "center", height: 35, width: 80, borderRadius: "8px", bgcolor: "#ee4444"}}>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Grid>
          </Grid> 
        </Toolbar>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default Home;
