/**
 * Класс AsyncForm управляет всеми формами
 * приложения, которые не должны быть отправлены с
 * перезагрузкой страницы. Вместо этого данные
 * с таких форм собираются и передаются в метод onSubmit
 * для последующей обработки
 * */
class AsyncForm {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) throw new Error('Элемент формы не передан!');

    this.element = element;
    this.registerEvents();
  }


  /**
   * Необходимо запретить отправку формы и в момент отправки
   * вызывает метод submit()
   * */
  registerEvents() {
    this.element.addEventListener('submit', event => {
      event.preventDefault(); 

      const formData = new FormData(event.target);
      let data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      this.submit(data);
    });
  }

  /**
   * Преобразует данные формы в объект вида
   * {
   *  'название поля формы 1': 'значение поля формы 1',
   *  'название поля формы 2': 'значение поля формы 2'
   * }
   * */
  getData() {
    const fields = Array.from(this.element.querySelectorAll('[name][value]'));
    return fields.reduce((result, field) => {
      result[field.name] = field.value.trim(); 
      return result;
    }, {});
  }

  onSubmit(){
  }

  /**
   * Вызывает метод onSubmit и передаёт туда
   * данные, полученные из метода getData()
   * */
  submit(data) {
    this.onSubmit(data); 
  }
}