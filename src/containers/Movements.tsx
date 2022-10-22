import React, { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import dayjs, { Dayjs } from 'dayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { modalStyle } from 'utils/style';
import EditIcon from '@mui/icons-material/Edit';
import {
  addMovement,
  editMovements,
  getMovementsByGroup,
  removeMovement,
} from '../services/ReactDatabaseService';
import { Imovements, Iproject } from '../utils/DbInterface';
import { Column } from '../utils/Interface';

const columns: Column = [
  /* { id: 'id', label: 'Id', minWidth: 170, align: 'left' }, */
  { id: 'description', label: 'Descrizione', minWidth: 170, align: 'left' },
  { id: 'value', label: 'Valore', minWidth: 170, align: 'left' },
  {
    id: 'date',
    label: 'Date',
    minWidth: 170,
    align: 'left',
    format: (value: string) => moment(value).format('DD/MM/yyyy'),
  },
  { id: 'actions', label: 'Azioni', minWidth: 170, align: 'left' },
];

const Movements = () => {
  const { idProject, nominativeValue } = useParams();

  const [value, setValue] = React.useState<number>(0);
  const [description, setDescription] = React.useState<string>('');
  const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()));

  const [refresh, setRefresh] = React.useState<number>(0);
  const [error, setError] = React.useState<Error | null>();

  const [movements, setMovements] = useState<Imovements[]>([]);
  const [currentTotal, setCurrentTotal] = React.useState<number>(0);
  const [percent, setPercent] = React.useState<number>(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const [toEdit, setToEdit] = React.useState<Imovements>({
    date: '',
    description: '',
    id: null,
    idProject: 0,
    value: 0,
  });
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalClose = () => setModalOpen(false);

  useEffect(() => {
    getMovementsByGroup(idProject)
      .then((response) => {
        response.sort((a: Imovements, b: Imovements) => {
          return new Date(b.date) - new Date(a.date);
        });
        setMovements(response);

        if (refresh != 0 && response.length <= 0) {
          setInterval(function () {
            setRefresh(refresh + 1);
          }, 250);
        }
      })
      .catch((err: Error | null) => setError(err));
  }, [refresh]);

  useEffect(() => {
    setCurrentTotal(
      movements.reduce((accumulator, object: Imovements) => {
        return accumulator + object.value;
      }, 0)
    );
  }, [movements]);

  useEffect(() => {
    setPercent((nominativeValue * currentTotal) / 100);
  }, [currentTotal]);

  function addMovementhandler() {
    const movement: Imovements = {
      id: null,
      value,
      date: `${date?.toString()}`,
      description,
      idProject,
    };
    addMovement(movement)
      .then(() => {
        setRefresh(refresh + 1);
        setDate(dayjs(new Date()));
        setDescription('');
        setValue(0);
      })
      .catch((err) => {
        console.log(`error ${err}`);
        setError(err);
      });
  }

  function removeMovementHandler(id: number) {
    removeMovement(id)
      .then(() => {
        setRefresh(refresh + 1);
      })
      .catch((err) => {
        console.log(`error ${err}`);
        setError(err);
      });
  }

  function handleValueChange(event) {
    setValue(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  function handleDataPickerChange(newValue: Dayjs | null) {
    setDate(newValue);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function openEditHandler(id: number) {
    setToEdit(movements[id]);
    setModalOpen(true);
  }

  function editHandler() {
    editMovements(toEdit)
      .then(() => {
        setRefresh((prevState) => prevState + 1);
      })
      .catch((err) => {
        console.log(`error ${err}`);
        setError(err);
      });
    setModalOpen(false);
  }

  function handleEditDescriptionChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setToEdit((prevState: Imovements) => {
      return {
        ...prevState,
        description: event.target.value,
      };
    });
  }

  function handleEditValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setToEdit((prevState: Imovements) => {
      return {
        ...prevState,
        value: event.target.value,
      };
    });
  }

  function handleEditDataPickerChange(newValue: Dayjs | null) {
    setToEdit((prevState: Imovements) => {
      return {
        ...prevState,
        date: newValue.toString(),
      };
    });
  }

  return (
    <>
      <Grid
        container
        spacing={2}
        direction="row"
        sx={{ flexGrow: 1 }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={8} md={8} justifyContent="flex-end" alignItems="center">
          <TextField
            id="description"
            label="Descrizione"
            placeholder="Descrizione"
            value={description}
            onChange={handleDescriptionChange}
            multiline
          />
          <TextField
            id="value"
            label="Valore"
            value={value}
            onChange={handleValueChange}
            placeholder="Valore"
            inputProps={{
              inputMode: 'numeric',
              pattern: '/^-?d+(?:.d+)?$/g',
            }}
            type="number"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Data"
              inputFormat="YYYY/MM/DD"
              value={date}
              onChange={handleDataPickerChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <IconButton
            aria-label="add"
            size="large"
            onClick={addMovementhandler}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </Grid>
        <Grid item xs={4} md={4}>
          <Stack spacing={2} direction="row">
            <Chip
              color={
                percent >= 100 ? 'success' : percent <= 50 ? 'error' : 'warning'
              }
              label={`Valore nominale: ${nominativeValue} €`}
              style={{ right: 0 }}
            />
            <Chip
              color={
                percent >= 100 ? 'success' : percent <= 50 ? 'error' : 'warning'
              }
              label={`Totale fatturato: ${currentTotal} €`}
              style={{ right: 0 }}
            />
            <Chip
              color={
                percent >= 100 ? 'success' : percent <= 50 ? 'error' : 'warning'
              }
              label={`Differenza: ${nominativeValue - currentTotal} €`}
              style={{ right: 0 }}
            />
          </Stack>
        </Grid>
      </Grid>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: '85vh' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {movements
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: Imovements, index: number) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        if (column.id === 'actions') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <IconButton
                                aria-label="edit"
                                size="large"
                                onClick={() => openEditHandler(index)}
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                size="large"
                                onClick={() => removeMovementHandler(row.id)}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </TableCell>
                          );
                        }
                        const value = column.format
                          ? column.format(row[column.id])
                          : row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              color:
                                column.id === 'value'
                                  ? value <= 0
                                    ? 'red'
                                    : 'green'
                                  : 'black',
                              minWidth: column.minWidth,
                            }}
                          >
                            <Typography
                              variant="body1"
                              style={{ whiteSpace: 'pre-line' }}
                            >
                              {column.id === 'value' ? `${value} €` : value}
                            </Typography>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={movements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <TextField
            id="description"
            label="Descrizione"
            placeholder="Descrizione"
            value={toEdit.description}
            onChange={handleEditDescriptionChange}
            multiline
          />
          <TextField
            id="value"
            label="Valore"
            value={toEdit.value}
            onChange={handleEditValueChange}
            placeholder="Valore"
            inputProps={{
              inputMode: 'numeric',
              pattern: '/^-?d+(?:.d+)?$/g',
            }}
            type="number"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Data"
              inputFormat="YYYY/MM/DD"
              value={toEdit.date}
              onChange={handleEditDataPickerChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <IconButton aria-label="add" size="large" onClick={editHandler}>
            <SaveAsIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Modal>
    </>
  );
};

export default Movements;
