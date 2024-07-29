import express from 'express';
import { auth } from 'express-openid-connect';
import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pg = knex({
  client: 'pg',
  connection: {
    // host: 'db',
    // password: 'asdfasdf123123',
    host: 'localhost',
    password: 'pc',
    port: 5432,
    user: 'postgres',
    database: 'example',
  },
});

const app = express();
app.use(cors());
app.use(express.json()); 

const frontend = path.join(__dirname, 'dist');


app.use(express.static(frontend));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'XUZuvE6pKXJ1di0ZaTnBNpfzxFswNHxI',
  issuerBaseURL: 'https://dev-6omitcvbhwq5hvfk.us.auth0.com'
};
app.use(auth(config));

app.get('/api/problems', (req, res) => {
  pg('problems').select().then((problems) => {
    res.json(problems);
  });
});

app.get('/api/problems/:id', (req, res) => {
  pg('problems').select().where('problem_id', req.params.id).then((problems) => {
    res.json(problems);
  });
});

app.get("/pg", function(req, res, next) {
  pg.raw('select VERSION() version')
    .then(x => x.rows[0])
    .then((row) => res.json({ message: `Hello from postgresql ${row.version}` }))
    .catch(next);
});

app.get("/api/db", function(req, res, next) {
  pg('users')
    .select()
    .then((users) => res.json({ users }))
    .catch(next);
});

app.get('/api/users', (req, res) => {
  pg('users').select().then((users) => {
    res.json(users);
  });
});

app.post('/api/users/:id/add-saved-attempt', (req, res) => {
  const { id } = req.params;
  const { problem_id, description } = req.body;
  pg('users')
    .update({ saved_attempts: knex.raw('jsonb_set(??, ?, ?::jsonb)', ['saved_attempts', "$.problem_id", JSON.stringify(description)]) }).where('id', id)
    .then(() => {
      res.status(201).send('Saved attempt added');
    })
    .catch((error) => {
      console.error('Error inserting saved attempt:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/a', (req, res) => {
  console.log(req.oidc.isAuthenticated());
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/api/users/:id/saved-attempts', (req, res) => {
  const { id } = req.params;
  pg('users').select('saved_attempts').where('id', id).then((users) => {
    res.json(users);
  });
});

app.get('/api/users/:id/saved-attempts/:problem_id', (req, res) => {
  const { id, problem_id } = req.params;
  pg('users').select('saved_attempts').where('id', id).then((users) => {
    res.json(users);
  });
});

app.post('/api/add-user', (req, res) => {
  const { auth0_user_id } = req.body;
  if (!auth0_user_id) {
    return res.status(400).send('Missing auth0_user_id');
  }

  pg('users')
    .insert({ auth0_user_id })
    .then(() => {
      res.status(201).send('User added');
    })
    .catch((error) => {
      console.error('Error inserting user:', error);
      res.status(500).send('Internal Server Error');
    });
});

const OPENAI_API_KEY = 'sk-None-fduxrKKMpGv2rOLEAbHMT3BlbkFJCnj2OnDSUoCcmC3Bufav';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const callOpenAI = async (prompt) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o-mini", 
        messages: [
          {
            role: "system",
            content: "Act like a javascript code generator. You will be provided with plain english sentence, and your task is to generate a piece of javascript code with function name foo."
          },
          {
            role: "user",
            content: prompt,
          }
        ],
        temperature: 0.7,
        max_tokens: 512,
        top_p: 1,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
  }
};

// openai-test
app.post("/api/openai-test", async (req, res) => {
  const { prompt } = req.body;
  try {
    // call OpenAI and get generated code
    const generatedCode = await callOpenAI(prompt);
    res.json({ generatedCode });
  } catch (error) {
    console.error("Error in /api/openai-test route:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/test-generated-code", async (req, res) => {
  const { generatedCode, id } = req.body;
  let fetchedTests;

  try {
    // (1) fetch problem
    const response = await axios.get(`http://localhost:3000/api/problems/${id}`);
    fetchedTests = response.data[0].tests;

    // (2) convert code string into javascript function
    const appendHelper = `return (${generatedCode})`;
    const foo = new Function(appendHelper)();

    // (3) run the generated function with stored input
    const outputs = [];
    const output1 = foo(
      fetchedTests.test1.input[0],
      fetchedTests.test1.input[1]
    );
    const output2 = foo(
      fetchedTests.test2.input[0],
      fetchedTests.test2.input[1]
    );
    const output3 = foo(
      fetchedTests.test3.input[0],
      fetchedTests.test3.input[1]
    );
    const output4 = foo(
      fetchedTests.test4.input[0],
      fetchedTests.test4.input[1]
    );
    const output5 = foo(
      fetchedTests.test5.input[0],
      fetchedTests.test5.input[1]
    );
    outputs.push(output1, output2, output3, output4, output5);

    const result = {
      actualOutput1: outputs[0],
      actualOutput2: outputs[1],
      actualOutput3: outputs[2],
      actualOutput4: outputs[3],
      actualOutput5: outputs[4],
    };

    res.json({ result });
  } catch (error) {
    console.error("Error in /api/openai-test route:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.use('/', express.static(frontend));

app.use((req, res, next) => {
  res.sendFile(path.join(frontend, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

