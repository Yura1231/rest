document.addEventListener("DOMContentLoaded", async function () {
    loadUserEvents();
    loadSubscribedEvents();

    document.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
            this.classList.add("active");

            document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"));

            const tabId = this.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");
        });
    });
});

async function loadUserEvents() {
    try {
        let response = await fetch("https://newhandy-4b950124bf06.herokuapp.com/my-events/", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Помилка завантаження подій");
        }

        let events = await response.json();
        let container = document.getElementById("published");

        if (events.length === 0) {
            container.innerHTML = `<div class="content-box">Ви ще не публікували подій.</div>`;
            return;
        }

        const categoryMapping = {
            "donate": "Донат",
            "ecology": "Екологія",
            "military": "Військове",
            "help": "Допомога",
            "education": "Освіта",
            "medicine": "Медицина",
            "community": "Громадська діяльність",
            "social": "Соціальні ініціативи",
            "emergency": "Надзвичайні ситуації",
            "mental-health": "Психологічна підтримка",
            "human-rights": "Права людини",
            "reconstruction": "Відновлення інфраструктури"
        };

        let html = events
            .map(
                (event) => `
           <div class="event-item" id="event-${event.id}">
                <div class="event-header">
                    <h3 class="event-title">${event.title}</h3>
                    <span class="event-date">${event.start_date} - ${event.end_date}</span>
                </div>
                <p><strong>Місце:</strong> ${event.location_full}</p>
                <p><strong>Категорія:</strong> ${categoryMapping[event.category] || event.category}</p>
                <p><strong>Email:</strong> ${event.email}</p>
                 <p><strong>Потрібно людей:</strong> ${event.people_needed}</p>
                <p class="event-description">${event.description}</p>
                
                <button class="event-btn delete-btn" data-id="${event.id}">Видалити</button>
           </div>
        `
            )
            .join("");

        container.innerHTML = html;

        
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", async function () {
                let eventId = this.getAttribute("data-id");
                await deleteEvent(eventId);
            });
        });

    } catch (error) {
        console.error("Помилка:", error);
        document.getElementById("published").innerHTML = `<div class="content-box">Не вдалося завантажити події.</div>`;
    }
}


async function deleteEvent(eventId) {
    if (!confirm("Ви впевнені, що хочете видалити цю подію?")) {
        return;
    }

    try {
        let response = await fetch(`https://newhandy-4b950124bf06.herokuapp.com/delete/${eventId}/`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Не вдалося видалити подію");
        }

        
        document.getElementById(`event-${eventId}`).remove();
        alert("Подію успішно видалено!");
    } catch (error) {
        console.error("Помилка:", error);
        alert("Не вдалося видалити подію.");
    }
}


async function loadSubscribedEvents() { 
    try {
        let response = await fetch("https://newhandy-4b950124bf06.herokuapp.com/my-subscriptions/", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Помилка завантаження підписок");
        }

        let events = await response.json();
        let container = document.getElementById("helped");

        if (events.length === 0) {
            container.innerHTML = `<div class="content-box">Ви ще не підписалися на жодну подію.</div>`;
            return;
        }

        let html = events
            .map(
                (event) => `
           <div class="event-item" id="event-${event.id}">
                <div class="event-header">
                    <h3 class="event-title">${event.title}</h3>
                    <span class="event-date">${event.start_date} - ${event.end_date}</span>
                </div>
                <img class="event-img" src="https://newhandy-4b950124bf06.herokuapp.com${event.image}" alt="${event.title}">
                <p><strong>Місце:</strong> ${event.location_full}</p>
                <p><strong>Категорія:</strong> ${event.category}</p>
                <p><strong>Email:</strong> ${event.email}</p>
                <p><strong>Номер телефона:</strong> ${event.phone_number}</p>
                <p class="event-description">${event.description}</p>
                <p><strong>Потрібно людей:</strong> ${event.people_needed}</p>
                
                <button class="event-btn unsubscribe-btn" data-id="${event.id}">Відписатися</button>
           </div>
        `
            )
            .join("");

        container.innerHTML = html;

        
        document.querySelectorAll(".unsubscribe-btn").forEach((button) => {
            button.addEventListener("click", async function () {
                let eventId = this.getAttribute("data-id");
                await unsubscribe(eventId);
                document.getElementById(`event-${eventId}`).remove(); 
            });
        });

    } catch (error) {
        console.error("Помилка:", error);
        document.getElementById("helped").innerHTML = `<div class="content-box">Не вдалося завантажити події.</div>`;
    }
}


async function unsubscribe(eventId) {
    if (!confirm("Ви впевнені, що хочете відписатися?")) {
        return;
    }

    try {
        let response = await fetch(`https://newhandy-4b950124bf06.herokuapp.com/unsubscribe/${eventId}/`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Не вдалося відписатися від події");
        }

        
        document.getElementById(`event-${eventId}`).remove();
        alert("Ви успішно відписалися від події!");

    } catch (error) {
        console.error("Помилка відписки:", error);
        alert("Не вдалося відписатися. Спробуйте ще раз.");
    }
}

