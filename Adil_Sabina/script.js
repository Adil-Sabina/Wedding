function nextScene(sceneNumber) {
    const music = document.getElementById('bg-music');
    if (music && music.paused) {
        music.play().catch(e => console.log("Музыка активирована"));
    }

    const currentScene = document.querySelector('.scene.active');
    if (currentScene) {
        currentScene.classList.remove('active');
    }

    const nextScene = document.getElementById(`scene-${sceneNumber}`);
    if (nextScene) {
        nextScene.classList.add('active');
    }

    if (index === 5 && localStorage.getItem("rsvp_submitted") === "true") {
        const form = document.getElementById('rsvp-form');
        const successMessage = document.getElementById('rsvp-success');
        
        if (form && successMessage) {
            // Подменяем форму на сообщение
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            const successTitle = successMessage.querySelector('h3');
            if (successTitle) successTitle.textContent = 'Вы уже оставили свой ответ!';
            
            // Запускаем таймер строго ЗДЕСЬ и нигде больше!
            setTimeout(() => {
                // Перекидываем на 6-ю сцену
                nextScene(6); 
            }, 3000); // Ровно 3 секунды плавного ожидания
        }
    }
}


function handleEnvelopeNextClick(event) {
    if (event) event.stopPropagation();

    // 1. Просто переводим гостя на 5-ю сцену
    if (typeof nextScene === "function") {
        nextScene(5);
    } else {
        const scene5 = document.getElementById('scene-5');
        if (scene5) scene5.scrollIntoView({ behavior: 'smooth' });
    }

    // 2. Если гость уже отвечал — показываем плашку успеха с кнопкой "Посмотреть таймер"
    if (localStorage.getItem("rsvp_submitted") === "true") {
        const form = document.getElementById('rsvp-form');
        const successMessage = document.getElementById('rsvp-success');
        
        if (form && successMessage) {
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Меняем заголовки на более логичные для повторного входа
            const successTitle = successMessage.querySelector('h3');
            const successDesc = document.getElementById('success-desc');
            
            if (successTitle) successTitle.textContent = 'Вы уже оставили свой ответ!';
            if (successDesc) successDesc.textContent = 'Рады, что вы будете с нами в этот важный день.';
        }
    }
}

function zoomPhoto(card) {
    if (card.classList.contains('zoomed')) {
        card.classList.remove('zoomed');
    } else {
        document.querySelectorAll('.scattered-card.zoomed').forEach(c => c.classList.remove('zoomed'));
        card.classList.add('zoomed');
    }
}

// Умный свайп сургучной печати
const waxSeal = document.getElementById('wax-seal');
const envelope = document.getElementById('envelope-object');

if (waxSeal && envelope) {
    let startX = 0;
    let isDragging = false;

    const triggerOpen = () => {
        isDragging = false;
        waxSeal.style.transform = 'translate(180px, -50%) scale(0)';
        waxSeal.style.opacity = '0';
        
        // 1. Анимируем открытие клапана в CSS
        envelope.classList.add('open');

        // 2. Через 1 секунду, когда клапан полностью откинулся, делаем "нырок" в конверт
        setTimeout(() => {
            nextScene(6);
        }, 1000);
    };

    waxSeal.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; });
    waxSeal.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        let diffX = e.touches[0].clientX - startX;
        if (diffX > 0 && diffX < 150) {
            waxSeal.style.left = `${125 + diffX}px`;
        }
        if (diffX > 110) triggerOpen();
    });
    waxSeal.addEventListener('touchend', () => { if(isDragging) { waxSeal.style.left = '125px'; isDragging = false; } });

    // Для мышки на ПК
    waxSeal.addEventListener('mousedown', (e) => { startX = e.clientX; isDragging = true; });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let diffX = e.clientX - startX;
        if (diffX > 0 && diffX < 150) waxSeal.style.left = `${125 + diffX}px`;
        if (diffX > 110) triggerOpen();
    });
    window.addEventListener('mouseup', () => { if(isDragging) { waxSeal.style.left = '125px'; isDragging = false; } });
}

