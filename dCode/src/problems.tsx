import './App.css';
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import {Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import {useTheme, lighten} from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// constant data for table
const difficulty = [
  'Easy',
  'Medium',
  'Hard',
];

// constant data for table
const status = [
  'Unstarted',
  'Attempted',
  'Completed',
];

// fetch data from database in the future
const rows = [
  createData('Attempted', 'Hard', 'Median of Two Sorted Arrays'),
  createData('Completed', 'Medium', 'Longest Palindromic Substring'),
  createData('Unstarted', 'Medium', 'ZigZag Conversion'),
  // createData('Completed', 'Easy', 'Two Sum'),
  // createData('Attempted', 'Easy', 'Reverse Integer'),
];

function calcCompleted(rowsArray: any[]) {
  return rowsArray.filter((row: any) => row.status === 'Completed').length;
}


function createData(
  status: string,
  difficulty: string,
  title: string
) {
  return { status, difficulty, title};
}

// template code from https://mui.com/material-ui/react-select/#system-MultipleSelectCheckmarks.tsx
function MultipleSelectCheckmarks(category: string, selected: string[], handleChange: any) {
  return (
    <div>
      <FormControl sx={{m:1, width: 200 }}>
        <InputLabel id="demo-multiple-checkbox-label">{category}</InputLabel>
        <Select
          labelId="${category}-select-label"
          id="${category}-select"
          multiple
          value={selected}
          onChange={handleChange}
          input={<OutlinedInput label= {category}/>}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {(category === "Difficulty" ? difficulty : status).map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={selected.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

function Problems() {
  const theme = useTheme();
  const navigate = useNavigate();

  // handle table cell button click
  const handleProblem = () => {
    navigate("/dcode/problem");
  };

  // states for drop down menu
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string[]>([]);

  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedStatus(typeof value === 'string' ? value.split(',') : value);
  };
  
  const handleDifficultyChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedDifficulty(typeof value === 'string' ? value.split(',') : value);
  };

  const filteredRows = rows.filter(row =>
    (selectedStatus.length === 0 || selectedStatus.includes(row.status)) &&
    (selectedDifficulty.length === 0 || selectedDifficulty.includes(row.difficulty))
  );

  var completed = calcCompleted(filteredRows);



  return (
    <div className="App" style={{ width: '130vh', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
          display: "flex",
          justfifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          paddingTop: 10,
          paddingBottom: 4,
        }}>
        <Grid container alignItems = "center" spacing = {2}>
          <Grid item><Typography variant="h6"> {completed}/{filteredRows.length} Problems Done ({filteredRows.length === 0 ? (0).toFixed(2) : (completed / filteredRows.length * 100).toFixed(2)}%) </Typography></Grid>
          <Grid item>{MultipleSelectCheckmarks("Status", selectedStatus, handleStatusChange)}</Grid>
          <Grid item>{MultipleSelectCheckmarks("Difficulty", selectedDifficulty, handleDifficultyChange)}</Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700, width: '100%',}} aria-label="simple table">
        <TableHead sx={{bgcolor: theme.palette.primary.main}}>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell align="left">Difficulty</TableCell>
            <TableCell>Title</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.map((row, index) => (
            <TableRow
              hover
              key={row.status}
              sx={{ '&:last-child td, &:last-child th': { border: 0 },　bgcolor: index % 2 === 0 ? lighten(theme.palette.primary.main, 0.5) : "#e0e0e0"}}
              onClick={() => handleProblem()}
            >
              <TableCell>
                {row.status}
              </TableCell>
              <TableCell align="left">{row.difficulty}</TableCell>
              <TableCell component="th" scope="row">{row.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </div>
  );
}

export default Problems;