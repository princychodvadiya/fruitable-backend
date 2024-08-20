require('dotenv').config()
const express = require('express');
const routes = require('./routes/api/v1/index');
const connectDB = require('./db/mongodb');
const cookieParser = require('cookie-parser')
var cors = require('cors');
const passport = require('passport');
const { facebookLoginProvider, googleLoginProvider } = require('./utils/provider');
// const connectChat = require('./utils/socketIO');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
googleLoginProvider();

const _dirname = path.resolve();

const __swaggerDistPath = path.join(_dirname, 'node_modules', 'swagger-ui-dist'); //install swagger-ui-dist

const swaggerDocument = YAML.load(path.resolve('./public', 'api.yaml'));

app.use(
    '/api/docs',
    express.static(__swaggerDistPath, { index: false }), // Serve Swagger UI assets
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            url: '/public/api.yaml' // Path to your YAML file
        }
    })
);
// const swaggerDocument = YAML.load('./src/api.yaml')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json())
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

connectDB();
// connectChat()    not sported.

// facebookLoginProvider()

app.use('/api/v1', routes);

app.get('/', (req, res) => {
    res.send('Hello World')
})



app.listen(8000, () => {
    console.log("server start at port 8000.");
});

