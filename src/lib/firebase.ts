import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 환경 변수 검증
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 환경 변수가 모두 설정되어 있는지 확인
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn(`Missing Firebase environment variables: ${missingVars.join(', ')}`);
}

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || '',
  authDomain: requiredEnvVars.authDomain || '',
  projectId: requiredEnvVars.projectId || '',
  storageBucket: requiredEnvVars.storageBucket || '',
  messagingSenderId: requiredEnvVars.messagingSenderId || '',
  appId: requiredEnvVars.appId || '',
};

// Firebase 초기화 변수
let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;

try {
  // Firebase 앱이 이미 초기화되어 있는지 확인하고, 없으면 초기화
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  // 클라이언트 사이드에서만 auth와 storage 초기화
  if (typeof window !== 'undefined') {
    auth = getAuth(app);
    storage = getStorage(app);
  }

  // Firestore는 서버/클라이언트 모두에서 사용 가능
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { auth, db, storage };