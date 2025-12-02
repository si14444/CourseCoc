/**
 * 공통 에러 처리 유틸리티
 */

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 애플리케이션 커스텀 에러 클래스
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Firebase Auth 에러 메시지 매핑
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
  "auth/invalid-email": "유효하지 않은 이메일 형식입니다.",
  "auth/weak-password": "비밀번호는 6자리 이상이어야 합니다.",
  "auth/operation-not-allowed": "이메일 회원가입이 비활성화되어 있습니다.",
  "auth/network-request-failed": "네트워크 연결을 확인해주세요.",
  "auth/user-not-found": "등록되지 않은 이메일입니다.",
  "auth/wrong-password": "비밀번호가 틀렸습니다.",
  "auth/user-disabled": "비활성화된 계정입니다.",
  "auth/too-many-requests":
    "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.",
  "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "auth/requires-recent-login": "보안을 위해 다시 로그인한 후 시도해주세요.",
};

/**
 * Firebase Auth 에러 코드를 한글 메시지로 변환
 */
export const getAuthErrorMessage = (code: string): string => {
  return AUTH_ERROR_MESSAGES[code] || "알 수 없는 오류가 발생했습니다.";
};

/**
 * 에러를 Result 타입으로 변환
 */
export const handleError = <T = never>(error: unknown): Result<T> => {
  if (error instanceof AppError) {
    return { success: false, error: error.message };
  }

  if (error instanceof Error) {
    // Firebase 에러인 경우
    if ("code" in error) {
      const authError = error as { code: string; message: string };
      const message = getAuthErrorMessage(authError.code);
      return { success: false, error: message };
    }

    return { success: false, error: error.message };
  }

  return { success: false, error: "알 수 없는 오류가 발생했습니다." };
};

/**
 * 성공 Result 생성
 */
export const createSuccessResult = <T>(data: T): Result<T> => {
  return { success: true, data };
};

/**
 * 실패 Result 생성
 */
export const createErrorResult = <T = never>(error: string): Result<T> => {
  return { success: false, error };
};

/**
 * 개발 환경에서만 로그 출력
 */
export const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

/**
 * 개발 환경에서만 에러 로그 출력
 */
export const devError = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.error(...args);
  }
};
