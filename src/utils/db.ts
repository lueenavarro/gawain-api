import { Model, Document } from "mongoose";
import { EntityNotFoundError } from "errors/customErrors";

export const findOrThrow = async <T extends Document>(
  Model: Model<T>,
  query: any
): Promise<T> => {
  const item = await Model.findOne(query);
  if (!item) {
    throw new EntityNotFoundError(Model.name);
  }
  return item;
};

export const findOrInsert = async <T extends Document>(
  Model: Model<T>,
  query: any,
  content: any
): Promise<T> => {
  const item = await Model.findOne(query);
  if (item) {
    return item;
  }
  return await Model.create(content);
};
