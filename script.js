  const themeButton = document.getElementById('Theme-Button');
  const aboutButton = document.getElementById('About-Button');
  const body = document.body;

  // Theme-button
  themeButton.addEventListener('click', () => {
    body.classList.toggle('darkmode');
    if (body.classList.contains('darkmode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });

  // About-button opens popup
  aboutButton.addEventListener('click', () => {
    const aboutModal = new bootstrap.Modal(document.getElementById('aboutPopup'));
    aboutModal.show();
  });

  // LEAFLET
  var map = L.map('map').setView([51.505, -0.09], 13);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//LEAFLET END


//Add-Travel button opens a new popup
const addTravelButton = document.getElementById('AddTravel-Button');

addTravelButton.addEventListener('click', () => {
  const travelModal = new bootstrap.Modal(document.getElementById('addTravelPopup'));
  travelModal.show();
});
