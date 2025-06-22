/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = "/user"
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : undefined;
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    createRequest({
      method: "GET",
      url: this.URL + "/current",
      callback: (err, response) => {
        if (err) {
          return callback(err); 
        }
        if (response && response.success && response.user) {
          this.setCurrent(response.user);
        } else {
          this.unsetCurrent();
        }
        callback(err, response);
      },
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    if (!data.email || !data.password) {
      console.log(data)
        return callback(new Error('Email и пароль необходимы для авторизации.'));
    }

  
    createRequest({
      method: "POST",
      url: this.URL + "/login",
      responseType: "json",
      data: data,
      callback: (err, response) => {
        if (err) {
          return callback(err);
        }
        if (response && response.user) {
          this.setCurrent(response.user);
          return callback(null, response);
        } else {
          return callback(new Error("Ошибка авторизации: неверный email или пароль."));
        }
      },
    });
}

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: this.URL + "/register",
      method: "POST",
      data,
      callback: (err, response) => {
        if (response && response.success && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      },
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: this.URL + "/logout",
      method: "POST",
      callback: (err, response) => {

          if (response && response.success) {
              User.unsetCurrent();
              App.setState('init');                        
              callback(null, response);     
          } else {
              console.error('Ошибка выхода:', err || response);
              callback(err || new Error('Ошибка выхода'), response); 
          }
      },
  });
}
}