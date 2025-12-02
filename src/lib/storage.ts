import { debounce } from "lodash";

/**
 * LocalStorage 관리 싱글톤 클래스
 * Debounce를 사용하여 성능 최적화
 */
export class LocalStorageManager {
  private static instance: LocalStorageManager;

  private constructor() {}

  static getInstance(): LocalStorageManager {
    if (!this.instance) {
      this.instance = new LocalStorageManager();
    }
    return this.instance;
  }

  /**
   * Debounced save - 500ms 후에 저장
   */
  saveDebounced = debounce((key: string, value: any) => {
    this.save(key, value);
  }, 500);

  /**
   * 즉시 저장
   */
  save<T>(key: string, value: T): boolean {
    if (typeof window === "undefined") return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("LocalStorage 저장 실패:", error);
      return false;
    }
  }

  /**
   * 데이터 읽기
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === "undefined") return defaultValue || null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error("LocalStorage 읽기 실패:", error);
      return defaultValue || null;
    }
  }

  /**
   * 데이터 삭제
   */
  remove(key: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("LocalStorage 삭제 실패:", error);
      return false;
    }
  }

  /**
   * 모든 데이터 삭제
   */
  clear(): boolean {
    if (typeof window === "undefined") return false;

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("LocalStorage 초기화 실패:", error);
      return false;
    }
  }
}

// 싱글톤 인스턴스 export
export const storage = LocalStorageManager.getInstance();
