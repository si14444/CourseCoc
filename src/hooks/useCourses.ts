import { Course } from "@/lib/firebaseCourses";
import { courseRepository } from "@/repositories/CourseRepository";
import { CourseService } from "@/services/CourseService";
import { useCallback, useEffect, useState } from "react";

const courseService = new CourseService(courseRepository);

/**
 * 코스 목록을 관리하는 훅
 */
export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await courseService.getPublishedCourses();

      if (result.success && result.data) {
        setCourses(result.data);
      } else {
        setError(result.error || "코스를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
  };
};

/**
 * 단일 코스를 관리하는 훅
 */
export const useCourse = (id: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await courseService.getCourse(id);

      if (result.success && result.data) {
        setCourse(result.data);
      } else {
        setError(result.error || "코스를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return {
    course,
    loading,
    error,
    refetch: fetchCourse,
  };
};

/**
 * 사용자의 코스를 관리하는 훅
 */
export const useUserCourses = (userId: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserCourses = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await courseService.getUserCourses(userId);

      if (result.success && result.data) {
        setCourses(result.data);
      } else {
        setError(result.error || "코스를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserCourses();
  }, [fetchUserCourses]);

  const deleteCourse = useCallback(
    async (courseId: string) => {
      const result = await courseService.deleteCourse(courseId, userId);

      if (result.success) {
        // 로컬 상태 업데이트
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
      }

      return result;
    },
    [userId]
  );

  return {
    courses,
    loading,
    error,
    refetch: fetchUserCourses,
    deleteCourse,
  };
};
