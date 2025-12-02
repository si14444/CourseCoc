import { deleteUserAccount, getUserProfile, signIn, signUp } from "../auth";

// Mock Firebase
jest.mock("../firebase", () => ({
  auth: null,
  db: null,
  storage: null,
}));

describe("Auth Functions", () => {
  describe("signUp", () => {
    it("should return error when Firebase is not initialized", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        nickname: "TestUser",
      };

      const result = await signUp(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Firebase가 초기화되지 않았습니다");
    });
  });

  describe("signIn", () => {
    it("should return error when Firebase Auth is not initialized", async () => {
      const result = await signIn("test@example.com", "password123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Firebase Auth가 초기화되지 않았습니다");
    });
  });

  describe("getUserProfile", () => {
    it("should return error when Firestore is not initialized", async () => {
      const result = await getUserProfile("test-uid");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Firestore가 초기화되지 않았습니다");
    });
  });

  describe("deleteUserAccount", () => {
    it("should return error when Firebase is not initialized", async () => {
      const result = await deleteUserAccount("test-uid");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Firebase가 초기화되지 않았습니다");
    });
  });
});
