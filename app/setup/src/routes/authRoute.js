import express from 'express';
import registerController from '../controllers/authController.js';
const router = express.Router();

router.post('/register', registerController.createNewUser);
router.post('/login', registerController.loginUser);
router.get('/refresh', registerController.refreshToken);
router.get('/logout', registerController.logoutUser);


export default router;
