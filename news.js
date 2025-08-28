document.addEventListener('DOMContentLoaded', function () {
  // ----------------------------
  // Section Filter Functionality
  // ----------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sections = {
    upcoming: document.querySelector('.upcoming-events'),
    past: document.querySelector('.past-events'),
    announcements: document.querySelector('.announcements'),
    videos: document.querySelector('.video-gallery')
    // calendar is always visible below; keep it separate if desired
  };

  function showSection(key) {
    Object.values(sections).forEach(sec => { if (sec) sec.style.display = 'none'; });
    if (sections[key]) sections[key].style.display = 'block';
  }

  // initial state
  showSection('upcoming');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-filter');
      showSection(key);
      // Pause any playing inline videos when switching
      document.querySelectorAll('.video-container video').forEach(v => { v.pause(); v.currentTime = 0; });
    });
  });

  // ----------------------------
  // Optional Dynamic Calendar list
  // ----------------------------
  const events = [
    { title: "School Reopening", date: "2025-01-10T08:00:00" },
    { title: "Sports Day", date: "2025-03-05T09:00:00" },
    { title: "Mid-Term Exams", date: "2025-03-20T07:30:00" },
    { title: "End of Term", date: "2025-04-15T12:00:00" }
  ];

  const calendarContainer = document.getElementById("calendar");
  const today = new Date();

  if (calendarContainer) {
    // If you want this visible, remove the display:none in HTML.
    // calendarContainer.style.display = 'block';
    events.forEach(event => {
      const eventDate = new Date(event.date);
      const isPast = eventDate < today;
      const eventClass = isPast ? "past-event" : "upcoming-event";

      const eventElement = document.createElement("div");
      eventElement.classList.add("calendar-event", eventClass);
      eventElement.innerHTML = `
        <h3>${event.title}</h3>
        <p>${eventDate.toDateString()} at ${eventDate.toLocaleTimeString()}</p>
        <button class="add-to-calendar">Add to Calendar</button>
      `;

      eventElement.querySelector('.add-to-calendar')
        .addEventListener('click', () => addToDeviceCalendar(event.title, event.date));

      calendarContainer.appendChild(eventElement);
    });
  }

  // ----------------------------
  // AOS
  // ----------------------------
  if (window.AOS) {
    AOS.init({ duration: 800, once: true });
  }

  // ----------------------------
  // Video Modal (single implementation)
  // ----------------------------
  const videoModal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const closeModal = document.getElementById('closeModal');

  function openVideoModal(videoSrc) {
    modalVideo.src = videoSrc;
    videoModal.style.display = 'flex';
    videoModal.setAttribute('aria-hidden', 'false');
    modalVideo.play();
  }

  function closeVideoModal() {
    videoModal.style.display = 'none';
    videoModal.setAttribute('aria-hidden', 'true');
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = '';
  }

  // Open modal from play overlay buttons
  document.querySelectorAll('.play-button').forEach(button => {
    button.addEventListener('click', () => {
      const videoSrc = button.getAttribute('data-video');
      // Pause inline/featured videos before opening modal
      document.querySelectorAll('video').forEach(v => { v.pause(); });
      openVideoModal(videoSrc);
    });
  });

  // Close events
  closeModal.addEventListener('click', closeVideoModal);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
  });

  // ----------------------------
  // Smooth scroll for same-page anchors
  // ----------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ----------------------------
  // Image load micro-interaction
  // ----------------------------
  document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.98)';
    img.addEventListener('load', function () {
      this.style.transition = 'opacity .4s ease, transform .4s ease';
      this.style.opacity = '1';
      this.style.transform = 'scale(1)';
    });
  });

  // ----------------------------
  // Intersection Observer reveal
  // ----------------------------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.news-item, .video-item').forEach(item => observer.observe(item));

  // ----------------------------
  // Calendar Tabs
  // ----------------------------
  const calendarTabs = document.querySelectorAll('.calendar-tab');
  const termCalendars = document.querySelectorAll('.term-calendar');

  calendarTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      calendarTabs.forEach(t => t.classList.remove('active'));
      termCalendars.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const termId = tab.getAttribute('data-term');
      const target = document.getElementById(termId);
      if (target) target.classList.add('active');
    });
  });
});

// ----------------------------
// Add to Device Calendar
// ----------------------------
function addToDeviceCalendar(title, date) {
  const eventDate = new Date(date);
  const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
  const endDate = new Date(eventDate.getTime() + (60 * 60 * 1000)).toISOString().replace(/-|:|\.\d+/g, '');

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}`;

  const icsData =
`BEGIN:VCALENDAR
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

  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      showReminder(title, eventDate);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") showReminder(title, eventDate);
      });
    }
  }
}

function showReminder(title, eventDate) {
  try {
    new Notification(`Reminder: ${title}`, {
      body: `This event is on ${eventDate.toDateString()} at ${eventDate.toLocaleTimeString()}`,
      icon: "Assets/Images/logo.PNG"
    });
  } catch (_) { /* Notifications not supported */ }
}
