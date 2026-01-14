document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const serviceGrid = document.getElementById('product-grid'); // Renamed from product-grid in HTML logic
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
    const modal = document.getElementById('add-item-modal');
    const closeButton = document.querySelector('.close-button');
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
        { id: 1, name: 'Swedish Massage', price: 60.00 },
        { id: 2, name: 'Deep Tissue Massage', price: 75.00 },
        { id: 3, name: 'Hot Stone Massage', price: 85.00 },
        { id: 4, name: 'Aromatherapy Facial', price: 50.00 },
        { id: 5, name: 'Manicure', price: 30.00 },
        { id: 6, name: 'Pedicure', price: 40.00 },
        { id: 7, name: 'Body Wrap', price: 90.00 },
        { id: 8, name: 'Waxing', price: 25.00 },
        { id: 9, name: 'Yoga Session', price: 20.00 },
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
            serviceElement.dataset.id = service.id;
            serviceElement.innerHTML = `
                <h3>${service.name}</h3>
                <p>$${service.price.toFixed(2)}</p>
            `;
            serviceElement.addEventListener('click', () => addServiceToCart(service));
            serviceGrid.appendChild(serviceElement);
        });
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
            alert('Please enter a valid discount percentage (0-100).');
        }
    }

    /**
     * Handles the checkout process.
     */
    function handleCheckout() {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert(`Thank you for your purchase! Total: $${cartTotalSpan.textContent}`);
        
        // Clear cart and discount
        cart = [];
        discountPercent = 0;
        discountInput.value = '';
        renderCart();
    }
    
    /**
     * Shows or hides the custom item modal.
     */
    function toggleModal(show) {
        modal.style.display = show ? 'flex' : 'none';
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
                price: price
            };
            services.push(newService);
            renderServices();
            toggleModal(false);
            itemNameInput.value = '';
            itemPriceInput.value = '';
        } else {
            alert('Please enter a valid name and price.');
        }
    }

    /**
     * Prepares and prints an invoice.
     */
    function printInvoice() {
        if (cart.length === 0) {
            alert("Cannot print an invoice for an empty cart.");
            return;
        }

        // Populate invoice details
        invoiceDate.textContent = new Date().toLocaleString();
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
    addItemButton.addEventListener('click', () => toggleModal(true));
    closeButton.addEventListener('click', () => toggleModal(false));
    saveItemButton.addEventListener('click', saveCustomItem);
    
    // Close modal if user clicks outside the content area
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            toggleModal(false);
        }
    });


    // --- Initial Setup ---
    renderServices();
    renderCart(); // Initial render to show $0.00
});