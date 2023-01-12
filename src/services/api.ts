import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { Gabarito } from "../interfaces/gabarito";
import { db } from "../libs/firebase";
import { GabaritoRepository } from "../repositories/gabarito-repository";

export class FirebaseGabaritoRepository implements GabaritoRepository {
  
  async resgataGabaritos(email: string): Promise<Gabarito[]> {
    const response = await getDocs(collection(db, "gabaritos/" + email + "/gabaritos/"));
    const gabaritos = response.docs.map((gabarito) => gabarito.data() as Gabarito);
    return gabaritos;
  }
  
  async atualizaGabarito(id: string, email: string, data: any): Promise<void> {
    await updateDoc(doc(db, "gabaritos/"+ email +"/gabaritos/" + id), data)
  }

  async resgataGabaritoPorId(id: string, email: string): Promise<Gabarito> {
    const response = await getDoc(doc(db, "gabaritos/" + email + "/gabaritos/" + id));
    if(response.exists()) {
      return response.data() as Gabarito;
    }
    return null;
  }

  async salva(data: Gabarito): Promise<void> {
    await addDoc(collection(db, "gabaritos"), data);
  }
}