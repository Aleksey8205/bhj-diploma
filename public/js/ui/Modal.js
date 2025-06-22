/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью Modal.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element){
    if (!element) throw new Error('Передан неверный элемент модального окна');
    this.element = element;
    this.registerEvents();
  }

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {
    const linkItems = document.querySelectorAll(".menu-item");

    linkItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            
            let modalName = null;
            if (item.classList.contains("menu-item_register")) {
                modalName = "register";
            } else if (item.classList.contains("menu-item_login")) {
                modalName = "login"; 
            } else if (item.classList.contains("menu-item_createAccount")) {
                modalName = "createAccount";
            } else if (item.classList.contains("menu-item_newIncome")) {
                modalName = "newIncome"; 
            } else if (item.classList.contains("menu-item_newExpense")) {
                modalName = "newExpense"; 
            } else if (item.classList.contains("menu-item_logout")) {
              User.logout((err, response) => {
                if (err) {
                    console.error('Ошибка выхода:', err);
                }
            });
            }

            if (modalName && App.modals[modalName]) {
                App.modals[modalName].open();
            }
        });
    });
  this.element.querySelectorAll('[data-dismiss="modal"]').forEach(button => {
    button.addEventListener('click', () => this.close());
    });
  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */
  onClose(e) {
    this.close();
  }
  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */
  open() {
    this.element.style.display = "block";
  }

  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  close(){
    this.element.style.display = '';
  }
}