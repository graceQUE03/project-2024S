// result.tsx
import React, { useEffect, useState } from "react";
import { AppBar, Button, Box, Tab, Tabs, Typography } from "@mui/material";
import { AiOutlineReload } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import "./App.css";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}


  // actual outputs array
  const actualOutputsArray: any[][] = [[], [], []];
  // pass/fail numbers array
  const passArray: boolean[][] = [[], [], []];


function tag(color: string, difficulty: string) {
  return (
    <Box
      sx={{
        width: 70,
        height: 22,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: color,
        color: "white",
        borderRadius: "4px",
      }}
    >
      <Typography variant="body2">{difficulty}</Typography>
    </Box>
  );
}

// template for TabPanel from https://mui.com/material-ui/react-tabs/#system-FullWidthTabs.tsx
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function displayTabPanel(
  value: number,
  index: number,
  problem: string,
  totalTests: number
) {
  const passTests = passArray[index].filter(Boolean).length;
  var passMessage =
    passTests === totalTests ? "ALL TEST CASES PASSED" : "TEST CASES FAILED";
  var color = passTests === totalTests ? "green" : "red";

  return (
    <>
      <TabPanel value={value} index={index}>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justfifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: 220,
              height: 40,
              bgcolor: color,
              color: "white",
              borderRadius: "6px",
              mb: 5,
            }}
          >
            <Typography variant="body1" mt={1}>
              {passMessage}
            </Typography>
          </Box>

          <Typography variant="h5">AI-Generated Code</Typography>

          <Box
            width="100%"
            component="pre"
            bgcolor="black"
            p={4}
            mt={4}
            mb={4}
            borderRadius={4}
            sx={{
              color: "white",
              boxShadow: 3,
              fontFamily: "monospace",
              fontSize: "1rem",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {problem}
          </Box>

          <Typography variant="h6">
            Test Cases Passed {passTests}/{totalTests}{" "}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <LinearProgress
            color="success"
            variant="determinate"
            value={(passTests / totalTests) * 100}
            style={{ width: 350, height: 10, backgroundColor: "red" }}
          />
        </Box>
      </TabPanel>
    </>
  );
}

