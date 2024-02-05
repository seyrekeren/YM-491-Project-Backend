import { Router } from 'express';
import {signup, login, logout, currentUser as currentUserController} from "../../controllers/auth";
import {currentUser as currentUserMiddleware} from "../../middlewares/current-user";

const router: Router = Router();

router.post('/register', signup);

router.post('/login',  login);

router.post('/logout', logout);

router.get('/current-user', currentUserMiddleware,  currentUserController)

export { router as authRouter };