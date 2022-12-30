import { MemoryRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Grid } from '@mui/material';
import NavBar from '../containers/NavBar';
import Main from '../containers/Main';
import Project from '../containers/Project';
import Movements from '../containers/Movements';

const gridStyles = {
  minWidth: '100vw',
};

export default function App() {
  return (
    <Grid container spacing={1} sx={{ ...gridStyles }} direction="column">
      <MemoryRouter>
        <Grid item>
          <NavBar />
        </Grid>
        <Grid item>
          <Main>
            <Routes>
              <Route path="/" element={<Project />} />
              <Route path="/movement/:idProject" element={<Movements />} />
            </Routes>
          </Main>
        </Grid>
      </MemoryRouter>
    </Grid>
  );
}
