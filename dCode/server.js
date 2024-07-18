import express from 'express';
import { auth } from 'express-openid-connect';
import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pg = knex({
  client: 'pg',
  connection: {
    host: 'db',
    port: 5432,
    user: 'postgres',
    password: 'asdfasdf123123',
    database: 'example',
  },
});

const app = express();
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

app.use('/', express.static(frontend));

app.use((req, res, next) => {
  res.sendFile(path.join(frontend, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
