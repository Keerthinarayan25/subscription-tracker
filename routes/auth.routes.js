import { Router } from 'express';
import { signUp, signIn, signOut } from '../controllers/auth.controller.js';
// Importing necessary modules and controllers for authentication routes

const authRouter = Router();

//path: /api/v1/auth/sign-in(POST)

authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

authRouter.post('./sign-out', signOut);

export default authRouter;