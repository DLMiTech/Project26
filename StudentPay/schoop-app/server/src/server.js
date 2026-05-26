import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from "url";
import { logger } from './middleware/logEvents.js';
import credentials from "./middleware/credentials.js";
import errorHandle from './middleware/errorHandler.js';
import limiter from "./middleware/rateLimiter.js";
import corsOptions from "./config/corsOption.js";
import ipWhitelist from "./middleware/ipWhitelist.js";
import rootRoute from "./routes/root.js";
import employeesRoute from "./routes/api/employeeRoute.js";
import authRoute from "./routes/authRoute.js";
import cors from 'cors';
const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//log
app.use(logger);
app.set('trust proxy', 1);
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
//Cross-origin resource sharing
app.use(cors(corsOptions));
//app.use(ipWhitelist);
//build-in middleware for urlencode models, form models
app.use(express.urlencoded({ extended: true }));
//json
app.use(express.json());
//static files
app.use(express.static(path.join(__dirname, 'public')));
//cookies
app.use(cookieParser());


/* ROUTES */
app.use('/', rootRoute);
app.use('/auth',limiter, authRoute);




/* 404 HANDLER */
app.use((req, res) => {
    res.status(404).send({
        status: 404,
        message: 'Request url Not Found'
    })
});

/* ERROR HANDLER */
app.use(errorHandle);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})