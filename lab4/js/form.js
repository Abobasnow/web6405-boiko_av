'use strict';

class FormSubmission {
  #fields;
  #timestamp;

  constructor(fields) {
    this.#fields = Object.freeze({ ...fields });
    this.#timestamp = new Date();
  }

  get fields() { return { ...this.#fields }; }
  get timestamp() { return this.#timestamp; }

  format() {
    const { name, email, cooperationType, experience, comment, agreement } = this.#fields;
    return {
      'Имя': name,
      'Email': email,
      'Тип сотрудничества': cooperationType,
      'Опыт': experience,
      'Комментарий': comment,
      'Согласие': agreement ? 'да' : 'нет',
      'Время отправки': this.#timestamp.toLocaleString('ru-RU'),
    };
  }

  print() {
    console.group('📋 Заявка на сотрудничество');
    console.table([this.format()]);
    console.dir(this.#fields);
    console.groupEnd();
    return this;
  }
}


const form = document.querySelector('.form');
const messageEl = form.querySelector('.form__message');

function markError(inputEl, text) {
  const fieldEl = inputEl.closest('.form__field');
  fieldEl.classList.add('form__field--error');
  const errorEl = fieldEl.querySelector('.form__error');
  if (errorEl) errorEl.textContent = text;
}

function clearErrors() {
  form.querySelectorAll('.form__field--error').forEach((f) => f.classList.remove('form__field--error'));
  form.querySelectorAll('.form__error').forEach((e) => (e.textContent = ''));
  messageEl.className = 'form__message';
  messageEl.textContent = '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();

  const data = new FormData(form);
  const fields = {
    name: (data.get('name') || '').trim(),
    email: (data.get('email') || '').trim(),
    cooperationType: data.get('cooperationType') || '',
    experience: data.get('experience') || '',
    comment: (data.get('comment') || '').trim(),
    agreement: data.get('agreement') === 'on',
  };

  let hasErrors = false;

  if (fields.name.length < 2) {
    markError(form.elements.name, 'Минимум 2 символа');
    hasErrors = true;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    markError(form.elements.email, 'Некорректный email');
    hasErrors = true;
  }
  if (fields.comment.length < 20) {
    markError(form.elements.comment, 'Минимум 20 символов');
    hasErrors = true;
  }
  if (!fields.agreement) {
    markError(form.elements.agreement, 'Нужно ваше согласие');
    hasErrors = true;
  }

  if (hasErrors) {
    messageEl.textContent = '⚠️ Проверьте выделенные поля';
    messageEl.className = 'form__message form__message--error';
    return;
  }

  const submission = new FormSubmission(fields);
  submission.print();

  messageEl.textContent = `✅ Спасибо, ${fields.name}! Заявка отправлена. ^_^`;
  messageEl.className = 'form__message form__message--success';

  form.reset();
});