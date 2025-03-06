document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));// Видалити клас "active" у всіх вкладках
        this.classList.add('active');// Додати клас "active" на поточну вкладку
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active')); // Ховати всі блоки контенту
        // Показати контент для поточної вкладки
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

document.getElementById("editNameBtn").addEventListener("click", function() {
    let nameDisplay = document.getElementById("userName");
    let nameInput = document.getElementById("nameInput");
    let photoInput = document.getElementById("photoInput");
    let profilePhoto = document.getElementById("profilePhoto");
    if (nameInput.style.display === "none") {
        // Початок редагування
        nameInput.value = nameDisplay.textContent;
        nameDisplay.style.display = "none";
        nameInput.style.display = "block";
        nameInput.focus();
        // Показуємо вибір фото
        photoInput.style.display = "block";
        this.textContent = "Зберегти";
        // Додаємо кнопку "Скасувати", якщо її ще немає
        if (!document.getElementById("cancelNameBtn")) {
            let cancelBtn = document.createElement("button");
            cancelBtn.textContent = "Скасувати";
            cancelBtn.classList.add("edit-btn", "cancel-btn");
            cancelBtn.id = "cancelNameBtn";
            cancelBtn.style.marginLeft = "10px";
            this.parentNode.appendChild(cancelBtn);
            // Функціонал кнопки "Скасувати"
            cancelBtn.addEventListener("click", function() {
                nameInput.style.display = "none";
                nameDisplay.style.display = "block";
                // Ховаємо поле вибору фото
                photoInput.style.display = "none";
                document.getElementById("editNameBtn").textContent = "Редагувати";
                cancelBtn.remove();
            });
        }
        // Додаємо обробник для вибору фото
        photoInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhoto.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

    } else {
        // Збереження змін
        nameDisplay.textContent = nameInput.value;
        nameInput.style.display = "none";
        nameDisplay.style.display = "block";
        // Ховаємо поле вибору фото
        photoInput.style.display = "none";
        this.textContent = "Редагувати";
        // Видаляємо кнопку "Скасувати"
        let cancelBtn = document.getElementById("cancelNameBtn");
        if (cancelBtn) cancelBtn.remove();
    }
});

document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        let inputField = this.previousElementSibling;
        if (inputField.tagName === 'INPUT') {
            if (inputField.disabled) {
                // Початок редагування
                inputField.dataset.originalValue = inputField.value; // Запам’ятовуємо старе значення
                inputField.disabled = false;
                inputField.focus();
                this.textContent = 'Зберегти';
                // Додаємо кнопку "Скасувати", якщо її ще немає
                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('cancel-btn')) {
                    let cancelBtn = document.createElement('button');
                    cancelBtn.textContent = 'Скасувати';
                    cancelBtn.classList.add('edit-btn', 'cancel-btn'); // Додаємо клас edit-btn, щоб стилі були однакові
                    cancelBtn.style.marginLeft = '10px'; // Додаємо відступ, щоб не було злипання кнопок
                    this.parentNode.appendChild(cancelBtn);
                    // Додаємо функціонал кнопки "Скасувати"
                    cancelBtn.addEventListener('click', function() {
                        inputField.value = inputField.dataset.originalValue; // Відновлюємо значення
                        inputField.disabled = true;
                        btn.textContent = 'Редагувати';
                        cancelBtn.remove(); // Приховуємо кнопку "Скасувати"
                    });
                }
            } else {
                // Збереження змін
                inputField.disabled = true;
                this.textContent = 'Редагувати';
                // Приховуємо кнопку "Скасувати", бо редагування завершене
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('cancel-btn')) {
                    this.nextElementSibling.remove();
                }
            }
        }
    });
});
