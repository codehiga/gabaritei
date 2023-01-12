import { addDoc, collection } from "firebase/firestore";
import { Gabarito } from "../interfaces/gabarito";
import { db } from "../libs/firebase";
import { GabaritoRepository } from "../repositories/gabarito-repository";

export class FirebaseGabaritoRepository implements GabaritoRepository {
  async salva(data: Gabarito): Promise<void> {
    await addDoc(collection(db, "gabaritos"), data);
  }
}