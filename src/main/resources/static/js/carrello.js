$(document).ready(function() {
    // --- STATO DEL CARRELLO ---
    let cartItems = [];

    /**
     * Carica i dati iniziali del carrello dal file XML usando jQuery AJAX
     */
    function loadCartFromXML(xmlUrl) {
        $.ajax({
            type: "GET",
            url: xmlUrl,
            dataType: "xml"
        }).done(function(xmlDoc) {
            cartItems = [];
            // Naviga l'XML per estrarre i dati
            $(xmlDoc).find("elemento").each(function() {
                const $element = $(this);
                cartItems.push({
                    productId: parseInt($element.find("idProdotto").text(), 10),
                    name: $element.find("nome").text(),
                    price: parseFloat($element.find("prezzoUnitario").text()),
                    quantity: parseInt($element.find("quantita").text(), 10),
                    image: $element.find("immagine").text()
                });
            });
            renderCart();
        }).fail(function() {
            $("#cart-list").html('<p class="cart-empty-msg">Impossibile caricare i dati del carrello.</p>');
        });
    }

    /**
     * Incrementa o decrementa la quantità di un prodotto
     */
    function changeQuantity(productId, amount) {
        const item = cartItems.find(i => i.productId === productId);
        if (!item) return;

        // Se l'utente tenta di scendere sotto 1 o salire sopra 99, ignora l'azione
        if (amount < 0 && item.quantity <= 1) return;
        if (amount > 0 && item.quantity >= 99) return;

        item.quantity += amount;

        alert("Modificata la quantità del prodotto: " + item.name + " (Nuova quantità: " + item.quantity + ")");
        renderCart();
    }

    /**
     * Rimuove un articolo dal carrello
     */
    function removeFromCart(productId, showAlert = true) {
        const item = cartItems.find(i => i.productId === productId);
        if (showAlert && item) {
            // Mostra alert come richiesto dalle specifiche
            alert("Prodotto rimosso dal carrello: " + item.name + " (ID: " + productId + ")");
        }

        cartItems = cartItems.filter(i => i.productId !== productId);
        renderCart();
    }

    /**
     * Genera dinamicamente le righe del carrello e aggiorna i totali
     */
    function renderCart() {
        const $cartList = $("#cart-list");
        const $totalItems = $("#total-items");
        const $cartTotal = $("#cart-total");
        const $btnCheckout = $("#btn-checkout");

        $cartList.empty();

        if (cartItems.length === 0) {
            $cartList.html('<p class="cart-empty-msg">Il tuo carrello è vuoto.</p>');
            $totalItems.text("0");
            $cartTotal.text("0.00");
            $btnCheckout.prop("disabled", true);
            return;
        }

        let totalQty = 0;
        let grandTotal = 0;

        cartItems.forEach(item => {
            const subtotal = item.price * item.quantity;
            totalQty += item.quantity;
            grandTotal += subtotal;

            const articleHTML = `
                <article class="cart-item" data-product-id="${item.productId}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="unit-price">Prezzo unitario: € <span>${item.price.toFixed(2)}</span></p>
                    </div>
                    <div class="cart-item-quantity">
                        <label>Quantità:</label>
                        <div class="qty-stepper">
                            <button type="button" class="btn-qty-minus" data-id="${item.productId}" ${item.quantity <= 1 ? "disabled" : ""}>-</button>
                            <span>${item.quantity}</span>
                            <button type="button" class="btn-qty-plus" data-id="${item.productId}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-subtotal">
                            <p>Subtotale: <strong>€ <span class="subtotal-val">${subtotal.toFixed(2)}</span></strong></p>
                        </div>
                        <button type="button" class="btn-remove-item" data-id="${item.productId}">Rimuovi</button>
                    </div>
                </article>
            `;

            $cartList.append(articleHTML);
        });

        // Aggiornamento riepilogo laterale
        $totalItems.text(totalQty);
        $cartTotal.text(grandTotal.toFixed(2));
        $btnCheckout.prop("disabled", false);

        attachEvents();
    }

    /**
     * Associa gli ascoltatori agli elementi interattivi (+, -, Rimuovi)
     */
    function attachEvents() {
        // Disattiva gli handler precedenti per evitare trigger multipli, poi li riassocia
        $(".btn-qty-plus").off("click").on("click", function() {
            changeQuantity(parseInt($(this).data("id"), 10), 1);
        });

        $(".btn-qty-minus").off("click").on("click", function() {
            changeQuantity(parseInt($(this).data("id"), 10), -1);
        });

        $(".btn-remove-item").off("click").on("click", function() {
            removeFromCart(parseInt($(this).data("id"), 10));
        });
    }

    // Avvia il caricamento iniziale dal file XML
    loadCartFromXML("xml/carrello.xml");
});