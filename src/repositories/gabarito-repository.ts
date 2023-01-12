import { Gabarito } from "../interfaces/gabarito";

export interface GabaritoRepository {
  salva(data: Gabarito): Promise<void>;
}