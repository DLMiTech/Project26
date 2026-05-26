Create project
    npm init -y


Create a src folder to hold all code and server.js as app start point



install dependencies
    npm install
        1. express
        2. nodemon --save-dev



start server code
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})



run app with nodemon
"dev": "nodemon src/server.js"
run app using
    npm run dev



change require to import
"type": "module",
    import express from 'express';



how to create a route
app.get('/', (req, res) => {
    res.send('Hello World!');
})


return html file
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get('/', (req, res) => {
    res.sendFile('./views/index.html', { root: __dirname });
})