import React, { useEffect, useRef, useState } from 'react';
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
import ReactToPrint from 'react-to-print';
import {
  addMovement,
  editMovements,
  getMovementsByGroup,
  getProjectById,
  removeMovement,
} from '../services/ReactDatabaseService';
import { Imovements, Iproject } from '../utils/DbInterface';
import { Column } from '../utils/Interface';
import { formatDate } from '../utils/Utils';

const columns: Column = [
  { id: 'order', label: 'Ordine', minWidth: 100, align: 'left' },
  {
    id: 'description',
    label: 'Descrizione',
    minWidth: 100,
    maxWidth: 150,
    whiteSpace: 'pre-wrap',
    align: 'left',
  },
  { id: 'value', label: 'Valore', minWidth: 100, align: 'left' },
  {
    id: 'date',
    label: 'Date',
    minWidth: 170,
    align: 'left',
    format: (value: string) => moment(value).format('DD/MM/yyyy'),
  },
  { id: 'actions', label: 'Azioni', minWidth: 100, align: 'left' },
];

const Movements = () => {
  const printRef = useRef();
  const { idProject } = useParams();

  const [project, setProject] = React.useState<Iproject>({
    id: 0,
    name: '',
    nominative_value: 0,
    current_value: 0,
    start_date: '',
    end_date: '',
  });

  const [value, setValue] = React.useState<number>(0);
  const [description, setDescription] = React.useState<string>('');
  const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()));

  const [refresh, setRefresh] = React.useState<number>(0);
  const [error, setError] = React.useState<Error | null>();

  const [movements, setMovements] = useState<Imovements[]>([]);
  const [percent, setPercent] = React.useState<number>(0);

  const [toEdit, setToEdit] = React.useState<Imovements>({
    date: '',
    description: '',
    id: null,
    idProject: 0,
    value: 0,
    order: 0,
  });
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalClose = () => setModalOpen(false);

  useEffect(() => {
    getProjectById(idProject)
      .then((response) => {
        setProject(response[0]);
      })
      .catch((err: Error | null) => setError(err));

    getMovementsByGroup(idProject)
      .then((response) => {
        response.sort((a: Imovements, b: Imovements) => {
          if (a.order < b.order) {
            return -1;
          }
          if (a.order > b.order) {
            return 1;
          }
          return 0;
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
    setPercent((project.current_value / project?.nominative_value) * 100);
  }, [project]);

  function addMovementhandler() {
    const movement: Imovements = {
      id: null,
      value,
      date: `${date?.toString()}`,
      description,
      idProject,
    };
    addMovement({ ...movement, order: movements.length + 1 })
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

  function openEditHandler(id: number) {
    setToEdit(movements[id]);
    setModalOpen(true);
  }

  function editHandler() {
    let orderIsChanged = false;
    let originalOrder = 0;

    editMovements(toEdit)
      .then(() => {
        setRefresh((prevState) => prevState + 1);
      })
      .catch((err) => {
        console.log(`error ${err}`);
        setError(err);
      });

    movements.forEach((mov: Imovements) => {
      if (toEdit.id === mov.id && toEdit.order !== mov.order) {
        orderIsChanged = true;
        originalOrder = mov.order;
      }
    });

    if (orderIsChanged) {
      movements.forEach((mov: Imovements) => {
        if (
          toEdit.id !== mov.id &&
          originalOrder >= mov.order &&
          toEdit.order <= mov.order
        ) {
          mov.order += 1;
          editMovements(mov)
            .then(() => {
              setRefresh((prevState) => prevState + 1);
            })
            .catch((err) => {
              console.log(`error ${err}`);
              setError(err);
            });
        }
      });
    }
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

  function handleEditOrderChange(event: React.ChangeEvent<HTMLInputElement>) {
    setToEdit((prevState: Imovements) => {
      return {
        ...prevState,
        order: event.target.value,
      };
    });
  }

  return (
    <div ref={printRef}>
      <Grid
        container
        spacing={2}
        direction="row"
        sx={{ flexGrow: 1, paddingLeft: '1rem' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <div>
          <h2>{`Commessa ${project?.name}`}</h2>
          <h2>{`Dal ${formatDate(project?.start_date)} al ${formatDate(
            project?.end_date
          )}`}</h2>
        </div>
        <Grid item>
          <Stack spacing={2} direction="row">
            <Chip
              color={
                percent >= 100 ? 'success' : percent <= 50 ? 'error' : 'warning'
              }
              label={`Valore nominale: ${project?.nominative_value} €`}
              style={{ right: 0 }}
            />
            <Chip
              color={
                percent >= 100 ? 'success' : percent <= 50 ? 'error' : 'warning'
              }
              label={`Totale fatturato: ${project?.current_value} €`}
              style={{ right: 0 }}
            />
            <Chip
              color={
                percent >= 100 ? 'success' : percent <= 50 ? 'error' : 'warning'
              }
              label={`Rimanenze: ${
                project?.current_value - project?.nominative_value
              } €`}
              style={{ right: 0 }}
            />
            <div>
              <ReactToPrint
                trigger={() => {
                  return <a href="#">Stampa!</a>;
                }}
                content={() => printRef.current}
              />
            </div>
          </Stack>
        </Grid>
        <Grid item justifyContent="flex-end" alignItems="center">
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
      </Grid>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column?.minWidth,
                      maxWidth: column?.maxWidth,
                      display: column?.display,
                      whiteSpace: column?.whiteSpace,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {movements.map((row: Imovements, index: number) => {
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
                            minWidth: column?.minWidth,
                            maxWidth: column?.maxWidth,
                            display: column?.display,
                            whiteSpace: column?.whiteSpace,
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
          <TextField
            id="order"
            label="Ordine"
            value={toEdit.order}
            onChange={handleEditOrderChange}
            placeholder="Ordine"
            inputProps={{
              inputMode: 'numeric',
              pattern: '/^-?d+(?:.d+)?$/g',
            }}
            type="number"
          />
          <IconButton
            aria-label="add"
            size="large"
            onClick={editHandler}
            disabled={toEdit.order <= 0 || toEdit.order > movements.length}
          >
            <SaveAsIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Modal>
    </div>
  );
};

export default Movements;
