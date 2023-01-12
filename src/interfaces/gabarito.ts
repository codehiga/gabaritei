import { Resposta } from "./resposta";

export interface Gabarito {
  id: string;
  iniciado: boolean;
  finalizado: boolean;
  prova: string;
  tempo: number;
  respostas : Resposta[];
  criadoEm: Date;
}