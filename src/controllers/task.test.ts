import mongoose, { mongo } from "mongoose";

import { Task, TaskList } from "schemas";
import { clearMockDB, startMockDB, stopMockDB } from "test/mockDB";
import * as dbutils from "utils/db";
import * as dateUtil from "utils/date";
import * as tasks from "./tasks";

beforeAll(startMockDB);
afterAll(stopMockDB);

let mockResponse: any;
let next: any;
beforeEach(async () => {
  mockResponse = {
    respond: jest.fn((data: any) => data),
  };
  next = jest.fn();

  jest.restoreAllMocks();
  await clearMockDB();
});

test("Create task", async () => {
  const fakeTaskId = mongoose.Types.ObjectId();
  const mockRequest: any = {
    body: {
      _id: fakeTaskId,
      task: "Go To Market",
      date: "2021-03-03",
    },
  };

  const foiSpy = jest.spyOn(dbutils, "findOrInsert");
  const fakeTaskListId = mongoose.Types.ObjectId();
  const fakeTaskList = new TaskList({
    _id: fakeTaskListId,
    tasks: [],
  });
  foiSpy.mockReturnValue(Promise.resolve(fakeTaskList));

  await tasks.create(mockRequest, mockResponse, next);

  const foundTask = await Task.find({ task: "Go To Market" });
  expect(foiSpy).toHaveBeenCalledWith(
    TaskList,
    { date: "2021-03-03" },
    { date: "2021-03-03" }
  );
  expect(foiSpy).toHaveBeenCalledTimes(1);
  expect(foundTask[0]?._id).toStrictEqual(fakeTaskId);
  expect(foundTask[0]?.task).toBe("Go To Market");
  expect(foundTask[0]?.list).toStrictEqual(fakeTaskListId);
});

test("Find task", async () => {
  const mockRequest: any = {
    query: {
      start: "2021-02-28",
      end: "2021-03-01",
    },
  };
  const dateRangeSpy = jest.spyOn(dateUtil, "dateRange");
  dateRangeSpy.mockReturnValue(["2021-02-28", "2021-03-01"]);

  await tasks.find(mockRequest, mockResponse, next);
  expect(dateRangeSpy).toHaveBeenLastCalledWith("2021-02-28", "2021-03-01");
  expect(mockResponse.respond).toHaveBeenCalledWith({
    "2021-02-28": { date: "2021-02-28", day: "Sunday", tasks: [] },
    "2021-03-01": { date: "2021-03-01", day: "Monday", tasks: [] },
  });
});

test("Move task", async () => {
  const fakeOldTaskList = new TaskList({
    date: "2021-02-28",
    tasks: [],
  });

  const fakeTask = await Task.create({
    _id: mongoose.Types.ObjectId(),
    task: "Go to market",
    list: fakeOldTaskList._id,
  });

  const fakeNewTaskList = new TaskList({
    date: "2021-03-01",
    tasks: [],
  });
  const fotSpy = jest
    .spyOn(dbutils, "findOrThrow")
    .mockReturnValue(Promise.resolve(fakeOldTaskList));

  const foiSpy = jest
    .spyOn(dbutils, "findOrInsert")
    .mockReturnValue(Promise.resolve(fakeNewTaskList));

  const mockRequest: any = {
    body: {
      source: { date: "2021-02-28", index: 0 },
      destination: { date: "2021-03-01", index: 1 },
      _id: fakeTask._id,
    },
  };

  await tasks.move(mockRequest, mockResponse, next);

  expect(fotSpy).toHaveBeenCalledWith(TaskList, { date: "2021-02-28" });
  expect(foiSpy).toHaveBeenCalledWith(
    TaskList,
    { date: "2021-03-01" },
    { date: "2021-03-01" }
  );
  expect(mockResponse.respond).toHaveBeenCalledWith({
    _id: fakeTask._id,
    completed: false,
    list: fakeNewTaskList._id,
    task: "Go to market",
    __v: 0,
  });
});

test("Remove task", async () => {
  const fakeTask = await Task.create({
    _id: mongoose.Types.ObjectId(),
    task: "Go To Market",
    list: mongoose.Types.ObjectId(),
  });

  const mockRequest: any = {
    params: {
      id: fakeTask._id,
    },
  };
  const taskSpy = jest.spyOn(Task, "findOne");

  await tasks.remove(mockRequest, mockResponse, next);

  expect(taskSpy).toHaveBeenCalledWith({ _id: mockRequest.params.id });
  expect(taskSpy).toHaveBeenCalledTimes(1);
  expect(mockResponse.respond).not.toHaveBeenCalledWith(null);
});

test("Task already removed", async () => {
  const mockRequest: any = {
    params: {
      id: mongoose.Types.ObjectId(),
    },
  };

  await tasks.remove(mockRequest, mockResponse, next);

  expect(mockResponse.respond).toHaveBeenCalledWith(null);
});
