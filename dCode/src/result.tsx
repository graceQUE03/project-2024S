// result.tsx
import React from "react";
import { AppBar, Button, Box, Tab, Tabs, Typography } from "@mui/material";
import { AiOutlineReload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import "./App.css";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

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

function displayTabPanel(value: number, index: number, problem: string, passTests: number, totalTests: number) {
  var passMessage = passTests === totalTests ? "ALL TEST CASES PASSED" : "TEST CASES FAILED";
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
            height={200}
            width={550}
            my={4}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            p={2}
            sx={{ textAlign: "left", border: "4px solid #646cffaa" }}
          >
            <pre>{problem}</pre>
          </Box>

          <Typography variant="h6">Test Cases Passed {passTests}/{totalTests} </Typography>
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

function Result() {
  const passArray = [3 , 5, 10];
  const totalTests = 10;
  const navigate = useNavigate();

  const handlePlacement = () => {
    navigate("/dcode/placement");
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // @ts-ignore
    var target = event.target as HTMLInputElement;
    setValue(newValue);
  };

  // displaying first problem without fetching from the database
  const firstProblem = ` # Program to display the Fibonacci sequence
  recurse_fibonacci <- function(n) {
    if (n <= 1) {
      return(n);
    } else {
      return(recurse_fibonacci(n-1) + recurse_fibonacci(n-2));
    }
  }`;

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

        <Typography style={{ width: 550, textAlign: "left", lineHeight: 2 }}>
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
          {passArray[0] === totalTests ? tag("#00b894", "EASY") : ""}
          {passArray[1] === totalTests ? tag("#ffa500", "MEDIUM") : ""} 
          {passArray[2] === totalTests ? tag("red", "HARD") : ""}
          </Box>
          <br />
          View individual feedback below.
        </Typography>
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
        {displayTabPanel(value, 0, firstProblem, passArray[0], totalTests)}
        {displayTabPanel(value, 1, firstProblem, passArray[1], totalTests)}
        {displayTabPanel(value, 2, firstProblem, passArray[2], totalTests)}
      </Box>

      <Button type="button" variant="contained" sx={{ mt: 3, mb: 2 }}>
        View Test Cases
      </Button>
    </div>
  );
}

export default Result;
