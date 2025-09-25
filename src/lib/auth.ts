import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  FirebaseError,
} from 'firebase/auth';
import { auth } from './firebase';

export interface SignupData {
  email: string;
  password: string;
  nickname: string;
  birthYear?: string;
  gender?: string;
}

export const signUp = async (userData: SignupData) => {
  try {
    const { email, password } = userData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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