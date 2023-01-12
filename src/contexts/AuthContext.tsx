import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { User } from "../interfaces/usuario";
import { auth } from "../libs/firebase";
import { LocalStorage } from "../services/local-storage";

export const AuthContext = createContext({} as AuthContextType);

type AuthContextType = {
  signInWithGoogle(): Promise<void>;
  user: User | null;
  loggedIn: boolean;
  signOut(): Promise<void>;
}

export const AuthProvider = ({children} : PropsWithChildren) => {
  const local = new LocalStorage();
  const [ user, setUser ] = useState<User | null>(null);
  const [ loggedIn ] = useState<boolean>(Boolean(local.resgata("usuario")));

  useEffect(() => {
    onAuthStateChanged(auth, authData => {
      if (authData) {
        const { displayName, photoURL, uid, email } = authData;
        let userData = {
          id : uid,
          name: displayName,
          avatar: photoURL,
          email: email
        }
        setUser(userData);
        local.salva("usuario", userData);
      } else {
        setUser(null);
        local.deleta("usuario");
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
        let userData = {
          id: user.uid,
          name: user.displayName,
          avatar: user.photoURL,
          email: user.email
        }
        setUser(userData);
        local.salva("usuario", userData);
      }
    }
  }

  async function signOut() {
    await auth.signOut();
    setUser(null);
    local.deleta("usuario");
  }

  return(
    <AuthContext.Provider value={{signInWithGoogle, user, loggedIn, signOut}}>
      {children}
    </AuthContext.Provider>
  )
}