const Result = () => {
  const location = useLocation();
  const { promptEasy, promptMedium, promptHard, testsEasy, testsMedium, testsHard} = location.state || {};
  // !!! set properly
  const [generatedCodeEasy, setGeneratedCodeEasy] = useState("");
  const [generatedCodeMedium, setGeneratedCodeMedium] = useState("");
  const [generatedCodeHard, setGeneratedCodeHard] = useState("");

  const [resultsEasy, setResultsEasy] = useState<string>("");
  const [resultsMedium, setResultsMedium] = useState<string>("");
  const [resultsHard, setResultsHard] = useState<string>("");

  const [showTestCases, setShowTestCases] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const totalTests = 5;

  const navigate = useNavigate();

  const handlePlacement = () => {
    navigate("/dcode/placement");
  };

  const handleButton = (event: any) => {
    event.preventDefault();
    setShowTestCases(true);
  };

  const exception1 =
    "Your description is a javascript code. Please describe the problem in plain English.";
  const exception2 =
    "Your description is not a valid sentence. Please describe the problem in plain English.";

  const [value, setValue] = React.useState(0);

  useEffect(() => {
    // (3) push all the actualoutputs and calcualte pass tests
    const evalPass = async (tests: any, results: string, index: number) => {
      if (results === "") {
        // no test cases are passed
        passArray[index].push(false, false, false, false, false);
        return;
      }

      const text = JSON.stringify(results, null, 2);
      const obj = JSON.parse(text);

      for (let i = 1; i <= 5; i++) {
        const expectedOutput = tests[`test${i}`].output;
        const actualOutput = obj.result[`actualOutput${i}`];
        console.log("this is the actualoutput: " + actualOutput);
        console.log("this is the expectedOutput: " + expectedOutput);
        if (
          typeof expectedOutput === "number" &&
          !Number.isInteger(expectedOutput)
        ) {
          const digitNum = expectedOutput.toString().split(".")[1].length;
          actualOutputsArray[index].push(
            Number(actualOutput).toFixed(digitNum)
          );
          passArray[index].push(actualOutput === expectedOutput);
        } else {
          actualOutputsArray[index].push(actualOutput);
          passArray[index].push(actualOutput === expectedOutput);
        }
      }
    };

    // (1) fetch all generated codes
    const fetchGeneratedCode = async (code: string) => {
      try {
        if (code === "easy") {
          const responseEasy = await axios.post(
            "http://localhost:3000/api/openai-test",
            { prompt: promptEasy }
          );
          const generated = responseEasy.data.generatedCode;
          if (generated === "exception 1") {
            setGeneratedCodeEasy(exception1);
            return;
          } else if (generated === "exception 2") {
            setGeneratedCodeEasy(exception2);
            return;
          } else {
            let trimmed = generated.split("```javascript");
            trimmed = trimmed[1].split("```");
            console.log(trimmed[0]);
            setGeneratedCodeEasy(trimmed[0]);

            const response = await axios.post(
              "http://localhost:3000/api/test-generated-code",
              { generatedCode: trimmed[0], id: 1 }
            );

            console.log("easy: ")
            console.log(JSON.stringify(resultsEasy, null, 2));

            setResultsEasy(response.data);

            evalPass(testsEasy, response.data, 0);
          }
        }
        if (code === "medium") {
          const responseMedium = await axios.post(
            "http://localhost:3000/api/openai-test",
            { prompt: promptMedium }
          );
          const generated = responseMedium.data.generatedCode;
          if (generated === "exception 1") {
            setGeneratedCodeMedium(exception1);
            return;
          } else if (generated === "exception 2") {
            setGeneratedCodeMedium(exception2);
            return;
          } else {
            let trimmed = generated.split("```javascript");
            trimmed = trimmed[1].split("```");
            console.log(trimmed[0]);
            setGeneratedCodeMedium(trimmed[0]);

            const response = await axios.post(
              "http://localhost:3000/api/test-generated-code",
              { generatedCode: trimmed[0], id: 2 }
            );
            console.log("medium: ")
            console.log(JSON.stringify(resultsMedium, null, 2));

            setResultsMedium(response.data);
            evalPass(testsMedium, response.data, 1);
          }
        }
        if (code === "hard") {
          const responseHard = await axios.post(
            "http://localhost:3000/api/openai-test",
            { prompt: promptHard }
          );
          const generated = responseHard.data.generatedCode;
          if (generated === "exception 1") {
            setGeneratedCodeHard(exception1);
            // !!!
            setShowResults(true);
            return;
          } else if (generated === "exception 2") {
            setGeneratedCodeHard(exception2);
            // !!!
            setShowResults(true);
            return;
          } else {
            let trimmed = generated.split("```javascript");
            trimmed = trimmed[1].split("```");
            console.log(trimmed[0]);
            setGeneratedCodeHard(trimmed[0]);

            const response = await axios.post(
              "http://localhost:3000/api/test-generated-code",
              { generatedCode: trimmed[0], id: 3 }
            );

            console.log("hard: ")
            console.log(JSON.stringify(resultsHard, null, 2));

            setResultsHard(response.data);
            console.log(resultsEasy, resultsMedium, resultsHard);

            evalPass(testsHard, response.data, 2);
            // !!!
            setShowResults(true);
          }
        }
      } catch (error: any) {
        console.log("Error setting generated code : " + error.message);
      }
    };

    fetchGeneratedCode("easy");
    fetchGeneratedCode("medium");
    fetchGeneratedCode("hard");
  }, [promptEasy, promptMedium, promptHard, testsEasy, testsMedium, testsHard]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // @ts-ignore
    var target = event.target as HTMLInputElement;
    setValue(newValue);
  };

  // displaying first problem without fetching from the database
  return (
    <div className="App">
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justfifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          height: "10vh",
          paddingTop: 10,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Your Results
        </Typography>
        <Box
          sx={{
            display: "flex",
            justfifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <AiOutlineReload size={30} style={{ marginRight: "16px" }} />
          <Button
            type="button"
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
            onClick={handlePlacement}
          >
            Take Placement Test Again
          </Button>
        </Box>

        {showResults && (<Typography style={{ width: 550, textAlign: "left", lineHeight: 2 }}>
          Based on your test results, we recommend you start practicing
          questions with the tag:
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              flexDirection: "row",
              ml: 1,
              gap: 1,
              mb: 1,
            }}
          >
            {passArray[0].filter(Boolean).length === totalTests
              ? ""
              : tag("#00b894", "EASY")}
            {passArray[1].filter(Boolean).length === totalTests
              ? ""
              : tag("#ffa500", "MEDIUM")}
            {passArray[2].filter(Boolean).length === totalTests
              ? ""
              : tag("red", "HARD")}
          </Box>
          <br />
          View individual feedback below.
        </Typography>
  )}
      </Box>

      <Box
        sx={{
          width: 600,
          paddingTop: 22,
        }}
      >
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={(event, newValue) => handleChange(event, newValue)}
            textColor="inherit"
            centered
            variant="fullWidth"
          >
            <Tab label="Question 1" />
            <Tab label="Question 2" />
            <Tab label="Question 3" />
          </Tabs>
        </AppBar>
        {/* Problems */}
        {showResults && displayTabPanel(
          value,
          0,
          generatedCodeEasy,
          totalTests
        )}
        {showResults && displayTabPanel(
          value,
          1,
          generatedCodeMedium,
          totalTests
        )}
        {showResults && displayTabPanel(
          value,
          2,
          generatedCodeHard,
          totalTests
        )}
      </Box>

      <form onSubmit={handleButton}>
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          View Test Cases
        </Button>
      </form>
      {showTestCases && <Typography> this is the results</Typography>}
    </div>
  );
};

export default Result;
