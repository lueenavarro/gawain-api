import { RefreshToken, User } from "schemas";
import passwordUtil from "utils/password";
import { login, signup } from "./user";

jest.mock("errors", () => {
  return {
    catchErrors: (requestHandler: any) => (req: any, res: any, next: any) =>
      requestHandler(req, res, next),
  };
});

jest.mock("utils/password", () => {
  return {
    hash: (password: string) => password,
    compare: (_password: string) => {}
  };
});

jest.mock("schemas");

const mockResponse: any = {
  respond: jest.fn((_data) => {}),
  clearCookie: jest.fn((_cookieName) => {}),
  generateAccessToken: jest.fn((_user) => "validAccessToken"),
  generateRefreshToken: jest.fn((_user) => "validRefreshToken"),
  send: jest.fn((_data) => {}),
  status: jest.fn((_status) => mockResponse),
};
const next = jest.fn();

const fakeUser = {
  email: "someValidEmail@email.com",
  password: "someValidPassword",
};

describe("User Controller", () => {
  
  beforeEach(() => {
    ((RefreshToken as unknown) as jest.Mock<any>).mockImplementation(() => {
      return {
        refreshToken: null,
        user: null,
        save: () => {},
      };
    });
  });

  describe("signup", () => {
  
    beforeEach(() => {
      ((User as unknown) as jest.Mock<any>).mockImplementation(() => {
        return {
          _id: "1234",
          email: null,
          password: null,
          verified: false,
          save: () => {},
        };
      });
    });
  
    test("call response send", async () => {
      const mockRequest = {
        body: fakeUser,
      };
  
      await signup(mockRequest as any, mockResponse as any, next);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        _id: "1234",
        email: fakeUser.email,
        verified: false,
      });
    });
  });
  
  describe("login", () => {
  
    test("return 401 when no user found", async () => {
      const mockRequest = {
        body: fakeUser,
      };
  
      const userFindOneSpy = jest.spyOn(User, "findOne") as jest.Mock;
      userFindOneSpy.mockReturnValue(null);
  
      await login(mockRequest as any, mockResponse, next);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  
    test("return 401 when password is wrong", async () => {
      const mockRequest = {
        body: fakeUser,
      };
  
      const userFindOneSpy = jest.spyOn(User, "findOne") as jest.Mock;
      userFindOneSpy.mockReturnValue(fakeUser);
      const passwordUtilCompareSpy = jest.spyOn(passwordUtil, "compare");
      passwordUtilCompareSpy.mockReturnValue(Promise.resolve(false));
  
      await login(mockRequest as any, mockResponse, next);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  
    test("respond when everything is correct", async () => {
      const mockRequest = {
        body: fakeUser,
      };
  
      const fakeUserData = {
        _id: "1234",
        ...fakeUser,
        verified: true
      }
  
      const userFindOneSpy = jest.spyOn(User, "findOne") as jest.Mock;
      userFindOneSpy.mockReturnValue(fakeUserData);
      const passwordUtilCompareSpy = jest.spyOn(passwordUtil, "compare");
      passwordUtilCompareSpy.mockReturnValue(Promise.resolve(true));
  
      await login(mockRequest as any, mockResponse, next);
      
      expect(mockResponse.respond).toHaveBeenCalledWith({
        _id: fakeUserData._id,
        email: fakeUserData.email,
        verified: fakeUserData.verified
      });
    });
  });
})


