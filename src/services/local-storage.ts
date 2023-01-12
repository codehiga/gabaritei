export class LocalStorage {
  private localStorageRepository = localStorage;

  save(key: string, value: any) {
    value = JSON.stringify(value);
    this.localStorageRepository.setItem(key, value);
  }

  get(key: string) {
    const data = this.localStorageRepository.getItem(key);
    return data && JSON.parse(data);
  }

  delete(key: string) {
    this.localStorageRepository.removeItem(key);
  }
}