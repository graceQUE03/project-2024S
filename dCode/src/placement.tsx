// placement.tsx
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom'; 
import "./App.css";

// display problem number, problem statement and type box for description
function displayProblemBox(number: number, problem: string) {
  return (
    <>
    <Box
        sx={{
          gap: 2,
          display: "flex",
          alignItems: "center",
          height: "35vh",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            width: 25,
            height: 25,
            bgcolor: "primary.main",
            color: "white",
            borderRadius: "4px",
          }}
        >
          <Typography variant="body1">{number}</Typography>
        </Box>

        <Box
          height={200}
          width={500}
          my={4}
          display="flex"
          flexDirection="row"
          justifyContent="center"
          p={2}
          sx={{ mt: 30, textAlign: "left", border: "4px solid #646cffaa" }}
        >
          <pre>{problem}</pre>
        </Box>
      </Box>
      <Box
        sx={{
          width : 600,
          mt: 15,
        }}
      >
        <TextField
          fullWidth
          id="description"
          label="Type your function description in plain English below"
          multiline
          minRows={4}
          maxRows={10}
        />
      </Box>
    </>
  );
};

function Placement() {
  const firstProblem = ` # Program to display the Fibonacci sequence
  recurse_fibonacci <- function(n) {
    if (n <= 1) {
      return(n);
    } else {
      return(recurse_fibonacci(n-1) + recurse_fibonacci(n-2));
    }
  }`;

  const navigate = useNavigate();  

  const handleResult = () => {
    navigate('/dcode/result');  
  };

  return (
    <div className="App">
      {/* Header */}
      <Typography
        variant="h4"
        gutterBottom
        style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        Placement Test
      </Typography>

      {/* Problems */}
      {displayProblemBox(1, firstProblem)}
      {displayProblemBox(2, firstProblem)}
      {displayProblemBox(3, firstProblem)}

      {/* Submit Button */}
      <Button 
      type="button" 
      variant="contained" 
      sx={{ mt: 7, mb: 2}} 
      onClick={handleResult}>
        End Test and Submit
      </Button>
    </div>
  );
}

export default Placement;
