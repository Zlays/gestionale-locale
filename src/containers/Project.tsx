import React, { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
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
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import CloseIcon from '@mui/icons-material/Close';
import {
  addProject,
  editProject,
  getAllProjects,
  removeProject,
} from '../services/ReactDatabaseService';
import { Column } from '../utils/Interface';
import { modalStyle } from '../utils/style';
import { Iproject } from '../utils/DbInterface';

const columns: Column = [
  /*  { id: 'id', label: 'Id', minWidth: 170, align: 'left' }, */
  { id: 'name', label: 'Nome', minWidth: 170, align: 'left' },
  {
    id: 'nominative_value',
    label: 'Valore nominale',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'current_value',
    label: 'Valore corrente',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'start_date',
    label: 'Data di Inizio',
    minWidth: 170,
    align: 'left',
    format: (value: string) => moment(value).format('DD/MM/yyyy'),
  },
  {
    id: 'end_date',
    label: 'Data di Fine',
    minWidth: 170,
    align: 'left',
    format: (value: string) => moment(value).format('DD/MM/yyyy'),
  },
  { id: 'actions', label: 'Azioni', minWidth: 170, align: 'left' },
];

const Project = () => {
  const [name, setName] = React.useState<string>('');
  const [nominalValue, setNominalValue] = React.useState<number>(0);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    dayjs(new Date())
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs(new Date()));

  const [refresh, setRefresh] = React.useState<number>(0);
  const [error, setError] = React.useState<Error | null>();

  const [data, setData] = useState<Iproject[]>([]);
  const [nominativeTotal, setNominativeTotal] = React.useState<number>(0);
  const [currentTotal, setCurrentTotal] = React.useState<number>(0);
  const [percent, setPercent] = React.useState<number>(0);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const [toEdit, setToEdit] = React.useState<Iproject>({});
  const [modalOpen, setModalOpen] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<number>(0);
  const [deleteModalOpen, setdeleteModalOpen] = React.useState(false);
  const handleModalClose = () => {
    setToDelete(0);
    setToEdit({});
    setModalOpen(false);
    setdeleteModalOpen(false);
  };

  useEffect(() => {
    getAllProjects()
      .then((response) => {
        response.sort((a: Iproject, b: Iproject) => {
          return b.name === 'Generali'
            ? true
            : new Date(b.date) - new Date(a.date);
        });
        setData(response);
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
      data.reduce((accumulator, object: Iproject) => {
        return accumulator + object.current_value;
      }, 0)
    );
    setNominativeTotal(
      data.reduce((accumulator, object: Iproject) => {
        return accumulator + object.nominative_value;
      }, 0)
    );
  }, [data]);

  useEffect(() => {
    setPercent((currentTotal / nominativeTotal) * 100);
  }, [currentTotal, nominativeTotal]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleStartDatePickerChange(newValue: Dayjs | null) {
    setStartDate(newValue);
  }

  function handleEndDatePickerChange(newValue: Dayjs | null) {
    setEndDate(newValue);
  }

  function handleEditNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setToEdit((prevState: Iproject) => {
      return {
        ...prevState,
        name: event.target.value,
      };
    });
  }

  function handleEditStartDatePickerChange(newValue: Dayjs | null) {
    setToEdit((prevState: Iproject) => {
      return {
        ...prevState,
        start_date: newValue.toString(),
      };
    });
  }

  function handleEditEndDatePickerChange(newValue: Dayjs | null) {
    setToEdit((prevState: Iproject) => {
      return {
        ...prevState,
        end_date: newValue.toString(),
      };
    });
  }

  function addProjectHandler() {
    addProject(name, nominalValue, startDate.toString(), endDate.toString())
      .then(() => {
        setRefresh(refresh + 1);
        setStartDate(dayjs(new Date()));
        setEndDate(dayjs(new Date()));
        setName('');
        setNominalValue(0);
      })
      .catch((err) => {
        console.log(`error ${err}`);
        setError(err);
      });
  }

  function openDeleteHandle(id: number) {
    setToDelete(id);
    setdeleteModalOpen(true);
  }

  function removeProjectHandler() {
    removeProject(toDelete)
      .then(() => {
        setRefresh(refresh + 1);
      })
      .catch((err) => {
        console.log(`error ${err}`);
        setError(err);
      });
    handleModalClose();
  }

  function openEditHandler(id: number) {
    setToEdit(data[id]);
    setModalOpen(true);
  }

  function editHandler() {
    editProject(toEdit)
      .then(() => {
        setRefresh((prevState) => prevState + 1);
      })
      .catch((err) => {
        console.log(`error ${err}`);
        setError(err);
      });
    handleModalClose();
  }

  function handleValueChange(event) {
    setNominalValue(event.target.value);
  }

  function handleEditNominativeValueChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setToEdit((prevState: Iproject) => {
      return {
        ...prevState,
        nominative_value: event.target.value,
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
            id="name"
            label="Nome"
            placeholder="Nome"
            value={name}
            onChange={handleNameChange}
            multiline
          />
          <TextField
            id="value"
            label="Valore"
            value={nominalValue}
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
              label="Data di Inizio"
              inputFormat="YYYY/MM/DD"
              value={startDate}
              onChange={handleStartDatePickerChange}
              renderInput={(params) => <TextField {...params} />}
            />
            <DesktopDatePicker
              label="Data di Fine"
              inputFormat="YYYY/MM/DD"
              value={endDate}
              onChange={handleEndDatePickerChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <IconButton aria-label="add" size="large" onClick={addProjectHandler}>
            <AddIcon fontSize="inherit" />
          </IconButton>
        </Grid>
        <Grid item xs={4} md={4}>
          <Stack spacing={2} direction="row">
            <Chip
              color={
                percent >= 100 ? 'success' : percent <= 50 ? 'error' : 'warning'
              }
              label={`Totale nominale: ${nominativeTotal} €`}
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
              label={`Differenza: ${currentTotal - nominativeTotal} €`}
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
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: Iproject, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        if (column.id === 'actions') {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Link to={`/movement/${row.id}`}>
                                <IconButton
                                  aria-label="view"
                                  size="large"
                                  onClick={() => {}}
                                >
                                  <RemoveRedEyeIcon fontSize="inherit" />
                                </IconButton>
                              </Link>
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
                                onClick={() => openDeleteHandle(row.id)}
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
                                column.id === 'current_value'
                                  ? value <= 0
                                    ? 'red'
                                    : value < row.nominative_value
                                    ? 'orange'
                                    : 'green'
                                  : 'black',
                              minWidth: column.minWidth,
                            }}
                          >
                            {column.id === 'current_value' ||
                            column.id === 'nominative_value'
                              ? `${value} €`
                              : value}
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
          count={data.length}
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
            id="name"
            label="Nome"
            placeholder="Nome"
            value={toEdit?.name}
            onChange={handleEditNameChange}
            multiline
          />
          <TextField
            id="value"
            label="Valore nominativo"
            value={toEdit?.nominative_value}
            onChange={handleEditNominativeValueChange}
            placeholder="Valore nominativo"
            inputProps={{
              inputMode: 'numeric',
              pattern: '/^-?d+(?:.d+)?$/g',
            }}
            type="number"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Data di inizio"
              inputFormat="YYYY/MM/DD"
              value={toEdit?.start_date}
              onChange={handleEditStartDatePickerChange}
              renderInput={(params) => <TextField {...params} />}
            />
            <DesktopDatePicker
              label="Data di fine"
              inputFormat="YYYY/MM/DD"
              value={toEdit?.end_date}
              onChange={handleEditEndDatePickerChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <IconButton aria-label="add" size="large" onClick={editHandler}>
            <SaveAsIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Modal>
      <Modal
        open={deleteModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Grid
            container
            spacing={2}
            direction="row"
            sx={{ flexGrow: 1, padding: '1rem' }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={4} md={4}>
              <h2>Confermi l'eliminazione del progetto?</h2>
            </Grid>
            <Grid item xs={4} md={4}>
              <IconButton
                aria-label="add"
                size="large"
                onClick={removeProjectHandler}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                aria-label="add"
                size="large"
                onClick={handleModalClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default Project;
