import express from 'express';
import {auth}  from "express-openid-connect"

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

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
	console.log(req.oidc.isAuthenticated());
	res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.listen(3000, () => {
	console.log('Server is listening on port 3000');
});