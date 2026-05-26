import express from 'express';
import path from 'path';
import {fileURLToPath} from "url";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get(['/', '/index', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})
//Route handlers
router.get('/hello', (req, res, next) => {
    console.log('attempting to load hello page');
    next()
}, (req, res) => {
    res.send('Hello page');
})

export default router;