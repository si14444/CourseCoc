import imageCompression from "browser-image-compression";

export interface CompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

/**
 * 이미지 파일을 압축합니다.
 *
 * @param file - 압축할 이미지 파일
 * @param options - 압축 옵션
 * @returns 압축된 이미지 파일
 */
export const compressImage = async (
  file: File,
  options: CompressOptions = {}
): Promise<File> => {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);

    if (process.env.NODE_ENV === "development") {
      console.log(
        "Original file size:",
        (file.size / 1024 / 1024).toFixed(2),
        "MB"
      );
      console.log(
        "Compressed file size:",
        (compressedFile.size / 1024 / 1024).toFixed(2),
        "MB"
      );
    }

    return compressedFile;
  } catch (error) {
    console.error("이미지 압축 실패:", error);
    return file; // 압축 실패 시 원본 반환
  }
};

/**
 * 여러 이미지 파일을 동시에 압축합니다.
 *
 * @param files - 압축할 이미지 파일 배열
 * @param options - 압축 옵션
 * @returns 압축된 이미지 파일 배열
 */
export const compressImages = async (
  files: File[],
  options: CompressOptions = {}
): Promise<File[]> => {
  return Promise.all(files.map((file) => compressImage(file, options)));
};
