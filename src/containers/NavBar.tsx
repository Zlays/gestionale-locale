import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, IconButton, Stack, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar disableGutters>
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Link to="/" onClick={() => window.location.reload()}>
            <IconButton aria-label="delete" size="large" onClick={() => {}}>
              <HomeIcon fontSize="inherit" />
            </IconButton>
          </Link>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
