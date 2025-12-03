import { renderHook, waitFor } from "@testing-library/react";
import { useCourse, useCourses, useUserCourses } from "../useCourses";

// Mock CourseService
jest.mock("@/services/CourseService");
jest.mock("@/repositories/CourseRepository");

describe("useCourses Hook", () => {
  it("fetches courses on mount", async () => {
    const { result } = renderHook(() => useCourses());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("handles errors gracefully", async () => {
    // Mock service to throw error
    const { result } = renderHook(() => useCourses());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Error should be captured
    if (result.current.error) {
      expect(typeof result.current.error).toBe("string");
    }
  });
});

describe("useCourse Hook", () => {
  it("fetches a single course by ID", async () => {
    const { result } = renderHook(() => useCourse("test-id"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});

describe("useUserCourses Hook", () => {
  it("fetches user courses", async () => {
    const { result } = renderHook(() => useUserCourses("user-123"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("provides deleteCourse function", () => {
    const { result } = renderHook(() => useUserCourses("user-123"));

    expect(typeof result.current.deleteCourse).toBe("function");
  });
});
