// Анимации при скролле
document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Добавляем задержку если есть атрибут data-delay
                const delay = entry.target.dataset.delay || 0;
                entry.target.style.transitionDelay = delay + 'ms';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
});

// Мобильное меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        const expanded = mobileMenuBtn.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', expanded);

        // Блокировка скролла при открытом меню
        document.body.style.overflow = expanded ? 'hidden' : '';
    });
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Валидация формы
const form = document.getElementById('appointmentForm');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const serviceSelect = document.getElementById('service');
const agreeCheckbox = document.getElementById('agree');
const formSuccess = document.getElementById('formSuccess');

// Простая маска - только цифры и один плюс
phoneInput.addEventListener('input', function (e) {
    let value = e.target.value;
    // Убираем все кроме цифр и +
    value = value.replace(/[^\d+]/g, '');
    // Оставляем только один плюс в начале
    if (value.indexOf('+') > 0) {
        value = value.replace(/\+/g, '');
        value = '+' + value;
    }
    if (value.indexOf('+') === 0 && value.length > 1) {
        value = '+' + value.slice(1).replace(/\+/g, '');
    }
    e.target.value = value;
});

// Функция валидации (обнови существующую)
function validateForm() {
    let isValid = true;

    // Сброс ошибок
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));

    // Валидация имени
    const nameValue = document.getElementById('name').value.trim();
    if (!nameValue) {
        showError('name', 'Введите имя');
        isValid = false;
    }

    // Валидация телефона
    const phoneValue = phoneInput.value.trim();
    if (!phoneValue) {
        showError('phone', 'Введите номер телефона');
        isValid = false;
    } else {
        // Проверяем количество цифр
        const digits = phoneValue.replace(/\D/g, '');
        if (digits.length < 7) {
            showError('phone', 'Минимум 7 цифр');
            isValid = false;
        }
        if (digits.length > 15) {
            showError('phone', 'Слишком длинный номер');
            isValid = false;
        }
    }

    // Валидация услуги
    const serviceValue = document.getElementById('service').value;
    if (!serviceValue) {
        showError('service', 'Выберите услугу');
        isValid = false;
    }

    // Валидация согласия
    if (!document.getElementById('agree').checked) {
        showError('agree', 'Необходимо согласие');
        isValid = false;
    }

    return isValid;
}

// Функция валидации
function validateForm() {
    let isValid = true;

    // Сброс ошибок
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));

    // Валидация имени
    if (!nameInput.value.trim()) {
        showError('name', 'Введите ваше имя');
        isValid = false;
    } else if (nameInput.value.trim().length < 2) {
        showError('name', 'Имя должно содержать минимум 2 символа');
        isValid = false;
    }

    // Валидация телефона
    const phoneValue = phoneInput.value.replace(/\D/g, '');
    if (!phoneValue) {
        showError('phone', 'Введите номер телефона');
        isValid = false;
    } else if (phoneValue.length < 11) {
        showError('phone', 'Введите полный номер телефона');
        isValid = false;
    }

    // Валидация услуги
    if (!serviceSelect.value) {
        showError('service', 'Выберите услугу');
        isValid = false;
    }

    // Валидация согласия
    if (!agreeCheckbox.checked) {
        showError('agree', 'Необходимо согласие на обработку данных');
        isValid = false;
    }

    return isValid;
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
    }
    if (inputElement) {
        inputElement.classList.add('error');
    }
}

// Обработка отправки формы
if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (validateForm()) {
            // Показываем индикатор загрузки
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            // Имитация отправки на сервер
            try {
                const formData = {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    service: document.getElementById('service').value,
                    comment: document.getElementById('comment').value || 'нет',
                    date: new Date().toLocaleString('ru-RU')
                };

                // Формируем сообщение для Telegram
                const message = `
                    📝 Новая заявка с сайта!
                    👤 Имя: ${formData.name}
                    📞 Телефон: ${formData.phone}
                    🦷 Услуга: ${formData.service}
                    💬 Комментарий: ${formData.comment}
                    🕐 Время: ${formData.date}`;

                // ТВОЙ ТОКЕН (получи у @BotFather в Telegram)
                const token = '7089123456:AAHxqwertyuiop123456789'; // ЗАМЕНИ!
                const chatId = '123456789'; // ЗАМЕНИ! (узнай у @userinfobot)

                // Отправка в Telegram
                const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });

                if (response.ok) {
                    // Успех
                    formSuccess.hidden = false;
                    form.reset();
                } else {
                    alert('Ошибка отправки. Попробуйте позже.');
                }


                // Скрываем форму и показываем сообщение об успехе
                form.style.opacity = '0.5';
                formSuccess.hidden = false;
                form.reset();

                // Через 3 секунды возвращаем форму в исходное состояние
                setTimeout(() => {
                    form.style.opacity = '1';
                    formSuccess.hidden = true;
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            } catch (error) {
                alert('Произошла ошибка при отправке. Попробуйте позже.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}

// Плавный скролл для всех якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Ленивая загрузка изображений
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.loading = 'lazy';
    });
} else {
    // Fallback для старых браузеров
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Оптимизация производительности: дебаунс для событий скролла
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Обновляем активный пункт меню при скролле
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', debounce(updateActiveNavLink, 100));

// Добавляем класс active для текущего пункта меню
updateActiveNavLink();

// Обработка клавиши Escape для закрытия меню
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Предотвращаем утечки памяти при размонтировании
window.addEventListener('beforeunload', function () {
    if (observer) {
        observer.disconnect();
    }
});