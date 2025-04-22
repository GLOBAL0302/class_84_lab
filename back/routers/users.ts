import express from 'express';
import { Error } from 'mongoose';
import User from '../models/User';
import { RequestWithUser } from '../middleware/auth';
import { error } from 'console';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      error: 'username and password  required',
    });
  }

  try {
    const user = await new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.generateToken();
    user.save();

    res.status(200).send({
      message: 'User Registered',
      user,
    });
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      res.status(400).send({ error: e });
    }
    next(e);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      error: 'username and password  required',
    });
  }

  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user) {
    res.status(404).send({ error: 'Username not found' });
    return;
  }
  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    res.status(400).send({ error: 'Password is incorrect' });
    return;
  }

  await user.generateToken();
  await user.save();
  res.send({
    username: user.username,
    token: user.token,
  });
});

export default usersRouter;
