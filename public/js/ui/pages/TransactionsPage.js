/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) throw new Error('Передан неверный элемент страницы транзакций');
    this.element = element;
    this.contentSection = element.querySelector('.content');
    this.titleElement = element.querySelector('.content-title');
    this.accountRemoveButton = this.element.querySelector('.remove-account');
    this.registerEvents();

  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', event => {
      if (event.target.classList.contains('transaction__remove')) {
        const transactionId = event.target.dataset.id;
        this.removeTransaction(parseInt(transactionId));
      }
    });
  
    const accountRemoveButton = this.element.querySelector('.remove-account');
    if (accountRemoveButton) {
      accountRemoveButton.addEventListener('click', () => {
        this.removeAccount();
      });
    }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions || !this.lastOptions.account_id) return;
  
    if (confirm('Вы действительно хотите удалить этот счёт?')) {
      Account.remove(this.lastOptions.account_id, err => {
        if (err) {
          alert('Ошибка при удалении счёта.');
          return;
        }
  
        this.clear();
        App.updateWidgets();
        App.updateForms();
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    console.log(id)
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(id, err => {
        if (err) {
          console.log('Ошибка при удалении транзакции!');
          return;
        }
        this.update(); // 👈 Перерисовываем страницу после успешного удаления
      });
    }
  }
  

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options || !options.account_id) return;
  
    this.lastOptions = options;
  
    Account.get(options.account_id, (err, account) => {
      if (err) {
        console.error(err);
        return;
      }
  
      this.renderTitle(account.name);
  
      Transaction.list({ account_id: options.account_id }, (err, transactions) => {
        if (err) {
          console.error(err);
          return;
        }
        this.renderTransactions(transactions);
      });
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    delete this.lastOptions;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(title) {
  this.titleElement.textContent = title;
}

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(dateStr) {
    const dateObj = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return dateObj.toLocaleString('ru-RU', options);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const typeClass = item.type === 'expense' ? 'transaction_expense' : 'transaction_income';
    const sum = Number(item.sum).toFixed(2);
    const formattedDate = this.formatDate(item.created_at);
  
    return `
      <div class="transaction ${typeClass} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon"><span class="fa fa-money fa-2x"></span></div>
          <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${formattedDate}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">${sum} ₽</div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(responseData) {
    const data = responseData.data; 

    this.contentSection.innerHTML = '';
    data.forEach(item => {
        const html = this.getTransactionHTML(item);
        this.contentSection.insertAdjacentHTML('beforeend', html);
    });
  }
}