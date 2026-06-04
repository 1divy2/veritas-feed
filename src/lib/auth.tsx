import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  User
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export type Role = "analyst" | "researcher" | "administrator";

// We'll map the Firebase User to our session type.
export type Session = { 
  email: string; 
  role: Role; 
  uid: string;
} | null;

type Ctx = {
  session: Session;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({} as Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user && user.email) {
        setSession({
          email: user.email,
          role: "analyst", // Default role for now
          uid: user.uid,
        });
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pw: string) => {
    await signInWithEmailAndPassword(auth, email, pw);
  };

  const signUp = async (email: string, pw: string) => {
    await createUserWithEmailAndPassword(auth, email, pw);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthCtx.Provider value={{ session, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
