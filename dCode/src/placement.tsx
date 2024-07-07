// placement.tsx
import {Box, Button, TextField, Typography } from '@mui/material';
import './App.css';

function Placement() {
  const firstProblem = 
  ` # Program to display the Fibonacci sequence
  recurse_fibonacci <- function(n) {
    if (n <= 1) {
      return(n);
    } else {
      return(recurse_fibonacci(n-1) + recurse_fibonacci(n-2));
    }
  }`;

  return (
    <div className="App">
      <Typography variant="h4" gutterBottom style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)' }}>
        Placement Test
      </Typography>
      <Box
      height={170}
      width={450}
      my={4}
      display="flex"
      flexDirection = "column"
      justifyContent="center"
      p={2}
      sx={{mt: 20, textAlign: 'left', border: '4px solid #646cffaa' }}
    >
      <pre>{firstProblem}</pre>
    </Box>
    <TextField
        fullWidth
        id="description"
        label="Type your function description in plain English below"
        multiline
        minRows={4}
        maxRows={10}
    />

    <Box
      height={170}
      width={450}
      my={4}
      display="flex"
      flexDirection = "column"
      justifyContent="center"
      p={2}
      sx={{mt: 10, textAlign: 'left', border: '4px solid #646cffaa' }}
    >
      <pre>{firstProblem}</pre>
    </Box>
    <TextField
        fullWidth
        id="description"
        label="Type your function description in plain English below"
        multiline
        minRows={4}
        maxRows={10}
    />

    <Box
      height={170}
      width={450}
      my={4}
      display="flex"
      flexDirection = "column"
      justifyContent="center"
      p={2}
      sx={{mt: 10, textAlign: 'left', border: '4px solid #646cffaa' }}
    >
      <pre>{firstProblem}</pre>
    </Box>
    <TextField
        fullWidth
        id="description"
        label="Type your function description in plain English below"
        multiline
        minRows={4}
        maxRows={10}
    />
    <Button
    type="button"
    variant="contained"
    sx={{ mt: 7, mb: 2 }}>
      End Test and Submit
    </Button>
    </div>

  );
}

export default Placement;                  