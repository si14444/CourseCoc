import {
  Result,
  createErrorResult,
  createSuccessResult,
  handleError,
} from "@/lib/errors";
import { Course } from "@/lib/firebaseCourses";
import { ICourseRepository } from "@/repositories/CourseRepository";
import { Location } from "@/types";

export interface CourseData {
  title: string;
  description: string;
  tags: string[];
  duration: string;
  budget: string;
  season: string;
  heroImage?: string;
  locations: Location[];
  content: string;
  authorId: string;
}

/**
 * Course Service
 * 비즈니스 로직을 처리합니다.
 */
export class CourseService {
  constructor(private repository: ICourseRepository) {}

  /**
   * 새로운 코스를 발행합니다.
   */
  async publishCourse(courseData: CourseData): Promise<Result<string>> {
    try {
      // 유효성 검증
      const validationError = this.validateCourseData(courseData);
      if (validationError) {
        return createErrorResult(validationError);
      }

      // 코스 생성
      const course: Omit<Course, "id"> = {
        ...courseData,
        isDraft: false,
        likes: 0,
        views: 0,
        bookmarks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const courseId = await this.repository.create(course);
      return createSuccessResult(courseId);
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * 코스를 조회합니다 (조회수 증가).
   */
  async getCourse(id: string): Promise<Result<Course>> {
    try {
      const course = await this.repository.findById(id);

      if (!course) {
        return createErrorResult("코스를 찾을 수 없습니다.");
      }

      // 조회수 증가
      await this.repository.update(id, {
        views: course.views + 1,
      });

      return createSuccessResult({
        ...course,
        views: course.views + 1,
      });
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * 모든 발행된 코스를 조회합니다.
   */
  async getPublishedCourses(): Promise<Result<Course[]>> {
    try {
      const courses = await this.repository.findAll();
      return createSuccessResult(courses);
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * 사용자의 코스를 조회합니다.
   */
  async getUserCourses(userId: string): Promise<Result<Course[]>> {
    try {
      const courses = await this.repository.findByUserId(userId);
      return createSuccessResult(courses);
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * 태그로 코스를 검색합니다.
   */
  async searchByTag(tag: string): Promise<Result<Course[]>> {
    try {
      const courses = await this.repository.findByTag(tag);
      return createSuccessResult(courses);
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * 코스를 업데이트합니다.
   */
  async updateCourse(
    id: string,
    data: Partial<CourseData>,
    userId: string
  ): Promise<Result<void>> {
    try {
      // 권한 확인
      const course = await this.repository.findById(id);
      if (!course) {
        return createErrorResult("코스를 찾을 수 없습니다.");
      }

      if (course.authorId !== userId) {
        return createErrorResult("수정 권한이 없습니다.");
      }

      await this.repository.update(id, data);
      return createSuccessResult(undefined);
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * 코스를 삭제합니다.
   */
  async deleteCourse(id: string, userId: string): Promise<Result<void>> {
    try {
      // 권한 확인
      const course = await this.repository.findById(id);
      if (!course) {
        return createErrorResult("코스를 찾을 수 없습니다.");
      }

      if (course.authorId !== userId) {
        return createErrorResult("삭제 권한이 없습니다.");
      }

      await this.repository.delete(id);
      return createSuccessResult(undefined);
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * 좋아요를 토글합니다.
   */
  async toggleLike(id: string, isLiked: boolean): Promise<Result<void>> {
    try {
      const course = await this.repository.findById(id);
      if (!course) {
        return createErrorResult("코스를 찾을 수 없습니다.");
      }

      const newLikes = isLiked ? course.likes - 1 : course.likes + 1;
      await this.repository.update(id, { likes: newLikes });

      return createSuccessResult(undefined);
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * 북마크를 토글합니다.
   */
  async toggleBookmark(
    id: string,
    isBookmarked: boolean
  ): Promise<Result<void>> {
    try {
      const course = await this.repository.findById(id);
      if (!course) {
        return createErrorResult("코스를 찾을 수 없습니다.");
      }

      const newBookmarks = isBookmarked
        ? course.bookmarks - 1
        : course.bookmarks + 1;
      await this.repository.update(id, { bookmarks: newBookmarks });

      return createSuccessResult(undefined);
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * 코스 데이터 유효성 검증
   */
  private validateCourseData(data: CourseData): string | null {
    if (!data.title?.trim()) {
      return "제목을 입력해주세요.";
    }

    if (data.title.length > 200) {
      return "제목은 200자 이하로 입력해주세요.";
    }

    if (!data.description?.trim()) {
      return "설명을 입력해주세요.";
    }

    if (!data.locations || data.locations.length === 0) {
      return "최소 1개 이상의 장소를 추가해주세요.";
    }

    if (!data.tags || data.tags.length === 0) {
      return "최소 1개의 태그를 선택해주세요.";
    }

    if (!data.content?.trim()) {
      return "상세 내용을 작성해주세요.";
    }

    return null;
  }
}
