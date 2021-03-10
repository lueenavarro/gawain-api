import mongoose from "mongoose";

import { Task } from "schemas";
import { clearMockDB, startMockDB, stopMockDB } from "test/mockDB";
import { findOrInsert, findOrThrow } from "./db";

beforeAll(startMockDB);
afterAll(stopMockDB);
beforeEach(clearMockDB);

const fakeTaskObj = {
  task: "Go To Market",
  list: mongoose.Types.ObjectId(),
};
const createSpy = jest.spyOn(Task, "create");

test("findOrThrow should find", async () => {
  await Task.create(fakeTaskObj);
  const foundTask = await findOrThrow(Task, { task: fakeTaskObj.task });
  expect(foundTask.task).toBe(fakeTaskObj.task);
});

test("findOrThrow should throw error", async () => {
  await expect(findOrThrow(Task, { task: "Go To Market" })).rejects.toThrow();
});

test("findOrInsert should insert", async () => {
  createSpy.mockClear();
  await findOrInsert(Task, { task: fakeTaskObj.task }, fakeTaskObj);
  expect(createSpy).toHaveBeenCalledTimes(1);
});

test("findOrInsert should not insert", async () => {
  await Task.create(fakeTaskObj);
  createSpy.mockClear();
  const foundTask = await findOrInsert(
    Task,
    { task: fakeTaskObj.task },
    fakeTaskObj
  );
  expect(createSpy).not.toHaveBeenCalled();
  expect(foundTask.task).toBe(fakeTaskObj.task);
});
