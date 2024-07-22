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
    host: 'db',
    password: 'asdfasdf123123',
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

app.get('/a', (req, res) => {
  console.log(req.oidc.isAuthenticated());
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
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
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
  }
};

app.post('/api/openai-test', async (req, res) => {
  const { prompt } = req.body;
  try {
    const generatedCode = await callOpenAI(prompt);
    res.json({ generatedCode });
  } catch (error) {
    console.error('Error in /api/openai-test route:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/', express.static(frontend));

app.use((req, res, next) => {
  res.sendFile(path.join(frontend, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

