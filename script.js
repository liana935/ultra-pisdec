// Массив для хранения товаров в корзине
let cart = [];

function fetchData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://109.120.155.144:80/products', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const products = JSON.parse(xhr.responseText);
            localStorage.setItem('products', JSON.stringify(products));
            
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
                        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Добавить в корзину</button>
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
let cartId = 1;
// Функция для добавления товара в корзину
function addToCart(product) {
    console.log('Product to add:', product); // Логируем продукт
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://109.120.155.144:80/carts', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        id: cartId, // Здесь используем идентификатор корзины
        quantity: product.quantity,
        product: product.id, // Здесь используем идентификатор продукта
    }));
}

// Вызов функции для получения данных
fetchData();