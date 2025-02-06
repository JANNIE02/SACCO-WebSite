// News Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // News Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('.news-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
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

    // School Calendar Functionality
    const calendar = document.querySelector('.calendar-container');
    if (calendar) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const renderCalendar = (month, year) => {
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startingDay = firstDay.getDay();
            const monthLength = lastDay.getDate();

            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];

            let calendarHTML = `
                <div class="calendar-header">
                    <button class="prev-month"><i class="fas fa-chevron-left"></i></button>
                    <h3>${monthNames[month]} ${year}</h3>
                    <button class="next-month"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="calendar-grid">
                    <div class="weekday">Sun</div>
                    <div class="weekday">Mon</div>
                    <div class="weekday">Tue</div>
                    <div class="weekday">Wed</div>
                    <div class="weekday">Thu</div>
                    <div class="weekday">Fri</div>
                    <div class="weekday">Sat</div>
            `;

            let day = 1;
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < startingDay) {
                        calendarHTML += '<div class="calendar-day empty"></div>';
                    } else if (day > monthLength) {
                        calendarHTML += '<div class="calendar-day empty"></div>';
                    } else {
                        const isToday = day === currentDate.getDate() && 
                                      month === currentDate.getMonth() && 
                                      year === currentDate.getFullYear();
                        calendarHTML += `
                            <div class="calendar-day ${isToday ? 'today' : ''}">
                                <span class="date">${day}</span>
                            </div>
                        `;
                        day++;
                    }
                }
            }

            calendarHTML += '</div>';
            calendar.innerHTML = calendarHTML;

            // Add event listeners for month navigation
            const prevButton = calendar.querySelector('.prev-month');
            const nextButton = calendar.querySelector('.next-month');

            prevButton.addEventListener('click', () => {
                const newMonth = month === 0 ? 11 : month - 1;
                const newYear = month === 0 ? year - 1 : year;
                renderCalendar(newMonth, newYear);
            });

            nextButton.addEventListener('click', () => {
                const newMonth = month === 11 ? 0 : month + 1;
                const newYear = month === 11 ? year + 1 : year;
                renderCalendar(newMonth, newYear);
            });
        };

        renderCalendar(currentMonth, currentYear);
    }

    // Animate news items on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const newsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    newsItems.forEach(item => newsObserver.observe(item));
});