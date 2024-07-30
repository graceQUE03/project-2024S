import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, Grid } from "@mui/material";
import axios from 'axios';
import './App.css';
import { useParams } from 'react-router-dom';

const Problem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [result, setResult] = useState("");
  const [attempts, setAttempts] = useState<{ score: number; attempt_date: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [problemTests, setProblemTests] = useState<any>(null);
  const actualOutputs: any[] = [];

  useEffect(() => {
    if (!id) {
      alert("Problem ID is missing.");
      return;
    }
    console.log("Problem ID:", id);

    const fetchProblems = async () => {
      try {
        const fetchedProblemTests = await axios.get(`http://localhost:3000/api/problems/${id}`);
        setProblemTests(fetchedProblemTests.data[0].tests);
      } catch (error) {
        console.error("Error fetching problems: ", error);
      }
    }
    fetchProblems();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/openai-test', {
        prompt
      });

      // trim the generated code from the response
      let trimmedCode = response.data.generatedCode;

      if (trimmedCode === "exception 1") {
        setGeneratedCode("Your description is a javascript code. Please describe the problem in plain English.")
        setResult("");
      } else if (trimmedCode === "exception 2") {
        setGeneratedCode("Your description is not a valid sentence. Please describe the problem in plain English.");
        setResult("");
      } else {
        let code = trimmedCode.split("```javascript");
        code = code[1].split("```");
  
        setGeneratedCode(code[0]);

        const response2 = await axios.post('http://localhost:3000/api/test-generated-code', {generatedCode:  code[0], id: id});
        
        console.log(code[0]);
  
        setResult(response2.data);
      }
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

  // display each test case tesult
  const testResult = (testCase: number) => {
    const testIndex = testCase - 1;
    const testNumber = `test${testCase}`;
    const description = problemTests[testNumber].description;
    const expectedOutput = problemTests[testNumber].output;
    let actualOutput;
    // special case: round the decimal numbers to the decimal place as the expected output
    if (typeof(expectedOutput) === 'number' && !Number.isInteger(expectedOutput)) {
      const decimal = expectedOutput.toString().split(".");
      const digitNum = decimal[1].length;
      actualOutput = Number(actualOutputs[testIndex].toFixed(digitNum));
    } else {
      actualOutput = actualOutputs[testIndex];
    }
    const passed = actualOutput === expectedOutput ? "Yes" : "No";

    const text = `Test Case ${testCase} \n  Description: ${description} \n Expected Output: ${expectedOutput} \n ActualOutput: ${actualOutput} \n Passed: ${passed} \n \n`;
    return (
      <Typography variant="h6" style={{ whiteSpace: 'pre-line' }}>
        {text}
      </Typography>
    )
  }

  // display all 5 test results including description, expected output and actual output
  const displayResult = () => {
    if (result === "") {
      return result;
    }

    const text = JSON.stringify(result, null, 2);
    const obj = JSON.parse(text);
    
    actualOutputs.push(
      obj.result.actualOutput1,
      obj.result.actualOutput2,
      obj.result.actualOutput3,
      obj.result.actualOutput4,
      obj.result.actualOutput5
    )

    return (
      <Box component="pre" bgcolor="black" p={2} mt={2} borderRadius={4}>
        {testResult(1)}
        {testResult(2)}
        {testResult(3)}
        {testResult(4)}
        {testResult(5)}
      </Box>
    )
  }
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
      <Typography variant="h4">Generated JavaScript Code </Typography>
      <Box component="pre" bgcolor="black" p={2} mt={2} borderRadius={4}>
        {generatedCode}
      </Box>
      <Typography variant="h4">Test Case Results </Typography>
      <Box component="pre" bgcolor="black" p={2} mt={2} borderRadius={4}>
      {displayResult()}
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
