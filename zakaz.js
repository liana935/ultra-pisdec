document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.querySelector('form');
    let cart = [];

    // Получаем данные корзины с сервера
    function getCartFromServer() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://109.120.155.144:80/carts', true); // Используем HTTP
            
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const serverCart = JSON.parse(xhr.responseText);
                    console.log('Полученные данные корзины с сервера:', serverCart);
                    resolve(serverCart);
                } else {
                    reject('Ошибка получения корзины с сервера');
                }
            };

            xhr.onerror = function() {
                reject('Ошибка соединения с сервером');
            };

            xhr.send();
        });
    }

    // Отправляем заказ на сервер
    function sendOrder(orderData) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://109.120.155.144:80/orders', true); // Используем HTTP
            xhr.setRequestHeader('Content-Type', 'application/json');
    
            console.log('Отправляемые данные:', JSON.stringify(orderData));
    
            xhr.onload = function() {
                if (xhr.status === 201) {
                    resolve('Заказ успешно отправлен');
                } else {
                    reject('Ошибка отправки заказа: ' + xhr.responseText);
                }
            };
    
            xhr.onerror = function() {
                reject('Ошибка соединения с сервером');
            };
    
            xhr.send(JSON.stringify(orderData));
        });
    }

    // Очищаем корзину на сервере
    function clearCartOnServer() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', 'http://109.120.155.144:80/carts', true); // Используем HTTP
            
            xhr.onload = function() {
                if (xhr.status === 204) { // Успешное удаление
                    resolve('Корзина успешно очищена');
                } else {
                    reject('Ошибка очистки корзины: ' + xhr.responseText);
                }
            };

            xhr.onerror = function() {
                reject('Ошибка соединения с сервером');
            };

            xhr.send();
        });
    }

    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            // Получаем данные корзины
            cart = await getCartFromServer();
            console.log('Данные корзины:', cart);

            // Проверяем, не пуста ли корзина
            if (cart.length === 0) {
                alert('Корзина пуста. Пожалуйста, добавьте товары перед оформлением заказа.');
                return;
            }

            // Собираем данные формы
            const formData = new FormData(orderForm);
            const orderData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone_number: formData.get('phone'), // Изменено на phone_number
                delivery_address: formData.get('address'), // Изменено на delivery_address
                items: cart.map(item => ({
                    product_id: item.product,
                    quantity: item.quantity || 1
                }))
            };

            // Отправляем заказ
            await sendOrder(orderData);

            // Очищаем корзину на сервере
            await clearCartOnServer();

            // Обновляем локальную корзину
            cart = []; // Очищаем локальную переменную корзины

                        // Перенаправляем на страницу успешного оформления заказа
                        alert('Ваш заказ успешно оформлен!'); // Сообщение об успешном заказе
                        window.location.href = 'yspex.html';
                    } catch (error) {
                        console.error('Ошибка при оформлении заказа:', error);
                        alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
                    }
                });
            });