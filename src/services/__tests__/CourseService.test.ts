import { Course } from "@/lib/firebaseCourses";
import { ICourseRepository } from "@/repositories/CourseRepository";
import { Location } from "@/types";
import { CourseService } from "../CourseService";

// Mock Repository
class MockCourseRepository implements ICourseRepository {
  private courses: Map<string, Course> = new Map();

  async create(course: Omit<Course, "id">): Promise<string> {
    const id = "test-id-" + Date.now();
    this.courses.set(id, { ...course, id });
    return id;
  }

  async findById(id: string): Promise<Course | null> {
    return this.courses.get(id) || null;
  }

  async findAll(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter((c) => !c.isDraft);
  }

  async findByUserId(userId: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (c) => c.authorId === userId
    );
  }

  async findByTag(tag: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter((c) =>
      c.tags?.includes(tag)
    );
  }

  async update(id: string, data: Partial<Course>): Promise<void> {
    const course = this.courses.get(id);
    if (course) {
      this.courses.set(id, { ...course, ...data });
    }
  }

  async delete(id: string): Promise<void> {
    this.courses.delete(id);
  }
}

// Helper to create test location
const createTestLocation = (id: string, name: string): Location => ({
  id,
  name,
  address: "Test Address",
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("CourseService", () => {
  let service: CourseService;
  let repository: MockCourseRepository;

  beforeEach(() => {
    repository = new MockCourseRepository();
    service = new CourseService(repository);
  });

  describe("publishCourse", () => {
    it("should create a course with valid data", async () => {
      const courseData = {
        title: "Test Course",
        description: "Test Description",
        tags: ["tag1"],
        duration: "2-3시간",
        budget: "5만원 이하",
        season: "봄",
        locations: [createTestLocation("1", "Place 1")],
        content: "Test content",
        authorId: "user123",
      };

      const result = await service.publishCourse(courseData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should fail without title", async () => {
      const courseData = {
        title: "",
        description: "Test Description",
        tags: ["tag1"],
        duration: "2-3시간",
        budget: "5만원 이하",
        season: "봄",
        locations: [createTestLocation("1", "Place 1")],
        content: "Test content",
        authorId: "user123",
      };

      const result = await service.publishCourse(courseData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("제목");
    });

    it("should fail without locations", async () => {
      const courseData = {
        title: "Test Course",
        description: "Test Description",
        tags: ["tag1"],
        duration: "2-3시간",
        budget: "5만원 이하",
        season: "봄",
        locations: [],
        content: "Test content",
        authorId: "user123",
      };

      const result = await service.publishCourse(courseData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("장소");
    });
  });

  describe("getCourse", () => {
    it("should return course and increment views", async () => {
      const courseData = {
        title: "Test Course",
        description: "Test Description",
        tags: ["tag1"],
        duration: "2-3시간",
        budget: "5만원 이하",
        season: "봄",
        locations: [createTestLocation("1", "Place 1")],
        content: "Test content",
        authorId: "user123",
      };

      const createResult = await service.publishCourse(courseData);
      const courseId = createResult.data!;

      const result = await service.getCourse(courseId);

      expect(result.success).toBe(true);
      expect(result.data?.views).toBe(1);
    });

    it("should fail for non-existent course", async () => {
      const result = await service.getCourse("non-existent-id");

      expect(result.success).toBe(false);
      expect(result.error).toContain("찾을 수 없습니다");
    });
  });

  describe("deleteCourse", () => {
    it("should delete course with correct authorization", async () => {
      const courseData = {
        title: "Test Course",
        description: "Test Description",
        tags: ["tag1"],
        duration: "2-3시간",
        budget: "5만원 이하",
        season: "봄",
        locations: [createTestLocation("1", "Place 1")],
        content: "Test content",
        authorId: "user123",
      };

      const createResult = await service.publishCourse(courseData);
      const courseId = createResult.data!;

      const deleteResult = await service.deleteCourse(courseId, "user123");

      expect(deleteResult.success).toBe(true);
    });

    it("should fail to delete without authorization", async () => {
      const courseData = {
        title: "Test Course",
        description: "Test Description",
        tags: ["tag1"],
        duration: "2-3시간",
        budget: "5만원 이하",
        season: "봄",
        locations: [createTestLocation("1", "Place 1")],
        content: "Test content",
        authorId: "user123",
      };

      const createResult = await service.publishCourse(courseData);
      const courseId = createResult.data!;

      const deleteResult = await service.deleteCourse(courseId, "other-user");

      expect(deleteResult.success).toBe(false);
      expect(deleteResult.error).toContain("권한");
    });
  });
});
