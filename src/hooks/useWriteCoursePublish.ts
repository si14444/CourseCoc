import { Result } from "@/lib/errors";
import { courseRepository } from "@/repositories/CourseRepository";
import { CourseService } from "@/services/CourseService";

const courseService = new CourseService(courseRepository);

export interface CourseFormData {
  title: string;
  description: string;
  tags: string[];
  duration: string;
  budget: string;
  season: string;
  heroImage?: string;
  locations: any[];
  content: string;
}

/**
 * 코스를 발행합니다
 */
export async function publishCourse(
  courseData: CourseFormData,
  userId: string
): Promise<Result<string>> {
  return await courseService.publishCourse({
    ...courseData,
    authorId: userId,
  });
}
