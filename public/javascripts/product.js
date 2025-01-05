document.getElementById('review').addEventListener('submit', async function (e) {
    e.preventDefault();
    await updateReview();
});
window.onload = function () {
    updatePaging();
};
function updatePage(event) {
    const pageNumber = event.target.value;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("reviewPage", pageNumber);
    window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
    updatePaging();
}
async function updateReview() {
    const urlParams = new URLSearchParams(window.location.search);
    const idQuery = urlParams.get("id");
    const message = document.getElementById('message').value;
    const productId = idQuery;

    try {
        const response = await fetch('/api/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, productId })
        })
        const data = await response.json();

        if (response.ok) {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("reviewPage", 1);
            window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
            location.reload();
        }
        else {
            document.getElementById('sendError').textContent = data.message || 'Send failed.';
            document.getElementById('sendError').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function updatePaging() {
    const queryParams = [];
    const urlParams = new URLSearchParams(window.location.search);
    const pageNumber = urlParams.get("reviewPage");
    const id = urlParams.get("id");
    queryParams.push(`id=${id}`)
    if (pageNumber)
        queryParams.push(`reviewPage=${pageNumber}`);


    window.history.pushState({}, "", `${window.location.pathname}?${queryParams.join("&")}`);


    fetch(`/api/pagingReview?${queryParams.join("&")}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const reviews = data.reviews;
            const pageCount = data.pageCount;
            const totalPage = data.totalPage;

            const reviewContainer = document.getElementById("reviewBox");

            reviewContainer.innerHTML = "";

            reviews.forEach((review) => {
                const reviewElement = document.createElement("article");
                reviewElement.classList.add("border-b", "border-solid");
                reviewElement.innerHTML = `
            <div class="flex items-center mb-4">
              <img class="w-10 h-10 me-4 rounded-full"   src="${review.user.avatar}?${review.user.avatar} : 'images/avatar-photo.png'" alt="">
              <div class="font-medium">
                <p>${review.user.fullName}</p>
              </div>
            </div>
            <footer class="mb-5 text-sm text-gray-500 px-14">
              <p>Reviewed on <time>${review.updatedAt}</time></p>
            </footer>
            <p class="mb-2 text-gray-500 px-14">
              ${review.comment}
            </p>
          `;
                reviewContainer.appendChild(reviewElement);
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
//add to cart fe 
const decrementBtn = document.getElementById('decrement');
const incrementBtn = document.getElementById('increment');
const quantityInput = document.getElementById('quantity');

decrementBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value, 10) || 1;
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
});

incrementBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value, 10) || 1;
    quantityInput.value = currentValue + 1;
});
//api add to cart
const forms = document.querySelectorAll('[id^="addToCartForm-"]');
forms.forEach(form => {
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
});