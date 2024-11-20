import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      signInWithGoogle: async () => {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          set({
            user: {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
            },
          });
          toast.success('Successfully signed in with Google!');
        } catch (error) {
          toast.error('Failed to sign in with Google');
          console.error(error);
        }
      },
      signUp: async (email: string, password: string, displayName: string) => {
        try {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(result.user, { displayName });
          set({
            user: {
              uid: result.user.uid,
              email: result.user.email,
              displayName,
              photoURL: null,
            },
          });
          toast.success('Account created successfully!');
        } catch (error) {
          toast.error('Failed to create account');
          console.error(error);
        }
      },
      signIn: async (email: string, password: string) => {
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          set({
            user: {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
            },
          });
          toast.success('Successfully signed in!');
        } catch (error) {
          toast.error('Invalid email or password');
          console.error(error);
        }
      },
      signOut: async () => {
        try {
          await firebaseSignOut(auth);
          set({ user: null });
          toast.success('Successfully signed out!');
        } catch (error) {
          toast.error('Failed to sign out');
          console.error(error);
        }
      },
      updateUserProfile: async (displayName: string, photoURL?: string) => {
        try {
          if (!auth.currentUser) throw new Error('No user logged in');
          await updateProfile(auth.currentUser, { displayName, photoURL });
          set((state) => ({
            user: state.user ? {
              ...state.user,
              displayName,
              photoURL: photoURL || state.user.photoURL,
            } : null,
          }));
          toast.success('Profile updated successfully!');
        } catch (error) {
          toast.error('Failed to update profile');
          console.error(error);
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);