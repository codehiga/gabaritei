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
    <div className="w-full h-screen">
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-full max-w-[320px] h-full max-h-[400px] flex flex-col justify-center border px-4">
          <div className="flex-1 flex flex-col justify-center items-center my-4 gap-4">
            <h1 className="text-4xl font-semibold italic">Gabaritei</h1>
            <p>O objetivo da aplicação é fornecer gabaritos de vestibulares e permite monitorar o tempo gasto para completar a prova, facilitando a análise de desempenho.</p>
          </div>
          <hr />
          <div className="flex flex-col flex-[3] gap-2 justify-center items-center">
            <button onClick={handleSignInWithGoogle} className="w-full py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition-all">
              Fazer login com google!
            </button>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <b className="font-semibold cursor-pointer hover:underline transition-all"><a href="https://github.com/codehiga/gabaritei">github!</a></b>
          </div>
        </div>
      </div>
    </div>
  )
}