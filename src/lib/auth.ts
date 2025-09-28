import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "./firebase";

export interface SignupData {
  email: string;
  password: string;
  nickname: string;
  birthYear?: string;
  gender?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  birthYear?: string;
  gender?: string;
  createdAt: Date;
}

export const signUp = async (userData: SignupData) => {
  try {
    if (!auth || !db) {
      return { success: false, error: 'Firebase가 초기화되지 않았습니다.' };
    }

    const { email, password, nickname, birthYear, gender } = userData;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update Firebase Auth profile
    await updateProfile(userCredential.user, {
      displayName: nickname,
    });

    // Save user profile to Firestore
    const userProfile: UserProfile = {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      nickname,
      birthYear,
      gender,
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userProfile);

    return { success: true, user: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;

    // Firebase 에러 코드를 한글 메시지로 변환
    let errorMessage = '회원가입에 실패했습니다.';

    switch (authError.code) {
      case 'auth/email-already-in-use':
        errorMessage = '이미 사용 중인 이메일입니다.';
        break;
      case 'auth/invalid-email':
        errorMessage = '유효하지 않은 이메일 형식입니다.';
        break;
      case 'auth/weak-password':
        errorMessage = '비밀번호는 6자리 이상이어야 합니다.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = '이메일 회원가입이 비활성화되어 있습니다.';
        break;
      case 'auth/network-request-failed':
        errorMessage = '네트워크 연결을 확인해주세요.';
        break;
      default:
        errorMessage = '회원가입에 실패했습니다. 다시 시도해주세요.';
    }

    return { success: false, error: errorMessage };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    if (!auth) {
      return { success: false, error: 'Firebase Auth가 초기화되지 않았습니다.' };
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;

    // Firebase 에러 코드를 한글 메시지로 변환
    let errorMessage = '로그인에 실패했습니다.';

    switch (authError.code) {
      case 'auth/user-not-found':
        errorMessage = '등록되지 않은 이메일입니다.';
        break;
      case 'auth/wrong-password':
        errorMessage = '비밀번호가 틀렸습니다.';
        break;
      case 'auth/invalid-email':
        errorMessage = '유효하지 않은 이메일 형식입니다.';
        break;
      case 'auth/user-disabled':
        errorMessage = '비활성화된 계정입니다.';
        break;
      case 'auth/too-many-requests':
        errorMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
        break;
      case 'auth/network-request-failed':
        errorMessage = '네트워크 연결을 확인해주세요.';
        break;
      case 'auth/invalid-credential':
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
        break;
      default:
        errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.';
    }

    return { success: false, error: errorMessage };
  }
};

export const logOut = async () => {
  try {
    if (!auth) {
      return { success: false, error: 'Firebase Auth가 초기화되지 않았습니다.' };
    }

    await signOut(auth);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: authError.message || 'An error occurred' };
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' };
    }

    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { success: true, profile: userDoc.data() as UserProfile };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: authError.message || 'An error occurred' };
  }
};

export const uploadProfileImage = async (file: File, uid: string) => {
  try {
    if (!storage || !db || !auth) {
      return { success: false, error: 'Firebase가 초기화되지 않았습니다.' };
    }

    const storageRef = ref(storage, `profile-images/${uid}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update user profile in Firestore
    await setDoc(
      doc(db, "users", uid),
      { profileImageUrl: downloadURL },
      { merge: true }
    );

    // Update Firebase Auth profile
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL,
      });
    }

    return { success: true, url: downloadURL };
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: authError.message || 'An error occurred' };
  }
};

export const updateUserNickname = async (uid: string, nickname: string) => {
  try {
    if (!db || !auth) {
      return { success: false, error: 'Firebase가 초기화되지 않았습니다.' };
    }

    // Update user profile in Firestore
    await setDoc(doc(db, "users", uid), { nickname }, { merge: true });

    // Update Firebase Auth profile
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: nickname,
      });
    }

    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return { success: false, error: authError.message || 'An error occurred' };
  }
};

export const deleteUserAccount = async (uid: string) => {
  try {
    if (!auth || !db) {
      return { success: false, error: 'Firebase가 초기화되지 않았습니다.' };
    }

    if (!auth.currentUser) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    // Delete user profile from Firestore
    await setDoc(doc(db, "users", uid), {}, { merge: true });

    // Delete user account from Firebase Auth
    await auth.currentUser.delete();

    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    if (authError.code === "auth/requires-recent-login") {
      return {
        success: false,
        error: "보안을 위해 다시 로그인한 후 시도해주세요.",
      };
    }
    return { success: false, error: authError.message || 'An error occurred' };
  }
};
