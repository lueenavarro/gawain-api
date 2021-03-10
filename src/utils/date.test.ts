import { BadUserInputError } from "errors";
import { dateRange, getDay } from "utils/date";

test("return valid date range", () => {
  expect(dateRange("2021-02-26", "2021-03-01")).toStrictEqual([
    "2021-02-26",
    "2021-02-27",
    "2021-02-28",
    "2021-03-01",
  ]);
});

test("throw error on invalid date", () => {
  expect(() => dateRange("2021-02-29", "2021-03-01")).toThrowError(
    BadUserInputError
  );
});

test("accept date object", () => {
  expect(
    dateRange(new Date("2021-02-26"), new Date("2021-03-01"))
  ).toStrictEqual(["2021-02-26", "2021-02-27", "2021-02-28", "2021-03-01"]);
});

test("return empty array", () => {
  expect(dateRange("2021-03-01", "2021-02-26")).toStrictEqual([]);
});

test("return correct day of the week", () => {
  expect(getDay("2021-02-28")).toBe("Sunday");
});

test("return invalid date", () => {
  expect(getDay("2021-02-31")).toBe("Invalid date");
});
