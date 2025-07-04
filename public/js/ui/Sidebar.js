/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const toggleBtn = document.querySelector('.sidebar-toggle');
  
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-open'); 
        document.body.classList.toggle('sidebar-collapse'); 
      });
    }
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const loginLink = document.querySelector('.menu-item_login');
    const registrationLink = document.querySelector('.menu-item_register');
    const logoutLink = document.querySelector('.menu-item_logout');
  
    if (loginLink) {
      loginLink.addEventListener('click', (event) => {
        event.preventDefault();
        const modalLogin = App.getModal('login'); 
        modalLogin.open(); 
      });
    }
  
    if (registrationLink) {
      registrationLink.addEventListener('click', (event) => {
        event.preventDefault();
        const modalRegistration = App.getModal('register'); 
        modalRegistration.open(); 
      });
    }
  
    if (logoutLink) {
      logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        User.logout((err) => { 
          if (err) {
            console.error('Ошибка выхода:', err);
          } else {
            App.setState('init'); 
          }
        });
      });
    }
  }
}