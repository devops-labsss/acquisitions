import  {deleteUserById, fetchAllUsers, fetchUserById, updateUserById}  from '#controllers/users.controller.js';
import { authenticatToken, requiredRole } from '#middleware/auth.middleware.js';
import express from 'express'; 

const router = express.Router();

router.get('/', fetchAllUsers)

router.get('/:id', authenticatToken, fetchUserById)

router.put('/:id',authenticatToken, updateUserById)

router.delete('/:id',authenticatToken ,requiredRole(['admin']), deleteUserById)

export default router;