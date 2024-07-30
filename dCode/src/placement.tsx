// placement.tsx
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom'; 
import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

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
          flexDirection="column"
          justifyContent="center"
          alignItems = "center"
          p={2}
          sx={{ mt: 30, textAlign: "left", border: "4px solid #646cffaa" }}
        >
          <Box>
          <pre style={{
            fontSize: '18px', 
            width: '100%', 
            whiteSpace: 'pre-wrap'
            }}>{problem}</pre>
          </Box>

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
          InputProps={{
            sx: {
              color: '#ffffff',
            },
          }}
          InputLabelProps={{
            sx: {
              color:'#c0c0f2',
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#c0c0f2',
              },
            '&:hover fieldset': {
            borderColor: '#6c68fb', 
          }}
            }}
        />
      </Box>
    </>
  );
};

const Placement: React.FC = () =>{
  // for now fixed problem numbers
  const [problemEasy, setProblemEasy] = useState<string>("");
  const [problemMedium, setProblemMedium] = useState<string>("");
  const [problemHard, setProblemHard] = useState<string>("");

  useEffect(() => {
    const fetchProblems = async (id: number) => {
      try {
        const fetchedProblems = await axios.get(
          `http://localhost:3000/api/problems/${id}`
        );
        //easy; medium; hard
        if (id === 1) {
          setProblemEasy(fetchedProblems.data[0].code);
        } else if (id === 2) {
          setProblemMedium(fetchedProblems.data[0].code);
        } else {
          setProblemHard(fetchedProblems.data[0].code);
        }

      } catch (error) {
        console.error("Error fetching problems: ", error);
      }
    };

    fetchProblems(1);
    fetchProblems(2);
    fetchProblems(3);
  }, []);

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
      {displayProblemBox(1, problemEasy)}
      {displayProblemBox(2, problemMedium)}
      {displayProblemBox(3, problemHard)}

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
