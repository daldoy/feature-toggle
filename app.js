const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user');
const reactFeatureRoutes = require('./api/routes/react-features');

const path = require('path');
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

mongoose.set('useCreateIndex', true);
mongoose.connect(
	'mongodb+srv://admin:' +
		process.env.MONGO_ATLAS_PW +
		'@feature-toggle-challenge-ktwvm.mongodb.net/test?retryWrites=true',
	{
		useNewUrlParser: true,
	},
);

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

app.use('/rest-auth', userRoutes);
app.use('/features-api', reactFeatureRoutes);

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

module.exports = app;
