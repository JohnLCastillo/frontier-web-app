'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const { router: usersRouter } = require('./users');
const { router: candidateRouter, socket } = require('./candidates');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;
// const { PORT, DATABASE_URL } = require('./config');

const app = express();


// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}
	next();
});
app.use(jsonParser);

app.use('/api', usersRouter);
app.use('/candidate', candidateRouter);

app.use('*', (req, res) => {
	return res.status(404).json({ message: 'Not Found' });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(databaseUrl = process.env.DATABASE_URL, port = process.env.PORT) {
    //console.log('databaseurl-', databaseUrl)
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				//console.log(`Your app is listening on port ${port}`);
				socket(server);
				resolve(server);
			})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
	return new Promise((resolve, reject) => {
		mongoose.disconnect();
		//console.log('Closing server');
		server.close(err => {
			console.error(err);
			if (err) {
				return reject(err);
			}
			resolve();
		});
	})
		.catch(err =>{
			return //console.log(err);
		});
}


// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };