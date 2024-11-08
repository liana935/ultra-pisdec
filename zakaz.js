document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.querySelector('form');
    let cart = [];

    // Получаем данные корзины с сервера
    function getCartFromServer() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://109.120.155.144:80/carts', true);
            
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const serverCart = JSON.parse(xhr.responseText);
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
            xhr.open('POST', 'http://109.120.155.144:80/orders', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function() {
                if (xhr.status === 201) {
                    resolve('Заказ успешно отправлен');
                } else {
                    reject('Ошибка отправки заказа');
                }
            };

            xhr.onerror = function() {
                reject('Ошибка соединения с сервером');
            };

            xhr.send(JSON.stringify(orderData));
        });
    }

    // Очистка корзины после успешного заказа
    function clearCart() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://109.120.155.144:80/carts', true);
            
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const cartItems = JSON.parse(xhr.responseText);
                    const deletePromises = cartItems.map(item => deleteCartItem(item.id));
                    Promise.all(deletePromises)
                        .then(() => resolve('Корзина очищена'))
                        .catch(error => reject(error));
                } else {
                    reject('Ошибка получения корзины');
                }
            };

            xhr.onerror = function() {
                reject('Ошибка соединения с сервером');
            };

            xhr.send();
        });
    }

    function deleteCartItem(itemId) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', `http://109.120.155.144:80/carts/${itemId}`, true);
            
            xhr.onload = function() {
                if (xhr.status === 200 || xhr.status === 204) {
                    resolve(`Товар с ID ${itemId} удален из корзины`);
                } else {
                    reject(`Ошибка удаления товара с ID ${itemId}`);
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

            // Собираем данные формы
            const formData = new FormData(orderForm);
            const orderData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                items: cart.map(item => ({
                    product_id: item.product,
                    quantity: item.quantity || 1
                }))
            };

            // Отправляем заказ
            await sendOrder(orderData);

            // Очищаем корзину
            await clearCart();

            // Перенаправляем на страницу успешного оформления заказа
            window.location.href = 'yspex.html';
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
        }
    });
});