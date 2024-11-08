document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content');
    const checkoutButton = document.getElementById('checkout-button');
    let cart = [];
    let cartId;

    function getCartFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://109.120.155.144:80/carts', true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                const serverCart = JSON.parse(xhr.responseText);
                if (serverCart.length > 0) {
                    cartId = serverCart[0].id;
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
        contentContainer.style.position = 'relative';

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

        const clearCartButton = document.createElement('button');
        clearCartButton.textContent = 'Очистить корзину';
        clearCartButton.addEventListener('click', clearCart);
        clearCartButton.style.position = 'absolute';
        clearCartButton.style.right = '20px';
        clearCartButton.style.top = '20px';
        clearCartButton.style.padding = '5px 10px';
        clearCartButton.style.border = 'none';
        clearCartButton.style.borderRadius = '5px';
        clearCartButton.style.backgroundColor = '#ff0000';
        clearCartButton.style.color = '#ffffff';
        clearCartButton.style.cursor = 'pointer';
        clearCartButton.style.fontSize = '12px';
        clearCartButton.style.fontWeight = 'bold';
        clearCartButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        clearCartButton.style.transition = 'background-color 0.3s ease';

        clearCartButton.addEventListener('mouseover', () => {
            clearCartButton.style.backgroundColor = '#cc0000';
        });
        clearCartButton.addEventListener('mouseout', () => {
            clearCartButton.style.backgroundColor = '#ff0000';
        });

        contentContainer.appendChild(clearCartButton);
    }

    function clearCart() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://109.120.155.144:80/carts', true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                const cartItems = JSON.parse(xhr.responseText);
                if (cartItems.length > 0) {
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
        getCartFromServer();
    }

    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'zakaz.html';
        } else {
            alert('Корзина пуста!');
        }
    });

    getCartFromServer();
});