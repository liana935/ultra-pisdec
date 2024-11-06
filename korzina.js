// korzina.js

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('total');
    const checkoutButton = document.getElementById('checkout-button');
    let cart = []; // Инициализируем массив корзины

    // Получаем корзину из localStorage
    function fetchData() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://109.120.155.144/carts', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                cart = JSON.parse(xhr.responseText); // Предполагаем, что сервер возвращает JSON
                displayCartItems(); // Отображаем товары в корзине после получения данных
            } else {
                console.error('Ошибка при загрузке данных корзины:', xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Ошибка соединения с сервером');
        };
        xhr.send();
    }

    // Функция для отображения товаров в корзине
    function displayCartItems() {
        cartItemsContainer.innerHTML = ''; // Очищаем контейнер

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Корзина пуста.</p>';
            totalContainer.innerHTML = '';
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <h2>${item.name}</h2>
                <p>Цена: ${item.price} ₽</p>
                <p>Количество: ${item.quantity}</p>
            `;
            cartItemsContainer.appendChild(itemDiv);
            total += item.price * item.quantity; // Считаем общую стоимость
        });

        totalContainer.innerHTML = `Общая сумма: ${total} ₽`;
    }

    // Обработчик для оформления заказа
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста. Добавьте товары перед оформлением заказа.');
        } else {
            alert('Спасибо за ваш заказ!');
            // Здесь можно добавить логику для оформления заказа
            localStorage.removeItem('cart'); // Очищаем корзину после оформления
            cart = []; // Обнуляем массив корзины
            displayCartItems(); // Обновляем отображение корзины
        }
    });

    // Загружаем данные корзины при загрузке страницы
    fetchData();
});