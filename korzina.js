document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content');
    const checkoutButton = document.getElementById('checkout-button');
    let cart = [];
    let cartId; // Добавляем переменную для хранения ID корзины

    function getCartFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://109.120.155.144:80/carts', true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                const serverCart = JSON.parse(xhr.responseText);
                if (serverCart.length > 0) {
                    cartId = serverCart[0].id; // Сохраняем ID корзины
                }
                const productIds = serverCart.map(item => item.product);
                displayCartItems(productIds);
            } else {
                console.error('Ошибка получения корзины с сервера');
            }
        };

        xhr.onerror = function() {
            console.error('Ошибка соединения с сервером');
        };

        xhr.send();
    }

    function displayCartItems(serverProductIds) {
        const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
        cart = savedProducts.filter(product => serverProductIds.includes(product.id));
        
        contentContainer.innerHTML = '';

        if (cart.length === 0) {
            contentContainer.innerHTML = '<p>Корзина пуста</p>';
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="product-card">
                    <img src="${item.photo_url}" alt="${item.name}" class="product-image">
                    <div class="product-info">
                        <h3>${item.name}</h3>
                    </div>
                </div>
            `;
            contentContainer.appendChild(itemElement);
        });

        // Добавляем кнопку "Очистить корзину"
        const clearCartButton = document.createElement('button');
        clearCartButton.textContent = 'Очистить корзину';
        clearCartButton.addEventListener('click', clearCart);
        contentContainer.appendChild(clearCartButton);
    }

    function clearCart() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://109.120.155.144:80/carts', true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                const cartItems = JSON.parse(xhr.responseText);
                if (cartItems.length > 0) {
                    // Удаляем каждый товар из корзины
                    cartItems.forEach(item => {
                        deleteCartItem(item.id);
                    });
                } else {
                    console.log('Корзина уже пуста');
                    updateCartDisplay();
                }
            } else {
                console.error('Ошибка получения корзины:', xhr.statusText);
            }
        };
    
        xhr.onerror = function() {
            console.error('Ошибка соединения с сервером');
        };
    
        xhr.send();
    }
    
    function deleteCartItem(itemId) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://109.120.155.144:80/carts/${itemId}`, true);
        
        xhr.onload = function() {
            if (xhr.status === 200 || xhr.status === 204) {
                console.log(`Товар с ID ${itemId} удален из корзины`);
                updateCartDisplay();
            } else {
                console.error(`Ошибка удаления товара с ID ${itemId}:`, xhr.statusText);
            }
        };
    
        xhr.onerror = function() {
            console.error('Ошибка соединения с сервером');
        };
    
        xhr.send();
    }
    
    function updateCartDisplay() {
        // Обновляем отображение корзины
        getCartFromServer();
    }

    // Обработчик кнопки "Оформить заказ"
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'zakaz.html';
        } else {
            alert('Корзина пуста!');
        }
    });

    // Загружаем корзину при загрузке страницы
    getCartFromServer();
});