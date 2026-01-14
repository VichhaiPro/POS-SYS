document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const serviceGrid = document.getElementById('product-grid');
    const cartItemsList = document.getElementById('cart-items');
    const cartSubtotalSpan = document.getElementById('cart-subtotal');
    const cartDiscountSpan = document.getElementById('cart-discount');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const printInvoiceButton = document.getElementById('print-invoice-button');
    const addItemButton = document.getElementById('add-item-button');
    const applyDiscountButton = document.getElementById('apply-discount-button');
    const discountInput = document.getElementById('discount-percentage');

    // Modal elements
    const addItemModal = document.getElementById('add-item-modal');
    const qrCodeModal = document.getElementById('qr-code-modal');
    const closeButton = document.querySelector('.close-button');
    const qrCloseButton = document.querySelector('.qr-close-button');
    const saveItemButton = document.getElementById('save-item-button');
    const itemNameInput = document.getElementById('item-name-input');
    const itemPriceInput = document.getElementById('item-price-input');

    // Invoice elements
    const invoiceDate = document.getElementById('invoice-date');
    const invoiceItems = document.getElementById('invoice-items');
    const invoiceSubtotal = document.getElementById('invoice-subtotal');
    const invoiceDiscount = document.getElementById('invoice-discount');
    const invoiceTotal = document.getElementById('invoice-total');


    // --- State ---
    let cart = [];
    let services = [
        { id: 1, name: 'ម៉ាស្សាបែបស៊ុយអែដ', price: 60.00, image: 'https://images.unsplash.com/photo-1544161515-cfd836b04e94?q=80&w=1974&auto=format&fit=crop' },
        { id: 2, name: 'ម៉ាស្សាសាច់ដុំជ្រៅ', price: 75.00, image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop' },
        { id: 3, name: 'ម៉ាស្សាដោយប្រើថ្មក្តៅ', price: 85.00, image: 'https://images.unsplash.com/photo-1599442315179-9b410984a86f?q=80&w=1974&auto=format&fit=crop' },
        { id: 4, name: 'ម៉ាស្សាមុខដោយប្រើប្រេងក្រអូប', price: 50.00, image: 'https://images.unsplash.com/photo-1598205499639-58e1927d353b?q=80&w=2070&auto=format&fit=crop' },
        { id: 5, name: 'ធ្វើក្រចកដៃ', price: 30.00, image: 'https://images.unsplash.com/photo-1604654894610-df63bc595122?q=80&w=2070&auto=format&fit=crop' },
        { id: 6, name: 'ធ្វើក្រចកជើង', price: 40.00, image: 'https://images.unsplash.com/photo-1596704017254-972127236d87?q=80&w=2070&auto=format&fit=crop' },
        { id: 7, name: 'រុំខ្លួន', price: 90.00, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop' },
        { id: 8, name: 'បករោម', price: 25.00, image: 'https://images.unsplash.com/photo-1585771816844-a71f034a7fb2?q=80&w=2070&auto=format&fit=crop' },
        { id: 9, name: 'យូហ្គា', price: 20.00, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop' },
    ];
    let discountPercent = 0;

    // --- Functions ---

    /**
     * Renders all services to the service grid.
     */
    function renderServices() {
        serviceGrid.innerHTML = ''; // Clear existing services
        services.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.className = 'product-item'; // Keep class for styling
            
            serviceElement.innerHTML = `
                <img src="${service.image}" alt="${service.name}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 5px;">
                <h3 contenteditable="true" data-id="${service.id}" data-field="name">${service.name}</h3>
                <p contenteditable="true" data-id="${service.id}" data-field="price">$${service.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${service.id}">Add to Cart</button>
            `;
            serviceGrid.appendChild(serviceElement);
        });

        // Add event listeners for the new elements
        document.querySelectorAll('.product-item h3, .product-item p').forEach(element => {
            element.addEventListener('blur', updateService);
        });
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const serviceId = parseInt(e.target.dataset.id, 10);
                const service = services.find(s => s.id === serviceId);
                addServiceToCart(service);
            });
        });
    }

    /**
     * Updates a service's name or price.
     */
    function updateService(event) {
        const element = event.target;
        const id = parseInt(element.dataset.id, 10);
        const field = element.dataset.field;
        const value = element.textContent;

        const service = services.find(s => s.id === id);

        if (service) {
            if (field === 'name') {
                service.name = value;
            } else if (field === 'price') {
                const price = parseFloat(value.replace('$', ''));
                if (!isNaN(price)) {
                    service.price = price;
                    // Re-render to format the price correctly
                    renderServices();
                } else {
                    alert('Invalid price format.');
                    // Restore original value
                    element.textContent = `$${service.price.toFixed(2)}`;
                }
            }
        }
    }

    /**
     * Adds a service to the cart and updates the display.
     */
    function addServiceToCart(service) {
        cart.push(service);
        renderCart();
    }

    /**
     * Renders the current cart items and calculates totals.
     */
    function renderCart() {
        cartItemsList.innerHTML = '';
        
        let subtotal = 0;
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'cart-item';
            listItem.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            `;
            cartItemsList.appendChild(listItem);
            subtotal += item.price;
        });

        const discountAmount = subtotal * (discountPercent / 100);
        const total = subtotal - discountAmount;

        cartSubtotalSpan.textContent = subtotal.toFixed(2);
        cartDiscountSpan.textContent = discountAmount.toFixed(2);
        cartTotalSpan.textContent = total.toFixed(2);
    }

    /**
     * Applies the discount from the input field.
     */
    function applyDiscount() {
        const percentage = parseFloat(discountInput.value);
        if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
            discountPercent = percentage;
            renderCart();
        } else {
            alert('សូមបញ្ចូលភាគរយបញ្ចុះតម្លៃที่ត្រឹមត្រូវ (0-100)។');
        }
    }

    /**
     * Handles the checkout process.
     */
    function handleCheckout() {
        if (cart.length === 0) {
            alert("កន្ត្រកទំនិញរបស់អ្នកនៅទទេ!");
            return;
        }
        toggleModal(qrCodeModal, true);
    }
    
    /**
     * Shows or hides a modal.
     */
    function toggleModal(modal, show) {
        if (show) {
            modal.classList.add('show');
        } else {
            modal.classList.remove('show');
        }
    }

    /**
     * Saves a new custom service from the modal inputs.
     */
    function saveCustomItem() {
        const name = itemNameInput.value.trim();
        const price = parseFloat(itemPriceInput.value);

        if (name && !isNaN(price) && price >= 0) {
            const newService = {
                id: services.length + 1, // Simple ID generation
                name: name,
                price: price,
                image: 'https://via.placeholder.com/150'
            };
            services.push(newService);
            renderServices();
            toggleModal(addItemModal, false);
            itemNameInput.value = '';
            itemPriceInput.value = '';
        } else {
            alert('សូមបញ្ចូលឈ្មោះ និងតម្លៃที่ត្រឹមត្រូវ។');
        }
    }

    /**
     * Prepares and prints an invoice.
     */
    function printInvoice() {
        if (cart.length === 0) {
            alert("មិនអាចបោះពុម្ពវិក្កយបត្រសម្រាប់កន្ត្រកទំនិញទទេបានទេ។");
            return;
        }

        // Populate invoice details
        invoiceDate.textContent = new Date().toLocaleString('km-KH');
        invoiceItems.innerHTML = '';
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.innerHTML = `<span>${item.name}</span><span>$${item.price.toFixed(2)}</span>`;
            invoiceItems.appendChild(itemEl);
        });

        invoiceSubtotal.textContent = cartSubtotalSpan.textContent;
        invoiceDiscount.textContent = cartDiscountSpan.textContent;
        invoiceTotal.textContent = cartTotalSpan.textContent;

        // Print the page
        window.print();
    }


    // --- Event Listeners ---
    checkoutButton.addEventListener('click', handleCheckout);
    printInvoiceButton.addEventListener('click', printInvoice);
    applyDiscountButton.addEventListener('click', applyDiscount);
    addItemButton.addEventListener('click', () => toggleModal(addItemModal, true));
    closeButton.addEventListener('click', () => toggleModal(addItemModal, false));
    qrCloseButton.addEventListener('click', () => toggleModal(qrCodeModal, false));
    saveItemButton.addEventListener('click', saveCustomItem);
    
    // Close modal if user clicks outside the content area
    window.addEventListener('click', (event) => {
        if (event.target === addItemModal) {
            toggleModal(addItemModal, false);
        }
        if (event.target === qrCodeModal) {
            toggleModal(qrCodeModal, false);
        }
    });


    // --- Initial Setup ---
    renderServices();
    renderCart(); // Initial render to show $0.00
});