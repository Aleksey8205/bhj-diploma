/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) throw new Error('Передан неверный элемент для виджета транзакций');
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    this.element.addEventListener('click', event => {
      if (event.target.matches('.create-income-button')) {
        const incomeModal = App.getModal('newIncome');
        incomeModal.open();
      } else if (event.target.matches('.create-expense-button')) {
        const expenseModal = App.getModal('newExpense');
        expenseModal.open();
      }
    });
  }
}
