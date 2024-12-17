
const toggleButton = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar");

let isClickNum = false;

toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
});

document.getElementById("catalog-form").addEventListener("submit", function (event) {
    event.preventDefault();
    updateQueryString();
});

function updatePage(event) {
    const pageNumber = event.target.value;
    const urlParams = new URLSearchParams(window.location.search);
    isClickNum = true;
    urlParams.set("page", pageNumber);



    window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);

    updateQueryString();
}

function updateQueryString() {
    const form = document.getElementById("catalog-form");
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    const queryParams = [];
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("q");



    if (searchQuery) {
        queryParams.push(`q=${encodeURIComponent(searchQuery)}`);
    }

    checkboxes.forEach((checkbox) => {
        const paramName = checkbox.name;
        queryParams.push(`${paramName}=${encodeURIComponent(checkbox.value)}`);
    });

    const minPrice = document.getElementById("price-min").value;
    const maxPrice = document.getElementById("price-max").value;

    queryParams.push(`minPrice=${minPrice ? encodeURIComponent(minPrice) : ""}`);
    queryParams.push(`maxPrice=${maxPrice ? encodeURIComponent(maxPrice) : ""}`);
    //sortBy
    const sortBy = urlParams.get("sortBy")
    if (sortBy) {
        queryParams.push(`sortBy=${encodeURIComponent(sortBy)}`);
    }
    // Preserve the page number
    const pageNumber = urlParams.get("page");

    if (isClickNum === true) {
        queryParams.push(`page=${pageNumber}`);
        isClickNum = false;
    } else {
        queryParams.push(`page=1`);
    }
    window.history.pushState({}, "", `${window.location.pathname}?${queryParams.join("&")}`);


    fetch(`/api/products?${queryParams.join("&")}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const products = data.products;
            const pageCount = data.pageCount;
            const totalPage = data.totalPage;

            const productContainer = document.getElementById("product");

            productContainer.innerHTML = "";

            products.forEach((product) => {
                const productElement = document.createElement("div");
                productElement.classList.add("product-item");
                productElement.innerHTML = `
                <div class="flex flex-wrap">
                  <div class="flex flex-col">
                    <div class="relative flex">
                      <img id="imageProduct" src="${product.productImages[0].image}" alt="${product.name} image" />
                      <div class="absolute flex h-full w-full items-center justify-center gap-3 opacity-0 duration-150 hover:opacity-100">
                        <a id="idProduct" href="/product?id=${product.id}" class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-amber-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                          </svg>
                        </a>
                        <span class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-amber-400">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                        </span>
                      </div>
                      <div class="absolute right-1 mt-3 flex items-center justify-center bg-amber-400">
                        <p id="promotionProduct" class="px-2 py-2 text-sm">-${product.promotion}% OFF</p>
                      </div>
                    </div>
                    <div>
                      <p id="nameProduct" class="mt-2">${product.name}</p>
                      <p class="font-medium text-violet-900">
                        $${product.realPrice} <span id="priceProduct" class="text-sm text-gray-500 line-through">$${product.price}</span>
                      </p>
                      <div>
                        <button class="my-5 h-10 w-full bg-violet-900 text-white">Add to cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
                productContainer.appendChild(productElement);
            });


            const paginationContainer = document.getElementById("page");
            paginationContainer.innerHTML = "";

            for (let i = 1; i <= totalPage; i++) {
                const button = document.createElement("button");
                button.className = `px-4 py-2 border rounded transition-colors page-btn ${i === parseInt(pageCount) ? 'bg-blue-500 text-white' : ''}`;
                button.value = i;
                button.textContent = i;
                button.onclick = updatePage;
                paginationContainer.appendChild(button);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

window.onload = function () {
    preserveCheckboxState();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString()) {
        isClickNum = true;
        updateQueryString();
    }

};

function preserveCheckboxState() {
    const urlParams = new URLSearchParams(window.location.search);

    const searchQuery = urlParams.get("q");
    if (searchQuery) {
        const searchInput = document.querySelector('input[name="q"]');
        if (searchInput) {
            searchInput.value = searchQuery;
        }
    }

    const categoryFilters = urlParams.getAll("qfCategory");
    categoryFilters.forEach((category) => {
        const checkbox = document.getElementById(`category:${category}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });

    const brandFilters = urlParams.getAll("qfBrand");
    brandFilters.forEach((brand) => {
        const checkbox = document.getElementById(`brand:${brand}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });

    const sizeFilters = urlParams.getAll("qfSize");
    sizeFilters.forEach((size) => {
        const checkbox = document.getElementById(`size:${size}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });

    const buttonTextMap = {
        "lth": "Price: Lowest to Highest",
        "htl": "Price: Highest to Lowest",
        "newest": "Newest",
        "oldest": "Oldest",
    };

    const sortBy = urlParams.get("sortBy");
    const mainButtonText = document.getElementById("main-button-text");
    mainButtonText.textContent = buttonTextMap[sortBy] || "Sort By";

    const pageNumber = urlParams.get("page");

    if (pageNumber) {
        const pageNumberId = `page-button-${pageNumber}`;
        const pageNumberButton = document.getElementById(pageNumberId);

        if (pageNumberButton) {
            document.querySelectorAll(".page-btn").forEach((button) => {
                button.classList.remove("bg-blue-500", "text-white");
            });
            pageNumberButton.classList.add("bg-blue-500", "text-white");
        }
    }

    const minPrice = urlParams.get("minPrice");
    const maxPrice = urlParams.get("maxPrice");

    if (minPrice) {
        document.getElementById("price-min").value = minPrice;
    }
    if (maxPrice) {
        document.getElementById("price-max").value = maxPrice;
    }
}

function updateMainButton(buttonId) {
    const buttonTextMap = {
        "lth": "Price: Lowest to Highest",
        "htl": "Price: Highest to Lowest",
        "newest": "Newest",
        "oldest": "Oldest",
    };
    const mainButtonText = document.getElementById("main-button-text");
    mainButtonText.textContent = buttonTextMap[buttonId];
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("sortBy", buttonId);
    window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
    updateQueryString();
}
function cancelSort() {
    const mainButtonText = document.getElementById("main-button-text");
    mainButtonText.textContent = "Sort By";
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete("sortBy");
    window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
    updateQueryString();
}

//api add to cart
const form = document.getElementById('addToCartForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(form.action, {
            method: form.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});


