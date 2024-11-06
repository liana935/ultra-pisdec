// Массив для хранения товаров в корзине
let cart = [];

function fetchData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://109.120.155.144/products', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const products = JSON.parse(xhr.responseText);

            if (Array.isArray(products)) {
                const content = document.getElementById('content');
                content.innerHTML = '';

                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.innerHTML = `
                        <h2>${product.name}</h2>
                        <img src="${product.photo_url}" alt="${product.name}">
                        <div class="text-left">
                            <p>Бренд: <span class="font-semibold">${product.brand}</span></p>
                            <p>Пол: <span class="font-semibold">${product.gender}</span></p>
                            <p>Группа: <span class="font-semibold">${product.group_name}</span></p>
                            <p>Примечания: <span class="font-semibold">${product.notes}</span></p>
                            <p>Описание: <span class="font-semibold">${product.description}</span></p>
                            <p>Количество: <span class="font-semibold">${product.quantity}</span></p>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
                    `;

                    // Добавляем обработчик события для кнопки "Добавить в корзину"
                    productCard.querySelector('.add-to-cart').addEventListener('click', function() {
                        addToCart(product);
                        
                    });

                    content.appendChild(productCard);
                });
            } else {
                console.error('Ошибка: products is not an array or is undefined');
            }
        } else {
            console.error('Ошибка:', xhr.statusText);
        }
    };
    xhr.send();
}

// Функция для добавления товара в корзину
function addToCart(product) {
    cart.push(product);
    alert(`${product.name} добавлен в корзину!`);
    console.log('Товары в корзине:', cart);
}
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.parentElement;
            const productId = product.getAttribute('data-id');
            const productName = product.getAttribute('data-name');
            const productPrice = product.getAttribute('data-price');

            const cartItem = {
                id: productId,
                name: productName,
                price: productPrice,
            };

            // Получаем текущую корзину из localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Проверяем, есть ли уже этот товар в корзине
            const existingProduct = cart.find(item => item.id === productId);
            if (existingProduct) {
                existingProduct.quantity += 1; // Увеличиваем количество
            } else {
                cart.push({ ...cartItem, quantity: 1 }); // Добавляем новый товар
            }

            // Сохраняем обновленную корзину в localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${productName} добавлен в корзину!`);
        });
    });
});

// Вызов функции для получения данных
fetchData();