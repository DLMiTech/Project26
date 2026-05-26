import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({message: 'Welcome to the Movie App'});
})

router.post('/', (req, res) => {
    res.json({message: 'Welcome to the Movie App'});
})

router.put('/', (req, res) => {
    res.json({message: 'Welcome to the Movie App'});
})

router.delete('/', (req, res) => {
    res.json({message: 'Welcome to the Movie App'});
})

export default router;