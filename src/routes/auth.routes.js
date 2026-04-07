import { signup } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/sign-up', signup);

router.post('/sign-in', (req, res) => {
  res.send('This is the Sign-in router');
});

router.post('/sign-out', (req, res) => {
  res.send('This is the Sign-out router');
});

export default router;
