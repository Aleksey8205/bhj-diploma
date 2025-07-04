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
    const formId = this.element.id;

    Account.list({ user_id: User.current }, (err, response) => {
      if (err) {
        console.error('Ошибка при загрузке счетов:', err);
        return;
      }

  
      let selector;
      switch (formId) {
        case 'new-expense-form':
          selector = '#expense-accounts-list'; 
          break;
        case 'new-income-form':
          selector = '#income-accounts-list'; 
          break;
        default:
          console.error('Неверный идентификатор формы');
          return;
      }
  
      const selectElement = this.element.querySelector(selector);
  
      if (!selectElement) {
        console.error('Элемент селекта не найден.');
        return;
      }
  
      selectElement.innerHTML = '';
  
      selectElement.innerHTML = response.data.reduce(
        (html, account) =>
          html + `<option value="${account.id}">${account.name}</option>`,
        ''
      );
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    const transactionType = this.element.id === 'new-income-form' ? 'income' : 'expense';
    data.type = transactionType;
  
    Transaction.create(data, (err, response) => {
      if (err) {
        console.error('Ошибка при создании транзакции:', err);
        return;
      }
      
      App.update();
  
      const modalKey = this.element.id.includes('income') ? 'newIncome' : 'newExpense';
      const modal = App.getModal(modalKey);
      if (modal) {
        modal.close();
      }
    });
  }
}