import {
  AppError,
  createErrorResult,
  createSuccessResult,
  getAuthErrorMessage,
  handleError,
} from "../errors";

describe("Error Utilities", () => {
  describe("AppError", () => {
    it("should create AppError with correct properties", () => {
      const error = new AppError("Test error", "TEST_ERROR", 400);

      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_ERROR");
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe("AppError");
    });

    it("should default to 500 status code", () => {
      const error = new AppError("Test error", "TEST_ERROR");

      expect(error.statusCode).toBe(500);
    });
  });

  describe("getAuthErrorMessage", () => {
    it("should return Korean message for known error codes", () => {
      expect(getAuthErrorMessage("auth/invalid-email")).toBe(
        "유효하지 않은 이메일 형식입니다."
      );
      expect(getAuthErrorMessage("auth/user-not-found")).toBe(
        "등록되지 않은 이메일입니다."
      );
    });

    it("should return default message for unknown error codes", () => {
      expect(getAuthErrorMessage("unknown-error")).toBe(
        "알 수 없는 오류가 발생했습니다."
      );
    });
  });

  describe("handleError", () => {
    it("should handle AppError", () => {
      const error = new AppError("Custom error", "CUSTOM_ERROR");
      const result = handleError(error);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Custom error");
    });

    it("should handle standard Error", () => {
      const error = new Error("Standard error");
      const result = handleError(error);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Standard error");
    });

    it("should handle unknown errors", () => {
      const result = handleError("string error");

      expect(result.success).toBe(false);
      expect(result.error).toBe("알 수 없는 오류가 발생했습니다.");
    });
  });

  describe("createSuccessResult", () => {
    it("should create success result with data", () => {
      const result = createSuccessResult({ id: 1, name: "Test" });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: 1, name: "Test" });
    });
  });

  describe("createErrorResult", () => {
    it("should create error result with message", () => {
      const result = createErrorResult("Error message");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Error message");
    });
  });
});
