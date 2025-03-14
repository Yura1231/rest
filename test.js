document.addEventListener('DOMContentLoaded', () => {
    const events = [
        {
            name: "Волонтерство у Львові",
            category: "Допомога",
            city: "Львів",
            district: "Личаківський",
            street: "вул. Чупринки, 110",
            startTime: "10:00",
            endTime: "14:00",
            phone: "+380123456789",
            email: "example@gmail.com",
            description: "Допомога у роздачі гуманітарної допомоги.",
            image: "https://via.placeholder.com/150"
        },
        {
            name: "Еко-акція у Львові",
            category: "Екологія",
            city: "Львів",
            district: "Франківський",
            street: "вул. Володимира Великого, 22",
            startTime: "09:00",
            endTime: "12:00",
            phone: "+380987654321",
            email: "eco-event@gmail.com",
            description: "Прибирання парків та скверів міста.",
            image: "https://via.placeholder.com/150"
        }
    ];

    const eventsList = document.getElementById('events-list');
    const categoryFilter = document.getElementById('category-filter');
    const defaultMessage = document.getElementById('default-message');

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
        "reconstruction": "Відновлення інфраструктури",
    };

    function filterEvents(category) {
        eventsList.innerHTML = ''; // Очищення списку перед оновленням
        let filteredEvents = events.filter(event => category === 'all' || categoryMapping[category] === event.category);

        if (filteredEvents.length > 0) {
            defaultMessage.style.display = 'none'; // Приховати дефолтний текст
            filteredEvents.forEach(event => {
                const eventCard = `
                    <div class="event-card">
                        <img src="${event.image}" alt="${event.name}">
                        <div class="event-content">
                            <h2>${event.name}</h2>
                            <p><strong>Категорія:</strong> ${event.category}</p>
                            <p><strong>Місце:</strong> ${event.city}, ${event.district}, ${event.street}</p>
                            <p><strong>Час:</strong> ${event.startTime} - ${event.endTime}</p>
                            <p><strong>Телефон:</strong> ${event.phone}</p>
                            <p><strong>Email:</strong> ${event.email}</p>
                            <p><strong>Опис:</strong> ${event.description}</p>
                        </div>
                    </div>
                `;
                eventsList.innerHTML += eventCard;
            });
        } else {
            defaultMessage.style.display = 'block'; // Показати дефолтний текст
        }
    }

    categoryFilter.addEventListener('change', () => {
        eventsList.style.opacity = '0'; // Плавне зникнення перед оновленням
        setTimeout(() => {
            filterEvents(categoryFilter.value);
            eventsList.style.opacity = '1'; // Плавне повернення
        }, 300);
    });

    filterEvents('all'); // Виклик функції при завантаженні сторінки
});
