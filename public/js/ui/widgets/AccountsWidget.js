/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Отсутствует элемент widget');
    }

    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      let target = event.target.closest('.create-account');
      if (target) {
        this.onOpenModalNewAccount();
        return;
      }
      
      target = event.target.closest('.account a');
      if (target) {
        const accountId = target.parentNode.dataset.id;
        this.onSelectAccount(accountId); 
      }
    });
  }
  
  onOpenModalNewAccount() {
    const modal = document.getElementById('modal-new-account');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const currentUser = User.current();
    if (!currentUser) {
      return;
    }

    Account.list({ user_id: currentUser.id }, (err, response) => {
      if (err) {
        console.error('Ошибка при получении счетов:', err);
        return;
      }

      if (!response.success || !Array.isArray(response.data)) {
        console.error('Неправильный ответ сервера:', response);
        return;
      }

      this.clear();
      response.data.forEach((account) => {
        this.renderItem(account);
      });
    });
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accountsList = this.element.querySelectorAll('.account');
    accountsList.forEach((item) => item.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(accountId) {
    const activeClass = '.account.active';
    const oldActive = this.element.querySelector(activeClass);
    if (oldActive) {
      oldActive.classList.remove('active');
    }

    const newSelected = this.element.querySelector(`.account[data-id="${accountId}"]`);
    if (newSelected) {
      newSelected.classList.add('active');
    }

    App.showPage('transactions', { account_id: accountId });
}

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const formattedSum = new Intl.NumberFormat('ru-RU').format(item.sum).replace('.', ',');
    return `
      <li class="account" data-id="${item.id}">
          <a href="#" class="account-link">
              <span>${item.name}</span> /
              <span>${formattedSum} ₽</span>
          </a>
      </li>
    `;
  }
  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    const html = this.getAccountHTML(data);
    this.element.insertAdjacentHTML('beforeend', html);
  }
}
