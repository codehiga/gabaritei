import { Gabarito } from "../interfaces/gabarito";

export interface GabaritoRepository {
  salvar(data: Gabarito): Promise<void>;
}