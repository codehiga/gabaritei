import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { auth } from "../libs/firebase";

export const AuthContext = createContext({});

export const AuthProvider = ({children} : PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user
      }
    })
  }, [user])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    

  return(
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}