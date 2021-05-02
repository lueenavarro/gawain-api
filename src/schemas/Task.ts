import { model, Schema, Document, Types } from "mongoose";
import { ITaskList } from "./TaskList";

export interface ITask extends Document {
  task: string;
  completed: boolean;
  list: ITaskList;
}

const taskSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: Types.ObjectId(),
  },
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  list: { type: Schema.Types.ObjectId, ref: "TaskList", required: true },
});

export const Task = model<ITask>("Task", taskSchema);