function initTimer() {
    const targetDate = new Date('September 19, 2026 16:00:00').getTime();
    const timerDisplay = document.getElementById('countdown-timer');
    if (!timerDisplay) return;

    setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;
        if (difference < 0) { timerDisplay.innerHTML = "000 : 00 : 00"; return; }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(3, '0');
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');

        timerDisplay.innerHTML = `${days} : ${hours} : ${minutes}`;
    }, 1000);
}
document.addEventListener('DOMContentLoaded', initTimer);

function handleRSVP(isComing) {
    const rsvpCard = document.getElementById('rsvp-card');
    if (rsvpCard) rsvpCard.classList.add('flipped');
    setTimeout(() => { nextScene(9); }, 3500);
}

function openEnvelope() {
    const envelope = document.getElementById('envelope');
    
    // Переключаем класс открытия конверта
    envelope.classList.toggle('open');
}

// Техническая функция, чтобы клики по тексту внутри письма не закрывали конверт обратно
function stopPropagation(event) {
    event.stopPropagation();
}

document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("rsvp_submitted") === "true") {
        const form = document.getElementById('rsvp-form');
        const successMessage = document.getElementById('rsvp-success');
        
        if (form && successMessage) {
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Опционально: можно поменять текст на "Вы уже отправили ответ"
            const successTitle = successMessage.querySelector('h3');
            if (successTitle) successTitle.textContent = 'Вы уже оставили свой ответ!';
        }
    }
});

// 2. Измененная функция отправки, которая ставит метку в память устройства
function sendRsvp(event) {
    event.preventDefault();
    
    const form = document.getElementById('rsvp-form');
    const successMessage = document.getElementById('rsvp-success');
    const submitButton = form.querySelector('.btn-rsvp-submit');
    
    // Если каким-то образом метка уже есть, не даем отправить
    if (localStorage.getItem("rsvp_submitted") === "true") {
        alert("Вы уже отправляли ответ с этого устройства.");
        return;
    }
    
    if(submitButton) submitButton.disabled = true;

    const formData = new FormData(form);
    
    // (Тут твои настройки отправки в Web3Forms или Telegram, оставляем как было)
    formData.append("access_key", "e7d0e149-5d47-4ca0-b82c-73d5806cbdd1");
    formData.append("subject", "Новый ответ RSVP на свадьбу!");

    const drinks = [];
    form.querySelectorAll('input[name="drinks"]:checked').forEach((checkbox) => {
        drinks.push(checkbox.value);
    });
    formData.append("Выбранные напитки", drinks.length > 0 ? drinks.join(', ') : 'Не выбрано');

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    })
    .then(async (response) => {
        if (response.status == 200) {
            localStorage.setItem("rsvp_submitted", "true");
            form.style.display = 'none';
            successMessage.style.display = 'block';
            // Никаких таймеров! Гость сам нажмет на кнопку, когда захочет пойти дальше
        }
        else {
            let json = await response.json();
            alert("Ошибка: " + json.message);
            if(submitButton) submitButton.disabled = false;
        }
    })
    .catch(error => {
        alert("Что-то пошло не так. Проверьте интернет.");
        if(submitButton) submitButton.disabled = false;
    });
}

function initWeddingTimer() {
    // Устанавливаем дату свадьбы (19 сентября 2026, например, 18:00)
    const weddingDate = new Date("September 19, 2026 18:00:00").getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        // Если дата свадьбы уже наступила
        if (distance < 0) {
            clearInterval(timerInterval);
            const timerContainer = document.querySelector('.wedding-timer');
            if (timerContainer) {
                timerContainer.innerHTML = "<div class='timer-number' style='font-size: 1.5rem;'>Этот счастливый день настал! 🥂</div>";
            }
            return;
        }

        // Расчет дней, часов, минут и секунд
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Красивое добавление нолей, если цифра меньше 10 (например, "05" вместо "5")
        document.getElementById("timer-days").textContent = days < 10 ? "0" + days : days;
        document.getElementById("timer-hours").textContent = hours < 10 ? "0" + hours : hours;
        document.getElementById("timer-minutes").textContent = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("timer-seconds").textContent = seconds < 10 ? "0" + seconds : seconds;
    }

    // Запускаем таймер сразу и обновляем каждую секунду
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}

// Запуск таймера при загрузке страницы
document.addEventListener("DOMContentLoaded", initWeddingTimer);