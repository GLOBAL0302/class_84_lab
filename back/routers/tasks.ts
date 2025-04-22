import express from 'express';
import { Error } from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import Task from '../models/Task';
import { error } from 'console';

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;

    const newTask = {
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    };

    const task = await new Task(newTask);
    task.save();
    res.status(200).send({
      message: 'Successfully added',
      task,
    });
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      res.status(400).send({ error: e });
    }
    next(e);
  }
});

tasksRouter.get('/', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const tasks = await Task.find({ user: user._id });
    res.status(200).send(tasks);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      res.status(400).send({ error: e });
    }
    next(e);
  }
});

tasksRouter.put('/:id', auth, async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = (req as RequestWithUser).user;
    const task = await Task.findById({ _id: id });
    if (!task) {
      res.status(400).send({ error: 'No such Id' });
      return;
    }

    if (task?.user.toString() !== user._id.toString()) {
      res.status(403).send({ error: 'Can not change others todo' });
      return;
    }
    await task.updateOne({ status: req.body.status });
    task.save();
    const updateOneTask = await Task.findById(task._id);
    res.status(200).send(updateOneTask);
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      res.status(400).send({ error: e });
    }
    next(e);
  }
});

tasksRouter.delete('/:id', auth, async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = (req as RequestWithUser).user;
    const task = await Task.findById({ _id: id });
    if (!task) {
      res.status(400).send({ error: 'No such Id' });
      return;
    }

    if (task?.user.toString() !== user._id.toString()) {
      res.status(403).send({ error: 'Can not delete Others Task' });
      return;
    }
    await Task.deleteOne({ _id: task._id });
    res.status(200).send({ message: 'Deleted Succesfully' });
  } catch (e) {
    if (e instanceof Error.ValidationError) {
      res.status(400).send({ error: e });
    }
    next(e);
  }
});

export default tasksRouter;
