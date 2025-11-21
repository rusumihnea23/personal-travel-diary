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
var travelLogs = [];
const travelModal = new bootstrap.Modal(document.getElementById('addTravelPopup'));
addTravelButton.addEventListener('click', () => {
  travelModal.show();
});


let saveTravelButton = document.getElementById('Save-Button');
saveTravelButton.addEventListener('click', () => {
  console.log('merge');
  //travelModal.dispose();
  let travelLog = {};
  travelLog.Country = document.getElementById("Country").value;
  travelLog.tripType = document.getElementById("tripType").value;
  travelLog.BeginningDate = document.getElementById("beginningDate").value;
  travelLog.EndingDate = document.getElementById("endDate").value;
  let activities = [];
  if (document.getElementById('activity1').checked) activities.push(document.getElementById('activity1').value);
  if (document.getElementById('activity2').checked) activities.push(document.getElementById('activity2').value);
  if (document.getElementById('activity3').checked) activities.push(document.getElementById('activity3').value);
  if (document.getElementById('activity4').checked) activities.push(document.getElementById('activity4').value);
  if (document.getElementById('activity5').checked) activities.push(document.getElementById('activity5').value);
  if (document.getElementById('activity6').checked) activities.push(document.getElementById('activity6').value);
  travelLog.activities = activities;
  travelLog.Memories = document.getElementById('travelNotes').value;
  travelLog.Expenses = document.getElementById('expenses').value;

  travelLogs.push(travelLog);
  console.log(travelLogs);
  travelModal.hide();

  document.getElementById("Country").value = null;
  document.getElementById("tripType").value = null;
  document.getElementById("beginningDate").value = null;
  document.getElementById("endDate").value = null;
  document.getElementById('activity1').checked = false;
  document.getElementById('activity2').checked = false;
  document.getElementById('activity3').checked = false;
  document.getElementById('activity4').checked = false;
  document.getElementById('activity5').checked = false;
  document.getElementById('activity6').checked = false;
  document.getElementById('travelNotes').value = null;
  document.getElementById('expenses').value = null;



});



