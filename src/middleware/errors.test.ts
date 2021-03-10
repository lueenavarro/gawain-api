import { handleError } from "middleware/errors";
import { RouteNotFoundError } from "errors";

let mockSend: any;
let mockStatus: any;
let fakeRequest: any;
let fakeResponse: any;
let fakeNext: any;

beforeEach(() => {
  jest.resetAllMocks();

  mockSend = jest.fn();
  fakeRequest = {};
  mockStatus = jest.fn(() => ({
    send: mockSend,
  }));
  fakeResponse = {
    status: mockStatus,
  };
  fakeNext = jest.fn();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

test("Should respond with customError", () => {
  const fakeError = new RouteNotFoundError("example.com/movie");
  handleError(fakeError, fakeRequest, fakeResponse, fakeNext);
  expect(mockSend).toHaveBeenCalledWith({
    error: {
      message: fakeError.message,
      code: fakeError.code,
      status: fakeError.status,
      data: fakeError.data,
    },
  });
  expect(mockStatus).toHaveBeenCalledWith(fakeError.status);
});

test("Should respond with default Error", () => {
  const fakeError = new Error("Random Error");
  handleError(fakeError, fakeRequest, fakeResponse, fakeNext);
  expect(mockSend).toHaveBeenCalledWith({
    error: {
      message: "Something went wrong, please contact our support.",
      code: "INTERNAL_ERROR",
      status: 500,
      data: {},
    },
  });
  expect(mockStatus).toHaveBeenCalledWith(500);
});
