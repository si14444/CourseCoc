import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  FirebaseError,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase';

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
    const { email, password, nickname, birthYear, gender } = userData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

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

    await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);

    return { success: true, user: userCredential.user };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    return { success: false, error: firebaseError.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    return { success: false, error: firebaseError.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    return { success: false, error: firebaseError.message };
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, profile: userDoc.data() as UserProfile };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error) {
    const firebaseError = error as FirebaseError;
    return { success: false, error: firebaseError.message };
  }
};

export const uploadProfileImage = async (file: File, uid: string) => {
  try {
    const storageRef = ref(storage, `profile-images/${uid}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update user profile in Firestore
    await setDoc(
      doc(db, 'users', uid),
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
    const firebaseError = error as FirebaseError;
    return { success: false, error: firebaseError.message };
  }
};

export const updateUserNickname = async (uid: string, nickname: string) => {
  try {
    // Update user profile in Firestore
    await setDoc(
      doc(db, 'users', uid),
      { nickname },
      { merge: true }
    );

    // Update Firebase Auth profile
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: nickname,
      });
    }

    return { success: true };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    return { success: false, error: firebaseError.message };
  }
};

export const deleteUserAccount = async (uid: string) => {
  try {
    if (!auth.currentUser) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // Delete user profile from Firestore
    await setDoc(doc(db, 'users', uid), {}, { merge: true });

    // Delete user account from Firebase Auth
    await auth.currentUser.delete();

    return { success: true };
  } catch (error) {
    const firebaseError = error as FirebaseError;
    if (firebaseError.code === 'auth/requires-recent-login') {
      return { success: false, error: '보안을 위해 다시 로그인한 후 시도해주세요.' };
    }
    return { success: false, error: firebaseError.message };
  }
};