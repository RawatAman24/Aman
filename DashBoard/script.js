// ================= SIDEBAR =================

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show");
});


// ================= DARK MODE =================

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const icon = themeBtn.querySelector("i");

    if (document.body.classList.contains("dark")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }

});


// ================= REVENUE CHART =================

const revenueCtx = document
    .getElementById("revenueChart")
    .getContext("2d");

new Chart(revenueCtx, {

    type: "line",

    data: {

        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ],

        datasets: [

            {
                label: "Revenue",

                data: [
                    12000,
                    15000,
                    13500,
                    19000,
                    22000,
                    20500,
                    25000,
                    28000,
                    26500,
                    31000,
                    35000,
                    40000
                ],

                borderWidth: 3,

                fill: true,

                tension: 0.4
            }

        ]

    },

    options: {

        responsive: true,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {

            y: {
                beginAtZero: true
            }

        }

    }

});


// ================= SALES CHART =================

const salesCtx = document
    .getElementById("salesChart")
    .getContext("2d");

new Chart(salesCtx, {

    type: "doughnut",

    data: {

        labels: [
            "Electronics",
            "Fashion",
            "Home",
            "Other"
        ],

        datasets: [

            {
                data: [
                    40,
                    25,
                    20,
                    15
                ],

                borderWidth: 0
            }

        ]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {
                position: "bottom"
            }

        }

    }

});


// ================= SEARCH =================

const searchInput =
    document.getElementById("searchInput");

const rows =
    document.querySelectorAll("#orderTable tr");

searchInput.addEventListener("input", function () {

    const searchValue =
        this.value.toLowerCase();

    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();

        if (text.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

});


// ================= LOGOUT =================

const logoutBtn =
    document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function (e) {

    e.preventDefault();

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        alert("Logged out successfully!");

        window.location.href = "login.html";

    }

});


// ================= MENU ACTIVE =================

const menuItems =
    document.querySelectorAll(".menu li");

menuItems.forEach(item => {

    item.addEventListener("click", function () {

        menuItems.forEach(i =>
            i.classList.remove("active")
        );

        this.classList.add("active");

    });

});