document
    .getElementById("profile-settings-btn")
    .addEventListener("click", () => {
        const sidebar = document.getElementById("sidebar");
        const profileImg = document.getElementById("profile-img");
        sidebar.classList.toggle("hidden");
        profileImg.classList.toggle("hidden");
    });