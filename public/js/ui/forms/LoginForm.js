/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  
   constructor(element) {
    super(element);
  }
  /*
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, (err, response) => {
      if (err) {
        console.error('Ошибка при попытке авторизации:', err);
        return;
      }
    
      if (response && response.success) {
        this.element.reset();
        App.setState('user-logged');
        const modal = App.getModal('login');
        modal.close();
      } else {
        console.log('Неверный логин или пароль.', response);
      }
    });
  }
}