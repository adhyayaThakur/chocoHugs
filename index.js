require('./mongodb/mongodb');


// Import the necessary packages
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const exphb = require('express-handlebars');
const bodyparser = require('body-parser');

const __dirname = path.resolve();


const courseController = require('./controllers/courseController');
const authController = require('./routes/auth');
const schoolAdminProfileController = require('./routes/schoolAdminProfile');


app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());


// Create a welcome message and direct them to the main page
app.get('/', (req, res) => {
  res.send('jshe');
});

app.use(cors());

// Configuring Express middleware for the handlebars
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphb.engine({extname: 'hbs', defaultLayout: 'mainLayout', layoutDir: __dirname + 'views/layouts/'}));
app.set('view engine', 'hbs');

// Establish the server connection
// PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));


// Set the Controller path which will be responding the user actions
app.use('/auth', authController);
app.use('/course', courseController);
app.use('/schoolAdmin', schoolAdminProfileController);
