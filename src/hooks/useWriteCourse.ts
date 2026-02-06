import { storage } from "@/lib/firebase";
import { compressImage } from "@/lib/imageCompression";
import { Location } from "@/types";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getCourseById } from "@/lib/firebaseCourses";

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
}

const initialCourseData: CourseData = {
  title: "",
  description: "",
  tags: [],
  duration: "",
  budget: "",
  season: "",
  locations: [
    {
      id: "default-1",
      name: "",
      address: "",
      time: "",
      description: "",
      detail: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  content: "",
};

/**
 * 이미지 업로드 훅
 */
export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImageToStorage = useCallback(
    async (base64Image: string, path: string): Promise<string> => {
      if (!storage) {
        throw new Error("Storage가 초기화되지 않았습니다.");
      }

      try {
        const imageRef = ref(storage, path);
        await uploadString(imageRef, base64Image, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        throw new Error("이미지 업로드에 실패했습니다.");
      }
    },
    [],
  );

  const handleImageSelect = useCallback(
    async (file: File, onSuccess: (dataUrl: string) => void) => {
      try {
        setUploading(true);
        // 이미지 압축
        const compressedFile = await compressImage(file);

        // Base64로 변환
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onSuccess(event.target.result as string);
          }
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("이미지 처리 실패:", error);
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  return {
    uploading,
    uploadImageToStorage,
    handleImageSelect,
  };
};

/**
 * 장소 관리 훅
 */
export const useLocationManager = (
  courseData: CourseData,
  setCourseData: React.Dispatch<React.SetStateAction<CourseData>>,
) => {
  const addLocation = useCallback(() => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: "",
      address: "",
      time: "",
      description: "",
      detail: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCourseData((prev) => ({
      ...prev,
      locations: [...prev.locations, newLocation],
    }));
  }, [setCourseData]);

  const updateLocation = useCallback(
    (index: number, field: keyof Location, value: string) => {
      setCourseData((prev) => ({
        ...prev,
        locations: prev.locations.map((loc, i) =>
          i === index ? { ...loc, [field]: value } : loc,
        ),
      }));
    },
    [setCourseData],
  );

  const removeLocation = useCallback(
    (index: number) => {
      setCourseData((prev) => ({
        ...prev,
        locations: prev.locations.filter((_, i) => i !== index),
      }));
    },
    [setCourseData],
  );

  const handleAddressSelect = useCallback(
    (
      index: number,
      result: {
        x: string;
        y: string;
        road_address_name?: string;
        address_name: string;
      },
    ) => {
      const coords = {
        lat: parseFloat(result.y),
        lng: parseFloat(result.x),
      };

      setCourseData((prev) => ({
        ...prev,
        locations: prev.locations.map((loc, i) =>
          i === index
            ? {
                ...loc,
                address: result.road_address_name || result.address_name,
                position: coords,
              }
            : loc,
        ),
      }));
    },
    [setCourseData],
  );

  return {
    addLocation,
    updateLocation,
    removeLocation,
    handleAddressSelect,
  };
};

/**
 * 코스 작성 메인 훅
 */
export const useWriteCourse = (editId?: string | null) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>(initialCourseData);
  const [isPublishing, setIsPublishing] = useState(false);
  const [loading, setLoading] = useState(false);

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!editId) return;

      try {
        setLoading(true);
        const data = await getCourseById(editId);
        if (data) {
          setCourseData({
            title: data.title || "",
            description: data.description || "",
            tags: data.tags || [],
            duration: data.duration || "",
            budget: data.budget || "",
            season: data.season || "",
            heroImage: data.heroImage || data.imageUrl,
            locations: data.locations || [],
            content: data.content || "",
          });
        } else {
          console.error("코스 데이터를 찾을 수 없습니다.");
          alert("수정할 코스 데이터를 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("코스 데이터 로딩 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [editId]);

  const toggleTag = useCallback((tag: string) => {
    setCourseData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  return {
    step,
    setStep,
    courseData,
    setCourseData,
    isPublishing,
    setIsPublishing,
    loading,
    toggleTag,
    router,
  };
};

/**
 * 코스를 발행하는 함수
 */
export async function publishCourse(
  courseData: CourseData,
  userId: string,
  courseId?: string | null,
) {
  const { CourseService } = await import("@/services/CourseService");
  const { courseRepository } = await import("@/repositories/CourseRepository");

  const courseService = new CourseService(courseRepository);

  if (courseId) {
    const result = await courseService.updateCourse(
      courseId,
      courseData,
      userId,
    );
    if (result.success) {
      return { success: true, data: courseId };
    }
    return result;
  }

  return await courseService.publishCourse({
    ...courseData,
    authorId: userId,
  });
}
