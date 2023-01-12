import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { User } from "../interfaces/usuario";
import { auth } from "../libs/firebase";

export const AuthContext = createContext({} as AuthContextType);

type AuthContextType = {
  signInWithGoogle(): Promise<void>;
  user: User | null;
  loggedIn: boolean;
  signOut(): Promise<void>;
}

export const AuthProvider = ({children} : PropsWithChildren) => {
  const [ user, setUser ] = useState<User | null>(null);
  const [ loggedIn, setLoggedIn ]= useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged(authData => {
      if (authData) {
        const { displayName, photoURL, uid, email } = authData;
        setUser({
          id : uid,
          name: displayName,
          avatar: photoURL,
          email: email
        });
        setLoggedIn(true);
      } else {
        setUser(null);
        setLoggedIn(false);
      }
    })
  }, [])

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if(credential) {
      const user = result.user;
      if(user) {
        setUser({
          id: user.uid,
          name: user.displayName,
          avatar: user.photoURL,
          email: user.email
        });
        setLoggedIn(true);
      }
    }
  }

  async function signOut() {
    await auth.signOut();
    setUser(null);
    setLoggedIn(false);
  }

  return(
    <AuthContext.Provider value={{signInWithGoogle, user, loggedIn, signOut}}>
      {children}
    </AuthContext.Provider>
  )
}