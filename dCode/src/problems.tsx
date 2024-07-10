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

const difficulty = [
  'Easy',
  'Medium',
  'Hard',
];

const status = [
  'Solved',
  'Unsolved',
];


const rows = [
  createData('Solved', 'Easy', 'Two Sum'),
  createData('Unsolved', 'Easy', 'Reverse Integer'),
  createData('Solved', 'Hard', 'Median of Two Sorted Arrays'),
  createData('Unsolved', 'Medium', 'Longest Palindromic Substring'),
  createData('Unsolved', 'Medium', 'ZigZag Conversion'),
];

function createData(
  status: string,
  difficulty: string,
  title: string
) {
  return { status, difficulty, title};
}

// template code from https://mui.com/material-ui/react-select/#system-MultipleSelectCheckmarks.tsx
function MultipleSelectCheckmarks(category: string) {
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{m:1, width: 200 }}>
        <InputLabel id="demo-multiple-checkbox-label">{category}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label= {category}/>}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {(category === "Difficulty" ? difficulty : status).map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
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
    navigate("/dcode/about");
  };

  return (
    <div className="App" style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
          display: "flex",
          justfifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          paddingTop: 10,
          paddingBottom: 4,
        }}>
        <Grid container alignItems = "center" spacing = {1}>
          <Grid item><Typography variant="h6"> 3/7 Problems Done (42%) </Typography></Grid>
          <Grid item>{MultipleSelectCheckmarks("Status")}</Grid>
          <Grid item>{MultipleSelectCheckmarks("Difficulty")}</Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow sx={{bgcolor: theme.palette.primary.main}}>
            <TableCell>Status</TableCell>
            <TableCell align="left">Difficulty</TableCell>
            <TableCell>Title</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{bgcolor: lighten(theme.palette.primary.main, 0.5)}}>
          {rows.map((row) => (
            <TableRow
              hover
              key={row.status}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell onClick={() => handleProblem()}>
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