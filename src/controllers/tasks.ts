import { map, pick } from "lodash";

import { catchErrors } from "errors";
import { Task, TaskList } from "schemas";
import { dateRange, getDay } from "utils/date";
import { findOrInsert, findOrThrow } from "utils/db";
import { KeyString } from "types";

export const create = catchErrors(async (req, res) => {
  const { _id, task: newTask, date } = req.body;

  const taskList = await findOrInsert(
    TaskList,
    { date, user: req.user._id },
    { date, user: req.user._id }
  );
  const task = await Task.create({
    _id,
    task: newTask,
    list: taskList._id,
  });

  await taskList.updateOne({ $push: { tasks: task._id } });

  res.respond(task);
});

export const find = catchErrors(async (req, res) => {
  const tasks: KeyString<any> = {};
  for (let date of dateRange(<string>req.query.start, <string>req.query.end)) {
    const taskList = await TaskList.findOne({
      date,
      user: req.user._id,
    }).populate("tasks");
    tasks[date] = {
      date: date,
      day: getDay(date),
      tasks: map(taskList?.tasks, (item) =>
        pick(item, ["_id", "task", "completed"])
      ),
    };
  }

  res.respond(tasks);
});

export const move = catchErrors(async (req, res) => {
  const { source, destination, _id } = req.body;

  const oldTaskList = await findOrThrow(TaskList, {
    date: source.date,
    user: req.user._id,
  });
  await oldTaskList.updateOne({ $pull: { tasks: _id } });

  const newTaskList = await findOrInsert(
    TaskList,
    { date: destination.date, user: req.user._id },
    { date: destination.date, user: req.user._id }
  );
  await newTaskList.updateOne({
    $push: { tasks: { $each: [_id], $position: destination.index } },
  });

  await TaskList.deleteMany({ tasks: { $size: 0 } });

  res.respond(
    await Task.findByIdAndUpdate(
      _id,
      { list: newTaskList._id },
      { lean: true, new: true }
    )
  );
});

export const remove = catchErrors(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id });

  if (task) {
    await task.deleteOne();

    const taskList = await TaskList.findOne({
      _id: task.list,
      user: req.user._id,
    });
    await taskList?.update({ $pull: { tasks: task._id } });
    await TaskList.deleteMany({ tasks: { $size: 0 } });
  }

  res.respond(task);
});

export const complete = catchErrors(async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed == true },
    { new: true }
  );

  res.respond(task);
});
