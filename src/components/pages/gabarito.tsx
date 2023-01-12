import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "react-spinner-material";
import { AuthContext } from "../../contexts/AuthContext";
import { Gabarito } from "../../interfaces/gabarito";
import { FirebaseGabaritoRepository } from "../../services/api";
import { LocalStorage } from "../../services/local-storage";

export const GabaritoPage = () => {
  const repository = new FirebaseGabaritoRepository();
  const local = new LocalStorage();
  const [ gabaritoData, setGabaritoData ] = useState<Gabarito | null>(null);
  const [ startedTime, setStartedTime ] = useState<boolean>(false);
  const [ time, setTime ] = useState("00:00:00");
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [ loading, setLoading ] = useState<boolean>(false); 

  let intervalId;

  function timeStart(started?: number) {
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    intervalId = setInterval(() => {
      let now = new Date().getTime();
      let elapsedTime = now - started;
      seconds = Math.floor(elapsedTime / 1000) % 60;
      minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
      hours = Math.floor(elapsedTime / (1000 * 60 * 60)) % 24;
      setTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);
  }

  async function handleStartTest() {
    await repository.atualizaGabarito(id, user.email, {
      iniciado : true,
      timestampInicioProva : new Date().getTime(),
    })
    timeStart(new Date().getTime());
    setStartedTime(true);
    local.salva("prova-iniciada", {
      ...gabaritoData,
      iniciadoEm: new Date(),
      timestampInicioProva : new Date().getTime(),
      iniciado: true,
    })
  }

  async function handleFinish() {
    setLoading(true);
    let testData = local.resgata("prova-iniciada");
    testData = {
      ...testData,
      tempo: time,
      finalizado: true
    }
    await repository.atualizaGabarito(id, user.email, testData)
    setStartedTime(false);
    clearInterval(intervalId);
    local.deleta("prova-iniciada");
    setSelectedOptions([])
    getGabaritoData();
    setLoading(false);
  }

  async function getGabaritoData() {
    setLoading(true)
    const data = await repository.resgataGabaritoPorId(id, user.email);
    if(local.resgata("prova-iniciada").iniciado == true && local.resgata("prova-iniciada").finalizado == false) {
      timeStart(local.resgata("prova-iniciada").timestampInicioProva);
      setStartedTime(true);
    }
    setGabaritoData(data);
    setSelectedOptions(data.respostas)
    local.salva("prova-iniciada", data)
    setLoading(false)
  }

  const handleOptionChange = (questionNumber: number, option: string) => {
    const existingOption = selectedOptions.find(
      (selectedOption) => selectedOption.questao === questionNumber
    );
    if (existingOption) {
      setSelectedOptions(
        selectedOptions.map((selectedOption) =>
          selectedOption.questao === questionNumber
            ? { questao: questionNumber, opcao: option }
            : selectedOption
        )
      );
    } else {
      setSelectedOptions([...selectedOptions, { questao: questionNumber, opcao: option }]);
    }
  };

  useEffect(() => {
    local.atualizar("prova-iniciada", {
      respostas : selectedOptions
    });
}, [selectedOptions])

  useEffect(() => {
    getGabaritoData();
  }, [id])

  if(loading || !gabaritoData) {
    return <div className="fixed w-full h-full flex justify-center items-center">
      <Spinner size={120} />
    </div>
  }

  return(
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center py-4 px-4">
        <div className="fixed top-0 h-20 w-full max-w-7xl mb-4 flex items-center justify-between px-4 backdrop-blur-xl">
          <div>
            <a href="/"><button className="uppercase px-4 py-2 bg-blue-500 rounded-md text-white">Voltar</button></a>
          </div>
          <div>
            <h1>Candidato: {user?.name}</h1>
            <h1>Prova: {gabaritoData.prova}</h1>
          </div>
          {
            gabaritoData?.finalizado === false &&
            <div>
              {time}
            </div>
          }
        </div>
        <div className="w-full flex justify-center mt-20">
          {
            gabaritoData?.finalizado === false ? 
              <div className="w-full max-w-[512px]">
                { startedTime ? 
                  <>
                    <AnswerSheet selectedOptions={selectedOptions} handleOptionChange={handleOptionChange} />
                    <div className="my-4 flex w-full justify-end">
                      <button onClick={handleFinish} className="p-2 px-4 bg-blue-500 rounded-md text-white">Finalizar prova!</button>
                    </div>
                  </>
                  :
                  <button className="my-10 w-full bg-blue-500 py-2 rounded-md text-white" onClick={handleStartTest}>Iniciar</button>
                }
              </div>
              :
              <div className="w-full flex flex-col gap-4">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-gray-200 text-gray-800">
                      <th className="px-4 py-2 uppercase">prova</th>
                      <th className="px-4 py-2 uppercase">data</th>
                      <th className="px-4 py-2 uppercase">tempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-gray-700">
                      <td className="border px-4 py-2">{gabaritoData?.prova}</td>
                      <td className="border px-4 py-2">{gabaritoData?.criadoEm}</td>
                      <td className="border px-4 py-2">{gabaritoData?.tempo}</td>
                    </tr>
                  </tbody>
                </table>

                <AnswerSheet finalizado={gabaritoData?.finalizado} selectedOptions={selectedOptions} handleOptionChange={handleOptionChange} />
              </div>
          }
        </div>
      </div>
    </div>
  )
}

type AnswerSheetProps = {
  handleOptionChange: (questionNumber: number, option: string) => void;
  selectedOptions : any[];
  finalizado?: boolean;
}

const AnswerSheet = ({handleOptionChange, selectedOptions, finalizado} : AnswerSheetProps) => {
  const [questions, setQuestions] = useState<{ number: number; opts: {option: string, marked: boolean}[] }[]>([]);
  
  useEffect(() => {
    let temp : { number: number; opts: {option: string, marked: boolean}[] }[] = [];
    for(let i = 0; i < 90; i++) {
      temp.push({
        number: i + 1,
        opts : [
          {
            option : "A",
            marked: false,
          },
          {
            option : "B",
            marked: false,
          },
          {
            option : "C",
            marked: false,
          },
          {
            option : "D",
            marked: false,
          },
          {
            option : "E",
            marked: false,
          }
        ]
      })
    }
    setQuestions(temp)
  }, [])

  function isMarked(question: number, option: string) {
    let storedQuestion = selectedOptions;
    let marked = false;
    if (!storedQuestion) {
      return false;
    }
    selectedOptions.map((selectedOption) => {
      if(selectedOption.questao == question && selectedOption.opcao == option) {
        marked = true;
      }
    })
    return marked;
  }

  return (
    <table className="border-collapse w-full">
      <tbody className="w-full">
        {questions.map((question) => {
          return <tr key={question.number}>
          <td className="border px-4 py-2">{question.number}</td>
          <td className="border px-4 py-2">
            <div className="grid grid-cols-5 gap-6 items-center justify-around ">
              {question.opts.map((opt, i) => {
                return(
                  <div key={i}>
                    <input 
                      defaultChecked={isMarked(question.number, opt.option)} 
                      onClick={() => handleOptionChange(question.number, opt.option)} 
                      type="radio" 
                      className="form-radio" 
                      id={`question-${question.number}-${opt.option}`} 
                      name={`question-${question.number}`} 
                      value={opt.option}
                      disabled={finalizado}
                    />
                    <label className="ml-2" htmlFor={`question-${question.number}-${opt.option}`}>{isMarked(question.number, opt.option) ? <b>{opt.option}</b> : opt.option}</label>
                  </div>
                )
              })}
            </div>
          </td>
        </tr>
        })}
    </tbody>
  </table>
)}