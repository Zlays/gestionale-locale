import { MemoryRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Grid } from '@mui/material';
import NavBar from '../containers/NavBar';
import Main from '../containers/Main';
import Project from '../containers/Project';
import Movements from '../containers/Movements';

const gridStyles = {
  minWidth: '100vw',
  minHeight: '100vh',
};

export default function App() {
  return (
    <Grid container spacing={2} sx={{ ...gridStyles }} direction="column">
      <MemoryRouter>
        <Grid item xs={12}>
          <NavBar />
        </Grid>
        <Grid item xs={12}>
          <Main>
            <Routes>
              <Route path="/" element={<Project />} />
              <Route
                path="/movement/:idProject/:nominativeValue"
                element={<Movements />}
              />
            </Routes>
          </Main>
        </Grid>
      </MemoryRouter>
    </Grid>
  );
}
