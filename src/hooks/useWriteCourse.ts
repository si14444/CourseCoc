import { storage } from "@/lib/firebase";
import { compressImage } from "@/lib/imageCompression";
import { Location } from "@/types";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

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
  locations: [],
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
    []
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
    []
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
  setCourseData: React.Dispatch<React.SetStateAction<CourseData>>
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
          i === index ? { ...loc, [field]: value } : loc
        ),
      }));
    },
    [setCourseData]
  );

  const removeLocation = useCallback(
    (index: number) => {
      setCourseData((prev) => ({
        ...prev,
        locations: prev.locations.filter((_, i) => i !== index),
      }));
    },
    [setCourseData]
  );

  const handleAddressSelect = useCallback(
    (
      index: number,
      result: {
        x: string;
        y: string;
        road_address_name?: string;
        address_name: string;
      }
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
            : loc
        ),
      }));
    },
    [setCourseData]
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
    toggleTag,
    router,
  };
};

/**
 * 코스를 발행하는 함수
 */
export async function publishCourse(courseData: any, userId: string) {
  const { CourseService } = await import("@/services/CourseService");
  const { courseRepository } = await import("@/repositories/CourseRepository");

  const courseService = new CourseService(courseRepository);

  return await courseService.publishCourse({
    ...courseData,
    authorId: userId,
  });
}
