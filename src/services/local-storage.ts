export class LocalStorage {
  private localStorageRepository = localStorage;

  save(key: string, value: any) {
    this.localStorageRepository.setItem(key, value);
  }

  get(key: string) {
    this.localStorageRepository.getItem(key);
  }

  delete(key: string) {
    this.localStorageRepository.removeItem(key);
  }
}