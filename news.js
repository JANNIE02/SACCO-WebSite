document.addEventListener('DOMContentLoaded', function() {
    // News Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('.news-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            newsItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 500);
                }
            });
        });
    });

    // JavaScript for Dynamic Calendar
    const events = [
        { title: "School Reopening", date: "2025-01-10T08:00:00" },
        { title: "Sports Day", date: "2025-03-05T09:00:00" },
        { title: "Mid-Term Exams", date: "2025-03-20T07:30:00" },
        { title: "End of Term", date: "2025-04-15T12:00:00" }
    ];

    const calendarContainer = document.getElementById("calendar");
    const today = new Date();

    if (calendarContainer) {
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const isPast = eventDate < today;
            const eventClass = isPast ? "past-event" : "upcoming-event";

            const eventElement = document.createElement("div");
            eventElement.classList.add("calendar-event", eventClass);
            eventElement.innerHTML = `
                <h3>${event.title}</h3>
                <p>${eventDate.toDateString()} at ${eventDate.toLocaleTimeString()}</p>
                <button class="add-to-calendar" onclick="addToDeviceCalendar('${event.title}', '${event.date}')">Add to Calendar</button>
            `;

            calendarContainer.appendChild(eventElement);
        });
    }

});

// Function to Add to Calendar
function addToDeviceCalendar(title, date) {
    const eventDate = new Date(date);
    const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(eventDate.getTime() + (60 * 60 * 1000)).toISOString().replace(/-|:|\.\d+/g, '');

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}`;

    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${startDate}
DTEND:${endDate}
DESCRIPTION:School event - ${title}
END:VEVENT
END:VCALENDAR`;

    const icsBlob = new Blob([icsData], { type: 'text/calendar' });
    const icsUrl = URL.createObjectURL(icsBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = icsUrl;
    downloadLink.download = `${title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(icsUrl);

    window.open(googleCalendarUrl, "_blank");

    if (Notification.permission === "granted") {
        showReminder(title, eventDate);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showReminder(title, eventDate);
            }
        });
    }
}

// Function to Show Notification Reminder
function showReminder(title, eventDate) {
    new Notification(`Reminder: ${title}`, {
        body: `This event is on ${eventDate.toDateString()} at ${eventDate.toLocaleTimeString()}`,
        icon: "Assets/Images/logo.PNG"
    });
}
