import moment from "moment";

import { BadUserInputError } from "errors";

export const dateRange = (start: Date | string, end?: Date | string) => {
  if (!isValidDate(start))
    throw new BadUserInputError({ error: "Invalid start date" });

  if (!end) return [formatDate(start)];

  if (!isValidDate(end))
    throw new BadUserInputError({ error: "Invalid end date" });

  const arr = [];
  for (
    const dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(formatDate(dt));
  }

  return arr;
};

export const getDay = (date: Date | string) => {
  return moment(date, true).format("dddd");
};

const formatDate = (date: Date | string) => {
  return moment(date, true).format("YYYY-MM-DD");
};

const isValidDate = (date: Date | string) => {
  return moment(date, moment.ISO_8601, true).isValid();
};
