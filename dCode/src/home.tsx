// src/home.tsx
import { Outlet, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

function Home() {
  return (
    <div>
      <AppBar>
        <Toolbar>
          <Button color="inherit" component={Link} to="/dcode/problems">Problems</Button>
          <Button color="inherit" component={Link} to="/dcode/placement">Placement</Button>
          <Button color="inherit" component={Link} to="/dcode/about">About</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default Home;
