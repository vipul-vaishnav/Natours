import express from 'express';
import { getAllUsers, createUser, getUser, updateUser, deleteUser } from '../controllers/userController.mjs';

const userRouter = express.Router();

// USER ROUTES

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
