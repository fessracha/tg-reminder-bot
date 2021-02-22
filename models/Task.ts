import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  chatId: string;
  cronTabDate: string;
  message: string;
  completed: boolean;
}

const tasksSchema: Schema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  cronTabDate: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
    required: false,
  }
})

const Task = mongoose.model<ITask>('tasks', tasksSchema);

export default Task;