/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element); 
    this.renderAccountsList(); 
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list({ user_id: User.current}, (err, response) => {
      if (err) {
        console.error('Ошибка при загрузке счетов:', err);
        return;
      }
  
      if (!Array.isArray(response.data)) {
        console.error('Сервер вернул неподходящий формат данных:', response);
        return;
      }
  
     
      const selectElement = this.element.querySelector('#account-select, #income-accounts-list, #expense-accounts-list');
  
      if (!selectElement) {
        console.error('Элемент селекта не найден.');
        return;
      }
  
      selectElement.innerHTML = '';
  
      response.data.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = `${account.name}`;
        selectElement.appendChild(option);
      });
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    const transactionType =
    this.element.id === 'new-income-form' ? 'income' : 'expense';

  data.type = transactionType;

  Transaction.create(data, (err, response) => {
    if (err) {
      console.error('Ошибка при создании транзакции:', err);
      console.log('Возникла ошибка при создании транзакции.'); 
      return;
    }
    App.update(); 
  });
  const modal = App.getModal('newIncome');
  modal.close();
}
}