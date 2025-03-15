const modal = document.querySelector('.backdrop');
const modalBtnOpen = document.querySelector('.modal-btn-open');
const modalBtnClose = document.querySelector('.modal-btn-close');

const toggleModal = () => modal.classList.toggle('is-hidden');

modalBtnOpen.addEventListener('click', toggleModal);
modalBtnClose.addEventListener('click', toggleModal);

document.addEventListener("DOMContentLoaded", function () {
    const form = document.forms["modal-form"];

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let isValid = true;
        
        clearErrors();

        const fields = [
            "title", "category", "city", "address", "start-date", "end-date", "start-time", "end-time", "phone", "email", "description"
        ];

        fields.forEach(field => {
            const input = form[field];
            if (!input.value.trim()) {
                showError(input, "Це поле обов'язкове і не може містити тільки пробіли");
                isValid = false;
            }
        });

        const phone = form["phone"];
        const phonePattern = /^\+380\d{9}$/;
        if (!phonePattern.test(phone.value.trim())) {
            showError(phone, "Введіть коректний номер у форматі +380XXXXXXXXX");
            isValid = false;
        }

        const email = form["email"];
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            showError(email, "Введіть коректний e-mail");
            isValid = false;
        }

        const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;
        const startDateInput = form["start-date"].value.trim();
        const endDateInput = form["end-date"].value.trim();

        if (!datePattern.test(startDateInput)) {
            showError(form["start-date"], "Дата має бути у форматі dd.mm.yyyy");
            isValid = false;
        }

        if (!datePattern.test(endDateInput)) {
            showError(form["end-date"], "Дата має бути у форматі dd.mm.yyyy");
            isValid = false;
        }

        if (isValid) {
            const formData = getFormData();
            console.log("JSON-об'єкт форми:", JSON.stringify(formData, null, 2));
            alert("Форма успішно відправлена!");
            form.reset();
        }
    });

    function showError(input, message) {
        const error = document.createElement("div");
        error.className = "error-message";
        error.textContent = message;
        input.classList.add("error");
        input.parentNode.appendChild(error);
    }

    function clearErrors() {
        document.querySelectorAll(".error-message").forEach(error => error.remove());
        document.querySelectorAll(".error").forEach(input => input.classList.remove("error"));
    }

    function getFormData() {
        const formData = {};
        new FormData(form).forEach((value, key) => {
            formData[key] = value.trim();
        });
        return formData;
    }
});
