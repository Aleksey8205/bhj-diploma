/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static get URL() {
    return '/account';
  }
  /**
   * Получает информацию о счёте
   * */
    static get(id, callback) {
      const fullUrl = `${this.URL}/${id}`;
      createRequest({
        url: fullUrl,
        method: 'GET',
        id: id,
        callback: callback
      });
    }
}
