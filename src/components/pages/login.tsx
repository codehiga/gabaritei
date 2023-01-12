import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useLocation } from "../../hooks/useLocation";

export const Login = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const { go } = useLocation();

  async function handleSignInWithGoogle() {
    await signInWithGoogle();
    go("/");
  }

  return(
    <div>
      <div>
        <button onClick={handleSignInWithGoogle}>Fazer login!</button>
      </div>
    </div>
  )
}