import "errors/asyncCatch";
import token from "utils/token";
import { RefreshToken, User } from "schemas";
import { getUserFromAccessToken, refreshAccessToken } from "./token";

jest.mock("errors", () => {
  return {
    catchErrors: (requestHandler: any) => (req: any, res: any, next: any) =>
      requestHandler(req, res, next),
  };
});

const mockResponse = {
  respond: jest.fn((data: any) => data),
  clearCookie: jest.fn((_cookieName) => {}),
  generateAccessToken: jest.fn((user) => user),
  send: jest.fn((_data) => {}),
};
const next = jest.fn();
const fakeUser = {
  _id: 1234,
  email: "email@domain.com",
  verified: true,
};

describe("getUserFromAccessToken", () => {
  test("throw error when there is no token", () => {
    const mockRequest: any = {
      signedCookies: {},
    };

    expect(() =>
      getUserFromAccessToken(mockRequest, mockResponse as any, next)
    ).toThrowError("InvalidTokenError");
  });

  test("respond with user details", () => {
    const mockRequest: any = {
      signedCookies: {
        accessToken: "someValidAccessToken",
      },
    };

    const vatSpy = jest.spyOn(token, "verifyAccessToken");
    vatSpy.mockReturnValue(fakeUser);

    getUserFromAccessToken(mockRequest, mockResponse as any, next);
    expect(mockResponse.respond).toHaveBeenCalledWith(fakeUser);
  });
});

describe("refreshToken", () => {
  const userFindOneSpy = jest.spyOn(User, "findOne") as jest.SpyInstance<any>;
  const refreshTokenDeleteOneSpy = jest.spyOn(
    RefreshToken,
    "deleteOne"
  ) as jest.SpyInstance<any>;
  const refreshTokenFindOneSpy = jest.spyOn(
    RefreshToken,
    "findOne"
  ) as jest.SpyInstance<any>;

  test("throw error when no refreshToken", () => {
    const mockRequest: any = {
      signedCookies: {},
    };

    refreshTokenDeleteOneSpy.mockReturnValue(undefined);

    expect(() =>
      refreshAccessToken(mockRequest, mockResponse as any, next)
    ).rejects.toThrow("InvalidTokenError");
  });

  test("throw error when refresh token is not found", () => {
    const mockRequest: any = {
      signedCookies: {
        refreshToken: "someValidRefreshToken",
      },
    };

    refreshTokenFindOneSpy.mockReturnValue(undefined);
    refreshTokenDeleteOneSpy.mockReturnValue(undefined);

    expect(() =>
      refreshAccessToken(mockRequest, mockResponse as any, next)
    ).rejects.toThrow("InvalidTokenError");
    expect(refreshTokenFindOneSpy).toHaveBeenCalledWith({
      refreshToken: mockRequest.signedCookies.refreshToken,
    });
  });

  test("generate access token", async () => {
    const mockRequest: any = {
      signedCookies: {
        refreshToken: "someValidRefreshToken",
      },
    };

    const fakeUser = {
      _id: "1234",
    }
    refreshTokenFindOneSpy.mockReturnValue({
      refreshToken: mockRequest.signedCookies.refreshToken,
      user: fakeUser._id,
    });
    userFindOneSpy.mockReturnValue({ _id: fakeUser._id });
    refreshTokenDeleteOneSpy.mockReturnValue(undefined);

    await refreshAccessToken(mockRequest, mockResponse as any, next);

    expect(mockResponse.generateAccessToken).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalled();
  });
});
