export default class LocalstorageService {
  static save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static load(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  static exists(key) {
    return this.load(key) !== null;
  }
}

export { LocalstorageService };
