import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, Grid } from "@mui/material";
import axios from 'axios';
import './App.css';
import { useParams, useNavigate } from 'react-router-dom';

const Problem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      alert("Problem ID is missing.");
      return;
    }
    console.log("Problem ID:", id);

    // Fetch problem details if needed using the id
    // Example:
    // axios.get(`/api/problems/${id}`)
    //   .then(response => {
    //     // Handle the response to fetch problem details
    //   })
    //   .catch(error => {
    //     console.error('Error fetching problem:', error);
    //   });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/openai-test', {
        prompt
      });

      let trimmedCode = response.data.generatedCode;
      let code = trimmedCode.split("```javascript");
      code = code[1].split("```");

      setGeneratedCode(code[0]);
    } catch (error) {
      setGeneratedCode('Error: ' + (error as Error).message);
    }
  };

  const handleMarkComplete = async () => {
    try {
      const response = await axios.get('/api/user');
      const userId = response.data.auth0_user_id;
      console.log(userId);
  
      if (!userId) {
        alert("Please log in to submit the problem.");
        return;
      }
  
      if (!id) {
        alert("No id found");
        return;
      }
  
      const markCompleteResponse = await axios.post('http://localhost:3000/api/mark-complete', {
        auth0_user_id: userId,
        problem_id: parseInt(id, 10),
        status: 'complete',
        score: 50
      });
  
      if (markCompleteResponse.status === 201) {
        alert('Problem marked as complete.');
        navigate("/dcode/problems");
      } else {
        alert('Failed to mark problem as complete.');
      }
    } catch (error) {
      console.error('Error marking problem as complete:', error);
    }
  };
  

  return (
    <div className="App">
      <Typography variant="h4">OpenAI JavaScript Code</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          multiline
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Generate Code
        </Button>
      </form>
      <Typography variant="h2">Generated JavaScript Code: </Typography>
      <Box component="pre" bgcolor="black" p={2} mt={2} borderRadius={4}>
        {generatedCode}
      </Box>
      <Grid container spacing={2} justifyContent="center" mt={4}>
        <Grid item>
          <Button variant="contained" color="warning">
            View History
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary">
            Save
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleMarkComplete}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Problem;
