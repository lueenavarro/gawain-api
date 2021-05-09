import { model, Schema, Document } from "mongoose";
import { ITask } from "./Task";
import { IUser } from "./User";

export interface ITaskList extends Document {
  date: Date | string;
  tasks: Array<ITask>;
  user: IUser;
}

const taskListSchema = new Schema({
  date: { type: Date, require: true },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  user:{
    type: Schema.Types.ObjectId,
    ref: "User",
  }, 
});

export const TaskList = model<ITaskList>("TaskList", taskListSchema);
