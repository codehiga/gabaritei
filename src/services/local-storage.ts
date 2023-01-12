export class LocalStorage {
  private localStorageRepository = localStorage;

  salva(key: string, value: any) {
    value = JSON.stringify(value);
    this.localStorageRepository.setItem(key, value);
  }

  resgata(key: string) {
    const data = this.localStorageRepository.getItem(key);
    return data && JSON.parse(data);
  }

  deleta(key: string) {
    this.localStorageRepository.removeItem(key);
  }

  atualizar(key: string, value: any) {
    let resgatado = this.resgata(key);
    this.localStorageRepository.removeItem(key);
    this.salva(key, {
      ...resgatado,
      ...value
    });
  }
}