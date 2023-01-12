import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useLocation } from "../../hooks/useLocation";

export const HomePage = () => {
  const { signOut } = useContext(AuthContext);
  const { go } = useLocation();

  async function handleSignOut() {
    await signOut();
    go("/login");
  }
  
  return(
    <div>
      <div>Página inicial</div>
      <button onClick={handleSignOut}>Fazer logout!</button>
    </div>
  )
}