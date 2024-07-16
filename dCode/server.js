import express from 'express';
import {auth}  from "express-openid-connect"
import knex from 'knex';

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

app.use(express.static('dist'));

const config = {
	authRequired: false,
	auth0Logout: true,
	secret: 'a long, randomly-generated string stored in env',
	baseURL: 'http://localhost:3000',
	clientID: 'XUZuvE6pKXJ1di0ZaTnBNpfzxFswNHxI',
	issuerBaseURL: 'https://dev-6omitcvbhwq5hvfk.us.auth0.com'
};


// FIGURING OUT AUTH0 USER STORAGE 

// app.use(auth(config));

// app.post('/api/user', (req, res) => {
//     const { sub } = req.oidc.user;  

//     pg('users')
//         .insert({ auth0_user_id: sub })
//         .returning('*')
//         .then((user) => {
//             res.json(user);
//         })
//         .catch((err) => {
//             console.error('Error inserting user:', err);
//             res.status(500).json({ error: 'Failed to insert user' });
//         });
// });

// // Endpoint to fetch all users
// app.get('/api/users', (req, res) => {
//     // Query the database for all users
//     pg('users')
//         .select()
//         .then(users => {
//             res.json(users);
//         })
//         .catch((err) => {
//             console.error('Error fetching users:', err);
//             res.status(500).json({ error: 'Failed to fetch users' });
//         });
// });

// app.get('/api/problems', (req, res) => {
// 	pg('problems').select().then((problems) => {
// 		res.json(problems);
// 	});
// });


app.get('/api/problems/:id', (req, res) => {
	pg('problems').select().where('problem_id', req.params.id).then((problems) => {
		res.json(problems);
	});
});

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get("/pg", function(req, res, next) {
	pg.raw('select VERSION() version')
	  .then(x => x.rows[0])
	  .then((row) => res.json({ message: `Hello from postgresql ${row.version}` }))
	  .catch(next);
  });

// req.isAuthenticated is provided from the auth router
app.get('/a', (req, res) => {
	console.log(req.oidc.isAuthenticated());
	res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.listen(3000, () => {
	console.log('Server is listening on port 3000');
});