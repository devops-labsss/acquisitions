import  {fetchAllUsers}  from '#controllers/users.controller.js';
import express from 'express'; 

const router = express.Router();

router.get('/', fetchAllUsers)

router.get('/:id', ( ) => {
    res.status(200).send(`GET/:id from the user endppoint`);
})

router.put('/:id', ( ) => {
    res.status(200).send(`PUT/:id from the user endppoint`);
})

router.delete('/:id', ( ) => {
    res.status(200).send(`DELETE/:id from the user endppoint`);
})

export default router;