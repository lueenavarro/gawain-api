import { model, Schema, Document } from "mongoose";
import { ITaskList, TaskList } from "./TaskList";

export interface ITask extends Document {
  task: string;
  completed: boolean;
  list: ITaskList;
}

const taskSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  list: { type: Schema.Types.ObjectId, ref: "TaskList", required: true },
});

taskSchema.pre("deleteOne", { document: true }, async function () {
  await TaskList.updateMany({}, { $pull: { tasks: this._id } });
  await TaskList.deleteMany({ tasks: { $size: 0 } });
});

export const Task = model<ITask>("Task", taskSchema);
