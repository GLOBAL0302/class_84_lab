import mongoose from 'mongoose';
import { ref } from 'process';

const schema = mongoose.Schema;

const taskSchema = new schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'userId is required for Task'],
  },
  title: {
    type: String,
    required: [true, 'title is required for title'],
  },
  description: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'complete'],
    default: 'new',
  },
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
