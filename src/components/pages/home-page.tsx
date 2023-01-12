import { useContext, useEffect, useState } from "react";
import Spinner from "react-spinner-material";
import { AuthContext } from "../../contexts/AuthContext";
import { useLocation } from "../../hooks/useLocation";
import { Gabarito } from "../../interfaces/gabarito";
import { FirebaseGabaritoRepository } from "../../services/api";

export const HomePage = () => {
  const repository = new FirebaseGabaritoRepository();
  const [ gabaritos, setGabaritos ] = useState<Gabarito[]>([]);
  const [ gabaritoName, setGabaritoName ] = useState<string>("");
  const [ modalNewGabarito, setModalNewGabarito ] = useState<boolean>(false);
  const [ loading, setLoading ] = useState<boolean>(false); 
  const { signOut, user } = useContext(AuthContext);
  const { go } = useLocation();

  async function handleSignOut() {
    await signOut();
    go("/login");
  }

  async function handleDeleteGabarito(id: string) {
    await repository.deletarGabarito(id, user.email);
    await getGabaritos()
  }
  
  async function getGabaritos() {
    setLoading(true);
    const response = await repository.resgataGabaritos(user.email);
    const sortedGabaritos = response.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
    setGabaritos(sortedGabaritos);
    setLoading(false);
  }

  async function handleNewGabarito() {
    setModalNewGabarito(true);
  }

  async function handleCreateNewGabarito() {
    if(!gabaritoName) return;
    let gabarito : Gabarito = {
      id: '',
      criadoEm : new Date().getTime(),
      finalizado : false,
      iniciado: false,
      prova: gabaritoName,
      respostas : [],
      tempo: 0
    }
    await repository.salva(gabarito, user.email);
    setModalNewGabarito(false);
    getGabaritos();
    setGabaritoName("");
  }

  useEffect(() => {
    getGabaritos()
  }, [])

  if(loading) {
    return <div className="fixed w-full h-full flex justify-center items-center">
      <Spinner size={120} />
    </div>
  }
  
  return(
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto flex flex-col py-4 px-4 gap-4">
        <div className={`${modalNewGabarito ? 'right-0' : '-right-full'} w-96 backdrop-blur-3xl fixed bottom-0 h-full transition-all p-4 shadow-lg`}>
          <form onSubmit={e => {
            e.preventDefault()
            handleCreateNewGabarito()
          }} className="w-full h-full flex flex-col gap-2 relative">
            <div>
              <h2 className="text-3xl font-semibold">Novo gabarito</h2>
            </div>

            <label>
              <p className="font-semibold">Prova:</p>
              <input value={gabaritoName} onChange={e => setGabaritoName(e.target.value)} className="p-2 w-full rounded-sm border-2" type="text" />
            </label>

            <div className="w-full flex justify-end absolute top-0 right-0">
              <div onClick={() => setModalNewGabarito(false)} className="uppercase px-4 py-2 bg-red-500 rounded-md cursor-pointer">✖</div>
            </div>

            <div className="w-full flex justify-end absolute bottom-0 right-0">
              <button className="uppercase px-4 py-2 bg-blue-500 rounded-md text-white">Criar gabarito</button>
            </div>
          </form>
        </div>
        <div>
          <div className="flex items-center">
            <div className="w-full flex items-center gap-2">
              <h1>{user.name}</h1>
            </div>
            <div className="w-full flex justify-end my-4">
                <button className="uppercase px-4 py-2 bg-red-500 rounded-md text-white" onClick={handleSignOut}>sair</button>
            </div>
          </div>
          <div className="w-full flex justify-start my-4">
            <button className="uppercase px-4 py-2 bg-blue-500 rounded-md text-white" onClick={handleNewGabarito}>Novo gabarito!</button>
          </div>
          <hr className="my-4" />
          <div className="grid grid-cols-3 gap-1">
            {gabaritos.length > 0 ? gabaritos.map((gabarito, i) => (
              <div key={i} className="w-full border">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">{gabarito.prova}</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-${gabarito.finalizado ? 'green' : 'red'}-500`}>
                      {gabarito.finalizado ? 'Finalizado' : 'Não iniciado'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-gray-700">Data: {new Date(gabarito?.criadoEm).toLocaleString()}</div>
                    <div className="text-gray-700">Tempo: {gabarito.tempo}</div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <a href={`/gabarito/${gabarito.id}`}>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Ver</button>
                    </a>
                    <button onClick={() => handleDeleteGabarito(gabarito.id)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Deletar</button>
                  </div>
                </div>
              </div>
            ))
            :
            <h1 className="my-4">Ainda não possui gabaritos :(</h1>
          }
          </div>
        </div>
      </div>
    </div>
  )
}