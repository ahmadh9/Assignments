import express from 'express';
import { createUser, deleteUsers, getUser, updateUsers } from '../controllers/usersController';
import { create } from 'domain';
 const router = express.Router();

 router.get('/', getUser);

 router.get('/createUser', createUser);
  router.get('/update:/id', updateUsers);
 router.get('/delete:/id', deleteUsers);


 export default router;