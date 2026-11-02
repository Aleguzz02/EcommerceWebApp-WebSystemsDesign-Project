document.addEventListener("DOMContentLoaded", function () {
    // ==========================================================================
    // 1. STATO DELL'APPLICAZIONE
    // ==========================================================================
    let productList = [];
    let cart = [];
    let favorites = [];
    let currentModalProductId = null;

    // Recupero carrello da localStorage per mantenere il badge aggiornato
    try {
        const savedCart = localStorage.getItem("cart");
        cart = savedCart ? JSON.parse(savedCart) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch (e) {
        console.warn("Cart non leggibile da localStorage:", e);
        cart = [];
    }

    // Recupero preferiti da localStorage
    try {
        const savedFavorites = localStorage.getItem("favorites");
        favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
        if (!Array.isArray(favorites)) favorites = [];
    } catch (e) {
        console.warn("Favorites non leggibili da localStorage:", e);
        favorites = [];
    }

    // ==========================================================================
    // 2. RIFERIMENTI DOM (Vanilla & jQuery)
    // ==========================================================================
    const productsContainer = document.getElementById("products");
    const $products = $(productsContainer);

    // Controlli Filtri e Ricerca
    const $searchForm = $("#search-form");
    const $searchInput = $("#search-input");
    const $categoryFilter = $("#category-filter");
    const $sortFilter = $("#sort-filter");
    const $favoritesToggle = $("#favorites-toggle");
    const btnResetFilters = document.getElementById("btn-reset-filters");

    // Badge contatore carrello nella navbar
    const $cartBadge = $("#cart-badge");

    // Finestra Modale Dettagli
    const modalInfo = document.getElementById("modal-info");
    const modalInfoTitle = document.getElementById("modal-info-title");
    const modalInfoImg = document.getElementById("modal-info-img");
    const modalInfoBrand = document.getElementById("modal-info-brand");
    const modalInfoDesc = document.getElementById("modal-info-desc");
    const modalInfoPrice = document.getElementById("modal-info-price");
    const modalInfoStock = document.getElementById("modal-info-stock");
    const $btnModalAdd = $("#btn-modal-add");
    const btnCloseInfo = document.getElementById("btn-close-info");

    // ==========================================================================
    // 3. FUNZIONI DI UTILITÀ E PERSISTENZA
    // ==========================================================================
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function saveFavorites() {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    function updateBadge() {
        const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
        $cartBadge.text(totalQty);
    }

    // ==========================================================================
    // 4. LOGICA CARRELLO E PREFERITI
    // ==========================================================================
    /**
     * Simula l'aggiunta di un prodotto al carrello mediante alert() (Par. 3.8)
     * e aggiorna lo stato locale per sincronizzare il badge e la pagina carrello.
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

        // Messaggio di conferma richiesto dalla specifica (Par. 3.8)
        alert('Prodotto aggiunto al carrello!\nNome: ' + product.name + '\nID: ' + product.id);
    }

    function toggleFavorite(productId) {
        const index = favorites.indexOf(productId);
        if (index === -1) {
            favorites.push(productId);
        } else {
            favorites.splice(index, 1);
        }
        saveFavorites();
        filterProducts();
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
     * Carica i prodotti della categoria scelta tramite AJAX (Par. 3.2 e 3.3)
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
     * Genera dinamicamente le schede prodotto (Par. 3.4)
     * @param {Array} items
     */
    function renderProducts(items) {
        productsContainer.innerHTML = "";

        if (!items || items.length === 0) {
            productsContainer.innerHTML =
                '<div class="no-results">' +
                '<h4>Nessun prodotto trovato</h4>' +
                '<p>Nessun articolo corrisponde ai filtri o alla ricerca impostata.</p>' +
                '</div>';
            return;
        }

        let productsHtml = "";
        items.forEach(function (item) {
            const isFav = favorites.includes(item.id);
            const favClass = isFav ? "btn-fav is-favorite" : "btn-fav";
            const favText = isFav ? "❤ Nei Preferiti" : "♡ Preferito";

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
                '<button type="button" class="' + favClass + '">' + favText + '</button>' +
                '<button type="button" class="btn-add">Aggiungi al carrello</button>' +
                '</div>' +
                '</article>';
        });

        productsContainer.innerHTML = productsHtml;
        attachProductCardEvents();
    }

    /**
     * Ricerca per parole chiave (nome, descrizione, marca) e ordinamento client-side (Par. 3.5 e 3.6)
     */
    function filterProducts() {
        if (!Array.isArray(productList)) return;

        const searchTerm = $searchInput.val().trim().toLowerCase();
        const onlyFavorites = $favoritesToggle.is(":checked");
        const sortCriteria = $sortFilter.val();

        // Ricerca per parole chiave su nome, descrizione e marca (Par. 3.5)
        let result = productList.filter(function (product) {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm) ||
                product.desc.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm);

            const matchesFav = !onlyFavorites || favorites.includes(product.id);

            return matchesSearch && matchesFav;
        });

        // Ordinamento client-side (Par. 3.6)
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
        $favoritesToggle.prop("checked", false);
        filterProducts();
    }

    // ==========================================================================
    // 7. MODALE DETTAGLI PRODOTTO (Par. 3.7)
    // ==========================================================================
    function showProductInfo(product) {
        if (!product) return;
        currentModalProductId = product.id;
        modalInfoTitle.textContent = product.name;
        modalInfoImg.src = product.image;
        modalInfoImg.alt = product.name;
        modalInfoBrand.textContent = product.brand;
        modalInfoDesc.textContent = product.desc;
        modalInfoPrice.textContent = product.price.toFixed(2);
        modalInfoStock.textContent = product.availability;
        modalInfo.showModal();
    }

    function attachProductCardEvents() {
        // Clic su Titolo, Immagine o tasto Dettagli per visualizzare la modale (Par. 3.7)
        $products.find(".clickable-detail").on("click", function () {
            const card = $(this).closest(".product-card");
            const productId = parseInt(card.data("id"), 10);
            const product = productList.find(p => p.id === productId);
            showProductInfo(product);
        });

        // Tasto Preferiti
        $products.find(".btn-fav").on("click", function () {
            const card = $(this).closest(".product-card");
            const productId = parseInt(card.data("id"), 10);
            toggleFavorite(productId);
        });

        // Aggiungi al carrello da scheda
        $products.find(".btn-add").on("click", function () {
            const card = $(this).closest(".product-card");
            const productId = parseInt(card.data("id"), 10);
            addToCart(productId);
        });
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

    // Selezione Categoria via AJAX (Par. 3.2)
    $categoryFilter.on("change", function () {
        const selectedCat = $(this).val();
        loadCategoryXML(selectedCat);
    });

    // Ordinamento e reset filtri
    $sortFilter.on("change", filterProducts);
    $favoritesToggle.on("change", filterProducts);
    btnResetFilters.addEventListener("click", resetFilters);

    // Azione "Aggiungi al carrello" dall'interno della Modale
    $btnModalAdd.on("click", function () {
        if (currentModalProductId !== null) {
            addToCart(currentModalProductId);
            modalInfo.close();
        }
    });

    // Chiusura Modale dal pulsante
    btnCloseInfo.addEventListener("click", function () {
        modalInfo.close();
    });

    // Chiusura al clic su area esterna alla finestra (backdrop)
    modalInfo.addEventListener("click", function (event) {
        const rect = modalInfo.getBoundingClientRect();
        const isInDialog = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
            modalInfo.close();
        }
    });

    // ==========================================================================
    // 9. AVVIO APPLICAZIONE
    // ==========================================================================
    loadCategoryXML("elettronica");
});