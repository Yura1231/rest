document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    const publishBtn = document.getElementById('publishBtn');
    const commentField = document.getElementById('comment');
    const reviewsTabContent = document.getElementById('reviews'); // Замість .content-box, тепер використовуємо сам контейнер

    publishBtn.addEventListener('click', function () {
        const commentText = commentField.value.trim();

        if (commentText !== '') {
            // Якщо є стандартне повідомлення, видаляємо його
            const defaultTextElement = reviewsTabContent.querySelector('.content-box.default-text');
            if (defaultTextElement) {
                defaultTextElement.remove();
            }
            const formattedCommentText = commentText.replace(/\n/g, '<br>'); // Замінюємо символи нового рядка на тег <br>
            // Створюємо новий контейнер content-box для відгуку
            const contentBox = document.createElement('div');
            contentBox.classList.add('content-box');
            // Створюємо контейнер для відгуку
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');
                const userPhoto = document.createElement('img');
            userPhoto.src = 'profilePhoto.jpg'; // Замінити на шлях до фото
            userPhoto.alt = 'Фото користувача';
            userPhoto.classList.add('review-photo');
            // Контейнер для текстової частини
            const reviewContent = document.createElement('div');
            reviewContent.classList.add('review-content');
                const userName = document.createElement('h4');
            userName.textContent = 'Ім\'я Прізвище'; // Замінити на динамічне значення
            // Текст відгуку (вставка відформатованого тексту з тегами <br>)
            const reviewText = document.createElement('p');
            reviewText.innerHTML = formattedCommentText; // Використовуємо innerHTML, щоб вставити <br>
            // Додаємо елементи в структуру
            reviewContent.appendChild(userName);
            reviewContent.appendChild(reviewText);
            reviewItem.appendChild(userPhoto);
            reviewItem.appendChild(reviewContent);
            contentBox.appendChild(reviewItem);
            reviewsTabContent.appendChild(contentBox); // Додаємо contentBox в контейнер
            commentField.value = '';
        } else {
            console.log("Коментар порожній!");
        }
    });
    
});
