document.addEventListener('DOMContentLoaded', () => {
    const events = [
        {
            name: "Гуманітарна допомога",
            description: "Збір гуманітарної допомоги в натуральній формі (продукти, ліки, засоби гігієни тощо).",
            category: "Допомога",
            city: "Львів",
            district: "Сихів",
            "start-date": "12.02.25",
            "end-date": "12.02.25",
            author: {
                name: "Іван Іванов",
                profilePic: "images/cart1.jpg"
            },
            image: "images/cart3.jpg"
        },
        {
            name: "Еко-акція у Львові",
            category: "Екологія",
            city: "Львів",
            district: "Франківський",
            "start-date": "12.02.25",
            "end-date": "12.02.25",
            description: "Прибирання парків та скверів міста.",
            author: {
                name: "Богданна Петрененко",
                profilePic: "images/cart3.jpg"
            },
            image: "images/cart1.jpg"
        },
        {
            name: "Еко-акція у Львові",
            category: "Відновлення інфраструктури",
            city: "Львів",
            district: "Личаківський",
            "start-date": "12.02.25",
            "end-date": "12.02.25",
            description: "Відновлення соціальної (школи, бібліотеки, театри, стадіони) інфраструктури.",
            author: {
                name: "Марія Петренко",
                profilePic: "images/cart3.jpg"
            },
            image: "images/cart1.jpg"
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
        "reconstruction": "Відновлення інфраструктури"
    };

    function createEventCard(event) {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
    
        const subscribeButton = document.createElement('button');
        subscribeButton.classList.add('subscribe-button');
        subscribeButton.textContent = 'Підписатися';
    
        subscribeButton.addEventListener('click', () => {
            if (subscribeButton.textContent === 'Підписатися') {
                subscribeButton.textContent = 'Відписатися';
                subscribeButton.classList.replace('subscribe-button', 'unsubscribe-button');
            } else {
                subscribeButton.textContent = 'Підписатися';
                subscribeButton.classList.replace('unsubscribe-button', 'subscribe-button');
            }
        });
    
        eventCard.innerHTML = `
            <img class="event-image" src="${event.image}" alt="Event Image">
            <div class="event-content">
                <h3 class="event-name">${event.name}</h3>
                <div class="event-description-container">
                    <p class="event-description">${event.description}</p>
                </div>
                <div class="event-details-container">
                    <div class="event-details">
                        <p class="event-location">${event.city}, ${event.district}</p>
                        <p class="event-dates">${event["start-date"]} - ${event["end-date"]}</p>
                    </div>
                    <div class="event-details">
                        <p class="event-category">${event.category}</p>
                        <div class="event-author">
                            <img class="author-pic" src="${event.author.profilePic}" alt="${event.author.name}">
                            <span class="author-name">${event.author.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    
        const eventDetails = eventCard.querySelector('.event-details-container');
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('subscribe-button-container');
        buttonContainer.appendChild(subscribeButton);
        eventDetails.appendChild(buttonContainer);
    
        return eventCard;
    }

    function filterEvents(category) {
        eventsList.innerHTML = '';
        let filteredEvents = events.filter(event => category === 'all' || categoryMapping[category] === event.category);

        if (filteredEvents.length > 0) {
            defaultMessage.style.display = 'none';
            filteredEvents.forEach(event => eventsList.appendChild(createEventCard(event)));
        } else {
            defaultMessage.style.display = 'block';
        }
    }

    categoryFilter.addEventListener('change', () => {
        eventsList.style.opacity = '0';
        setTimeout(() => {
            filterEvents(categoryFilter.value);
            eventsList.style.opacity = '1';
        }, 300);
    });

    filterEvents('all');
});
