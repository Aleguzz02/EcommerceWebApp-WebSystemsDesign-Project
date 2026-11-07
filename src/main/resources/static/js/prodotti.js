document.addEventListener("DOMContentLoaded", function () {
    // ==========================================================================
    // 1. STATO DELL'APPLICAZIONE
    // ==========================================================================
    let productList = [];
    let cart = [];
    let currentModalProductId = null;

    // Recupero carrello da sessionStorage per mantenere il badge aggiornato
    try {
        const savedCart = sessionStorage.getItem("cart");
        cart = savedCart ? JSON.parse(savedCart) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch (e) {
        console.warn("Cart non leggibile da localStorage:", e);
        cart = [];
    }

    // ==========================================================================
    // 2. RIFERIMENTI DOM (jQuery)
    // ==========================================================================
    const $products = $("#products");

    // Controlli Filtri e Ricerca
    const $searchForm = $("#search-form");
    const $searchInput = $("#search-input");
    const $categoryFilter = $("#category-filter");
    const $sortFilter = $("#sort-filter");
    const $btnResetFilters = $("#btn-reset-filters");

    // Badge contatore carrello nella navbar
    const $cartBadge = $("#cart-badge");

    // Finestra Modale Dettagli
    const $modalInfo = $("#modal-info");
    const $btnModalAdd = $("#btn-modal-add");
    const $btnCloseInfo = $("#btn-close-info");

    // ==========================================================================
    // 3. FUNZIONI DI UTILITÀ E PERSISTENZA
    // ==========================================================================
    function saveCart() {
        sessionStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateBadge() {
        const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
        $cartBadge.text(totalQty);
    }

    // ==========================================================================
    // 4. LOGICA CARRELLO
    // ==========================================================================
    /**
     * Simula l'aggiunta di un prodotto al carrello mediante alert()
     * e aggiorna lo stato locale per sincronizzare il badge.
     * @param {number} productId
     */
    function addToCart(productId) {
        const product = productList.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.productId === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            // Salviamo tutti i dati necessari per la pagina carrello.html
            cart.push({
                productId: productId,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
                desc: product.desc
            });
        }

        saveCart();
        updateBadge();

        // Messaggio di conferma richiesto dalla specifica
        alert('Prodotto aggiunto al carrello!\nNome: ' + product.name + '\nID: ' + product.id);
    }

    // ==========================================================================
    // 5. CARICAMENTO DATI VIA AJAX (jQuery)
    // ==========================================================================
    const xmlCategoryMap = {
        "elettronica": "xml/elettronica.xml",
        "libri": "xml/libri.xml",
        "abbigliamento": "xml/abbigliamento.xml"
    };

    /**
     * Carica i prodotti della categoria scelta tramite AJAX
     * @param {string} categoryKey
     */
    function loadCategoryXML(categoryKey) {
        const xmlFile = xmlCategoryMap[categoryKey];
        if (!xmlFile) return;

        $.ajax({
            type: "GET",
            url: xmlFile,
            dataType: "xml"
        })
            .done(function (xmlDoc) {
                productList = []; // Svuota i prodotti precedenti

                $(xmlDoc).find("prodotto").each(function () {
                    const $item = $(this);
                    productList.push({
                        id: parseInt($item.find("id").text(), 10),
                        name: $item.find("nome").text(),
                        desc: $item.find("descrizione").text(),
                        price: parseFloat($item.find("prezzo").text()),
                        brand: $item.find("marca").text(),
                        image: $item.find("immagine").text(),
                        availability: $item.find("disponibilita").text()
                    });
                });

                filterProducts(); // renderizza tenendo conto di eventuali filtri attivi
                updateBadge();
            })
            .fail(function () {
                alert("Errore nel caricamento del file XML per la categoria: " + categoryKey);
            });
    }

    // ==========================================================================
    // 6. RENDERING, RICERCA E ORDINAMENTO
    // ==========================================================================
    /**
     * Genera dinamicamente le schede prodotto
     * @param {Array} items
     */
    function renderProducts(items) {
        $products.empty();

        if (!items || items.length === 0) {
            $products.html(
                '<div class="no-results">' +
                '<h4>Nessun prodotto trovato</h4>' +
                '<p>Nessun articolo corrisponde ai filtri o alla ricerca impostata.</p>' +
                '</div>'
            );
            return;
        }

        let productsHtml = "";
        items.forEach(function (item) {
            // Normalizza la stringa per la classe CSS (es. "In arrivo" -> "in-arrivo")
            const availClass = item.availability.toLowerCase().replace(/\s+/g, "-");

            productsHtml +=
                '<article class="product-card" data-id="' + item.id + '">' +
                '<img src="' + item.image + '" alt="' + item.name + '" class="clickable-detail">' +
                '<span class="brand">' + item.brand + '</span>' +
                '<h4 class="clickable-detail">' + item.name + '</h4>' +
                '<p class="desc">' + item.desc + '</p>' +
                '<p class="availability ' + availClass + '">● ' + item.availability + '</p>' +
                '<p class="price">€ ' + item.price.toFixed(2) + '</p>' +
                '<div class="card-actions">' +
                '<button type="button" class="btn-detail clickable-detail">Dettagli</button>' +
                '<button type="button" class="btn-add">Aggiungi al carrello</button>' +
                '</div>' +
                '</article>';
        });

        $products.html(productsHtml);
    }

    /**
     * Ricerca per parole chiave (nome, descrizione, marca) e ordinamento client-side
     */
    function filterProducts() {
        if (!Array.isArray(productList)) return;

        const searchTerm = $searchInput.val().trim().toLowerCase();
        const sortCriteria = $sortFilter.val();

        // Ricerca per parole chiave su nome, descrizione e marca
        let result = productList.filter(function (product) {
            return (
                product.name.toLowerCase().includes(searchTerm) ||
                product.desc.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm)
            );
        });

        // Ordinamento client-side
        if (sortCriteria === "price-asc") {
            result.sort(function (a, b) { return a.price - b.price; });
        } else if (sortCriteria === "price-desc") {
            result.sort(function (a, b) { return b.price - a.price; });
        } else if (sortCriteria === "name-asc") {
            result.sort(function (a, b) { return a.name.localeCompare(b.name); });
        } else if (sortCriteria === "name-desc") {
            result.sort(function (a, b) { return b.name.localeCompare(a.name); });
        }

        renderProducts(result);
    }

    function resetFilters() {
        $searchInput.val("");
        $sortFilter.val("default");
        filterProducts();
    }

    // ==========================================================================
    // 7. MODALE DETTAGLI PRODOTTO (jQuery + dialog nativo)
    // ==========================================================================
    function showProductInfo(product) {
        if (!product) return;
        currentModalProductId = product.id;

        // Popolamento dinamico tramite jQuery
        $("#modal-info-title").text(product.name);
        $("#modal-info-img").attr("src", product.image).attr("alt", product.name);
        $("#modal-info-brand").text(product.brand);
        $("#modal-info-desc").text(product.desc);
        $("#modal-info-price").text(product.price.toFixed(2));
        $("#modal-info-stock").text(product.availability);

        // Apertura della modale
        $modalInfo[0].showModal();
    }

    function closeModalInfo() {
        $modalInfo[0].close();
    }

    // ==========================================================================
    // 8. ASSEGNAZIONE EVENTI E LISTENERS
    // ==========================================================================
    // Ricerca mentre l'utente digita
    $searchInput.on("input", filterProducts);
    $searchForm.on("submit", function (e) {
        e.preventDefault();
        filterProducts();
    });

    // Selezione Categoria via AJAX
    $categoryFilter.on("change", function () {
        const selectedCat = $(this).val();
        loadCategoryXML(selectedCat);
    });

    // Ordinamento e reset filtri
    $sortFilter.on("change", filterProducts);
    $btnResetFilters.on("click", resetFilters);

    // Clic su Titolo, Immagine o tasto Dettagli per visualizzare la modale (Event Delegation)
    $products.on("click", ".clickable-detail", function () {
        const card = $(this).closest(".product-card");
        const productId = parseInt(card.data("id"), 10);
        const product = productList.find(p => p.id === productId);
        showProductInfo(product);
    });

    // Aggiungi al carrello da scheda (Event Delegation)
    $products.on("click", ".btn-add", function () {
        const card = $(this).closest(".product-card");
        const productId = parseInt(card.data("id"), 10);
        addToCart(productId);
    });

    // Azione "Aggiungi al carrello" dall'interno della Modale
    $btnModalAdd.on("click", function () {
        if (currentModalProductId !== null) {
            addToCart(currentModalProductId);
            closeModalInfo();
        }
    });

    // Chiusura Modale dal pulsante "Chiudi"
    $btnCloseInfo.on("click", closeModalInfo);

    // Chiusura al clic sull'area esterna (backdrop)
    $modalInfo.on("click", function (event) {
        const rect = this.getBoundingClientRect();
        const isInDialog = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
            closeModalInfo();
        }
    });

    // ==========================================================================
    // 9. AVVIO APPLICAZIONE
    // ==========================================================================
    loadCategoryXML("elettronica");
});