document.getElementById("editNameBtn").addEventListener("click", function() {
    let nameDisplay = document.getElementById("userName");
    let nameInput = document.getElementById("nameInput");
    let photoInput = document.getElementById("photoInput");
    let profilePhoto = document.getElementById("profilePhoto");
    if (nameInput.style.display === "none") {
       
        nameInput.value = nameDisplay.textContent;
        nameDisplay.style.display = "none";
        nameInput.style.display = "block";
        nameInput.focus();
        
        photoInput.style.display = "block";
        this.textContent = "Зберегти";
       
        if (!document.getElementById("cancelNameBtn")) {
            let cancelBtn = document.createElement("button");
            cancelBtn.textContent = "Скасувати";
            cancelBtn.classList.add("edit-btn", "cancel-btn");
            cancelBtn.id = "cancelNameBtn";
            cancelBtn.style.marginLeft = "10px";
            this.parentNode.appendChild(cancelBtn);
            
            cancelBtn.addEventListener("click", function() {
                nameInput.style.display = "none";
                nameDisplay.style.display = "block";
                
                photoInput.style.display = "none";
                document.getElementById("editNameBtn").textContent = "Редагувати";
                cancelBtn.remove();
            });
        }
        
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
       
        nameDisplay.textContent = nameInput.value;
        nameInput.style.display = "none";
        nameDisplay.style.display = "block";
        
        photoInput.style.display = "none";
        this.textContent = "Редагувати";
        
        let cancelBtn = document.getElementById("cancelNameBtn");
        if (cancelBtn) cancelBtn.remove();
    }
});

document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
        let inputField = this.previousElementSibling;
        if (inputField.tagName === 'INPUT') {
            if (inputField.disabled) {
                
                inputField.dataset.originalValue = inputField.value;
                inputField.disabled = false;
                inputField.focus();
                this.textContent = 'Зберегти';

                if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('cancel-btn')) {
                    let cancelBtn = document.createElement('button');
                    cancelBtn.textContent = 'Скасувати';
                    cancelBtn.classList.add('edit-btn', 'cancel-btn');
                    cancelBtn.style.marginLeft = '10px';
                    this.parentNode.appendChild(cancelBtn);

                    cancelBtn.addEventListener('click', function() {
                        inputField.value = inputField.dataset.originalValue;
                        inputField.disabled = true;
                        btn.textContent = 'Редагувати';
                        cancelBtn.remove();
                    });
                }
            } else {
                
                inputField.disabled = true;
                this.textContent = 'Редагувати';

                if (this.nextElementSibling && this.nextElementSibling.classList.contains('cancel-btn')) {
                    this.nextElementSibling.remove();
                }

                
                let updatedData = {
                    first_name: document.getElementById('first_name').value,
                    last_name: document.getElementById('last_name').value,
                    email: document.getElementById('email').value,
                    phone_number: document.getElementById('number_phone').value,
                    description: document.getElementById('content').value
                };

                const token = localStorage.getItem('access_token'); 

                try {
                    let response = await fetch('https://newhandy-4b950124bf06.herokuapp.com/update-profile/', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedData)
                    });

                    let result = await response.json();
                    if (response.ok) {
                        alert('Профіль оновлено успішно!');
                    } else {
                        alert('Помилка оновлення: ' + result.error);
                    }
                } catch (error) {
                    console.error('Помилка:', error);
                }
            }
        }
    });
});


document.getElementById("photoInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            document.getElementById("profilePhoto").src = e.target.result;

            const token = localStorage.getItem('access_token');

            try {
                let response = await fetch('https://newhandy-4b950124bf06.herokuapp.com/update-profile/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ profile_picture: e.target.result })
                });

                let result = await response.json();
                if (response.ok) {
                    alert('Фото оновлено!');
                } else {
                    alert('Помилка оновлення фото: ' + result.error);
                }
            } catch (error) {
                console.error('Помилка:', error);
            }
        };
        reader.readAsDataURL(file);
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const accessToken = localStorage.getItem("access_token"); 
    if (!accessToken) {
        alert("Будь ласка, увійдіть у свій акаунт.");
        window.location.href = "login.html"; 
        return;
    }

    fetch("https://newhandy-4b950124bf06.herokuapp.com/profile/", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Помилка отримання профілю");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("userName").textContent = `${data.first_name} ${data.last_name}`;
        document.getElementById("email").value = data.email;
        document.getElementById("number_phone").value = data.phone_number;
        document.getElementById("first_name").value = data.first_name;
        document.getElementById("last_name").value = data.last_name;

        if (data.profile_picture) {
            document.getElementById("profilePhoto").src = `https://newhandy-4b950124bf06.herokuapp.com${data.profile_picture}`;
        }

        if (data.description) {
            document.getElementById("content").value = data.description;
        }
    })
    .catch(error => {
        console.error("Помилка:", error);
    });
});



document.getElementById('help-btn').addEventListener('click', function() {
    window.location.href = 'add-event.html';
});




async function loadUserComments() {
    try {
        let response = await fetch("https://newhandy-4b950124bf06.herokuapp.com/comments/", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
                "Content-Type": "application/json",
            },
        });
    
        if (!response.ok) {
            throw new Error("Помилка завантаження коментарів");
        }
    
        let comments = await response.json();
        console.log(comments); 
    
        const reviewsContainer = document.getElementById("reviews");
        if (!reviewsContainer) {
            console.error("Помилка: контейнер 'reviews' не знайдено!");
            return;
        }
    
        reviewsContainer.innerHTML = ""; 
    
        if (comments.length === 0) {
            reviewsContainer.innerHTML = `<div class="content-box">Немає коментарів.</div>`;
            return;
        }
    
        comments.forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("content-box");
    
            commentElement.innerHTML = `
                <div class="review-item">
                    <img src="https://newhandy-4b950124bf06.herokuapp.com${comment.author_profile_picture}" alt="User Avatar" class="user-avatar">
                    <div class="review-content">
                        <span class="user-name">${comment.author_first_name} ${comment.author_last_name}</span>
                        <p class="review-text">${comment.text}</p>
                        <small>${new Date(comment.created_at).toLocaleString()}</small>
                    </div>
                </div>
            `;
    
            reviewsContainer.appendChild(commentElement);
        });
    
    } catch (error) {
        console.error("Помилка:", error);
        document.getElementById("reviews").innerHTML = `<div class="content-box">Не вдалося завантажити коментарі.</div>`;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    loadUserComments();
});
