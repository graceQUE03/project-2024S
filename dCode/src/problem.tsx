// // problem.tsx
// import './App.css';

// function Problem() {
//   return (
//     <div className="App">
//       <h1>Problem Page</h1>
//     </div>
//   );
// }

// export default Problem;

import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import axios from 'axios';
import './App.css';

const Problem: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/openai-test', {
        prompt
      });

      // trim the generated code from the response
      let trimmedCode = response.data.generatedCode;
      let code = trimmedCode.split("```javascript");
      code = code[1].split("```");

      setGeneratedCode(code[0]);
    } catch (error) {
      setGeneratedCode('Error: ' + (error as Error).message);
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
    </div>
  );
};

export default Problem;
