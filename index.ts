import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import TelegramBot from 'node-telegram-bot-api';

import MessageParser from './MessageParser';

import Task, { ITask } from './models/Task';

dotenv.config();

const TOKEN: string = process.env.TELEGRAM_TOKEN!;

try {
  mongoose.connect(
    `mongodb://${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
  )
    .then(() => {
      console.log('\n\nDB Connection Successfull');
    })
    .catch((error: mongoose.Error) => {
      console.log('error: ', error);
    });
} catch (e) {
  console.log(e);
}

async function subscribeUncompletedTasks(): Promise<void> {
  const tasks = await Task.find().where('completed', false);

  tasks.forEach(task => {
    subscribeTask(task);
    console.log(`subscribe task: ${task.id} in memory`);
  })
}

function subscribeTask(task: ITask): void {
  cron.schedule(task.cronTabDate, async () => {
    bot.sendMessage(task.chatId, task.message);
    await Task.updateOne({ _id: task._id }, { $set: { completed: true } });
  });
}

const bot = new TelegramBot(TOKEN, { polling: true });

subscribeUncompletedTasks();

bot.on('message', async (message: TelegramBot.Message) => {
  if (message.text) {
    const parsedTask = MessageParser.parse(message.text);

    const task = new Task({
      chatId: message.chat.id,
      cronTabDate: parsedTask.cronTabDate,
      message: parsedTask.text,
    })

    task.save();

    subscribeTask(task);
  }
});








