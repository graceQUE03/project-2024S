import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, Grid } from "@mui/material";
import axios from 'axios';
import './App.css';
import { useParams } from 'react-router-dom';

const Problem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [attempts, setAttempts] = useState<{ score: number; attempt_date: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!id) {
      alert("Problem ID is missing.");
      return;
    }
    console.log("Problem ID:", id);
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
    console.log("getting here");

    try {
      // Fetch the user ID from the API
      const userResponse = await axios.get('http://localhost:3000/api/user');
      const auth0_user_id = userResponse.data;

      if (!id) {
        alert("Problem ID is missing.");
        return;
      }

      // Make the request to mark the problem as complete
      await axios.post('http://localhost:3000/api/problem-complete', {
        auth0_user_id: String(auth0_user_id),
        problem_id: parseInt(id, 10)
      });

      alert("Problem marked as complete!");
    } catch (error) {
      console.error("Error marking problem as complete:", error);
      alert("There was an error marking the problem as complete.");
    }
  };

  const handleViewHistory = async () => {
    try {
      // Fetch the user ID from the API
      const userResponse = await axios.get('http://localhost:3000/api/user');
      const auth0_user_id = userResponse.data;

      if (!id) {
        alert("Problem ID is missing.");
        return;
      }

      // Make the request to fetch the user's problem attempts
      const attemptsResponse = await axios.get(`http://localhost:3000/api/user-problem-attempts/${auth0_user_id}/${id}`);

      setAttempts(attemptsResponse.data);
      setShowHistory(true);
    } catch (error) {
      console.error("Error fetching problem attempts:", error);
      alert("There was an error fetching the problem attempts.");
    }
  };

  const getStatusColor = (score: number) => {
    return score === 100 ? 'green' : 'red';
  };

  const getStatusText = (score: number) => {
    return score === 100 ? 'PASS' : 'FAILED';
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
          <Button variant="contained" color="warning" onClick={handleViewHistory}>
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
      {showHistory && (
        <Box mt={4}>
          <Typography variant="h5">Previous Attempts:</Typography>
          {attempts.map((attempt, index) => (
            <Box key={index} p={2} border={1} borderColor="grey.300" borderRadius={4} mt={2}>
              <Typography>
                Status: <span style={{ color: getStatusColor(attempt.score) }}>{getStatusText(attempt.score)}</span>
              </Typography>
              <Typography>Score: {attempt.score}</Typography>
              <Typography>Date: {new Date(attempt.attempt_date).toLocaleString()}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
};

export default Problem;
