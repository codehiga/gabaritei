import { Gabarito } from "../interfaces/gabarito";

export interface GabaritoRepository {
  salva(data: Gabarito, email: string): Promise<void>;
  resgataGabaritoPorId(id: string, email: string): Promise<Gabarito>;
  atualizaGabarito(id: string, email: string, data: any): Promise<void>;
  resgataGabaritos(email: string): Promise<Gabarito[]>;
}