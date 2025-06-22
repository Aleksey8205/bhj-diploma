/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      console.log(response)
      if (err) {
        console.error('Ошибка при создании счёта:', err);
        return;
      }
      const modal = App.getModal('createAccount');
      modal.close();
      App.update();
      this.element.reset();

      console.log('Счёт успешно создан!');
    });
  }
}