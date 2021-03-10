import { model, Schema, Document } from "mongoose";
import { ITask } from "./Task";

export interface ITaskList extends Document {
  date: Date | string;
  tasks: Array<ITask>;
}

const taskListSchema = new Schema({
  date: { type: Date, require: true },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

export const TaskList = model<ITaskList>("TaskList", taskListSchema);
