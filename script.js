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
var map = L.map('map').setView([55.505, 15.09], 3);
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

//The list of ISO Countries 
const countryList = [
  {
    region: "world",
    countries: [
      { name: "Afghanistan", iso: "AF" },
      { name: "Åland Islands", iso: "AX" },
      { name: "Albania", iso: "AL" },
      { name: "Algeria", iso: "DZ" },
      { name: "American Samoa", iso: "AS" },
      { name: "Andorra", iso: "AD" },
      { name: "Angola", iso: "AO" },
      { name: "Anguilla", iso: "AI" },
      { name: "Antarctica", iso: "AQ" },
      { name: "Antigua and Barbuda", iso: "AG" },
      { name: "Argentina", iso: "AR" },
      { name: "Armenia", iso: "AM" },
      { name: "Aruba", iso: "AW" },
      { name: "Australia", iso: "AU" },
      { name: "Austria", iso: "AT" },
      { name: "Azerbaijan", iso: "AZ" },
      { name: "Bahamas", iso: "BS" },
      { name: "Bahrain", iso: "BH" },
      { name: "Bangladesh", iso: "BD" },
      { name: "Barbados", iso: "BB" },
      { name: "Belarus", iso: "BY" },
      { name: "Belgium", iso: "BE" },
      { name: "Belize", iso: "BZ" },
      { name: "Benin", iso: "BJ" },
      { name: "Bermuda", iso: "BM" },
      { name: "Bhutan", iso: "BT" },
      { name: "Bolivia", iso: "BO" },
      { name: "Bonaire, Sint Eustatius and Saba", iso: "BQ" },
      { name: "Bosnia and Herzegovina", iso: "BA" },
      { name: "Botswana", iso: "BW" },
      { name: "Bouvet Island", iso: "BV" },
      { name: "Brazil", iso: "BR" },
      { name: "British Indian Ocean Territory", iso: "IO" },
      { name: "Brunei Darussalam", iso: "BN" },
      { name: "Bulgaria", iso: "BG" },
      { name: "Burkina Faso", iso: "BF" },
      { name: "Burundi", iso: "BI" },
      { name: "Cabo Verde", iso: "CV" },
      { name: "Cambodia", iso: "KH" },
      { name: "Cameroon", iso: "CM" },
      { name: "Canada", iso: "CA" },
      { name: "Cayman Islands", iso: "KY" },
      { name: "Central African Republic", iso: "CF" },
      { name: "Chad", iso: "TD" },
      { name: "Chile", iso: "CL" },
      { name: "China", iso: "CN" },
      { name: "Christmas Island", iso: "CX" },
      { name: "Cocos (Keeling) Islands", iso: "CC" },
      { name: "Colombia", iso: "CO" },
      { name: "Comoros", iso: "KM" },
      { name: "Congo", iso: "CG" },
      { name: "Congo, Democratic Republic of the", iso: "CD" },
      { name: "Cook Islands", iso: "CK" },
      { name: "Costa Rica", iso: "CR" },
      { name: "Côte d'Ivoire", iso: "CI" },
      { name: "Croatia", iso: "HR" },
      { name: "Cuba", iso: "CU" },
      { name: "Curaçao", iso: "CW" },
      { name: "Cyprus", iso: "CY" },
      { name: "Czechia", iso: "CZ" },
      { name: "Denmark", iso: "DK" },
      { name: "Djibouti", iso: "DJ" },
      { name: "Dominica", iso: "DM" },
      { name: "Dominican Republic", iso: "DO" },
      { name: "Ecuador", iso: "EC" },
      { name: "Egypt", iso: "EG" },
      { name: "El Salvador", iso: "SV" },
      { name: "Equatorial Guinea", iso: "GQ" },
      { name: "Eritrea", iso: "ER" },
      { name: "Estonia", iso: "EE" },
      { name: "Eswatini", iso: "SZ" },
      { name: "Ethiopia", iso: "ET" },
      { name: "Falkland Islands (Malvinas)", iso: "FK" },
      { name: "Faroe Islands", iso: "FO" },
      { name: "Fiji", iso: "FJ" },
      { name: "Finland", iso: "FI" },
      { name: "France", iso: "FR" },
      { name: "French Guiana", iso: "GF" },
      { name: "French Polynesia", iso: "PF" },
      { name: "French Southern Territories", iso: "TF" },
      { name: "Gabon", iso: "GA" },
      { name: "Gambia", iso: "GM" },
      { name: "Georgia", iso: "GE" },
      { name: "Germany", iso: "DE" },
      { name: "Ghana", iso: "GH" },
      { name: "Gibraltar", iso: "GI" },
      { name: "Greece", iso: "GR" },
      { name: "Greenland", iso: "GL" },
      { name: "Grenada", iso: "GD" },
      { name: "Guadeloupe", iso: "GP" },
      { name: "Guam", iso: "GU" },
      { name: "Guatemala", iso: "GT" },
      { name: "Guernsey", iso: "GG" },
      { name: "Guinea", iso: "GN" },
      { name: "Guinea-Bissau", iso: "GW" },
      { name: "Guyana", iso: "GY" },
      { name: "Haiti", iso: "HT" },
      { name: "Heard Island and McDonald Islands", iso: "HM" },
      { name: "Holy See", iso: "VA" },
      { name: "Honduras", iso: "HN" },
      { name: "Hong Kong", iso: "HK" },
      { name: "Hungary", iso: "HU" },
      { name: "Iceland", iso: "IS" },
      { name: "India", iso: "IN" },
      { name: "Indonesia", iso: "ID" },
      { name: "Iran", iso: "IR" },
      { name: "Iraq", iso: "IQ" },
      { name: "Ireland", iso: "IE" },
      { name: "Isle of Man", iso: "IM" },
      { name: "Israel", iso: "IL" },
      { name: "Italy", iso: "IT" },
      { name: "Jamaica", iso: "JM" },
      { name: "Japan", iso: "JP" },
      { name: "Jersey", iso: "JE" },
      { name: "Jordan", iso: "JO" },
      { name: "Kazakhstan", iso: "KZ" },
      { name: "Kenya", iso: "KE" },
      { name: "Kiribati", iso: "KI" },
      { name: "Korea (North)", iso: "KP" },
      { name: "Korea (South)", iso: "KR" },
      { name: "Kuwait", iso: "KW" },
      { name: "Kyrgyzstan", iso: "KG" },
      { name: "Laos", iso: "LA" },
      { name: "Latvia", iso: "LV" },
      { name: "Lebanon", iso: "LB" },
      { name: "Lesotho", iso: "LS" },
      { name: "Liberia", iso: "LR" },
      { name: "Libya", iso: "LY" },
      { name: "Liechtenstein", iso: "LI" },
      { name: "Lithuania", iso: "LT" },
      { name: "Luxembourg", iso: "LU" },
      { name: "Macao", iso: "MO" },
      { name: "Madagascar", iso: "MG" },
      { name: "Malawi", iso: "MW" },
      { name: "Malaysia", iso: "MY" },
      { name: "Maldives", iso: "MV" },
      { name: "Mali", iso: "ML" },
      { name: "Malta", iso: "MT" },
      { name: "Marshall Islands", iso: "MH" },
      { name: "Martinique", iso: "MQ" },
      { name: "Mauritania", iso: "MR" },
      { name: "Mauritius", iso: "MU" },
      { name: "Mayotte", iso: "YT" },
      { name: "Mexico", iso: "MX" },
      { name: "Micronesia", iso: "FM" },
      { name: "Moldova", iso: "MD" },
      { name: "Monaco", iso: "MC" },
      { name: "Mongolia", iso: "MN" },
      { name: "Montenegro", iso: "ME" },
      { name: "Montserrat", iso: "MS" },
      { name: "Morocco", iso: "MA" },
      { name: "Mozambique", iso: "MZ" },
      { name: "Myanmar", iso: "MM" },
      { name: "Namibia", iso: "NA" },
      { name: "Nauru", iso: "NR" },
      { name: "Nepal", iso: "NP" },
      { name: "Netherlands", iso: "NL" },
      { name: "New Caledonia", iso: "NC" },
      { name: "New Zealand", iso: "NZ" },
      { name: "Nicaragua", iso: "NI" },
      { name: "Niger", iso: "NE" },
      { name: "Nigeria", iso: "NG" },
      { name: "Niue", iso: "NU" },
      { name: "Norfolk Island", iso: "NF" },
      { name: "North Macedonia", iso: "MK" },
      { name: "Northern Mariana Islands", iso: "MP" },
      { name: "Norway", iso: "NO" },
      { name: "Oman", iso: "OM" },
      { name: "Pakistan", iso: "PK" },
      { name: "Palau", iso: "PW" },
      { name: "Palestine", iso: "PS" },
      { name: "Panama", iso: "PA" },
      { name: "Papua New Guinea", iso: "PG" },
      { name: "Paraguay", iso: "PY" },
      { name: "Peru", iso: "PE" },
      { name: "Philippines", iso: "PH" },
      { name: "Pitcairn", iso: "PN" },
      { name: "Poland", iso: "PL" },
      { name: "Portugal", iso: "PT" },
      { name: "Puerto Rico", iso: "PR" },
      { name: "Qatar", iso: "QA" },
      { name: "Réunion", iso: "RE" },
      { name: "Romania", iso: "RO" },
      { name: "Russia", iso: "RU" },
      { name: "Rwanda", iso: "RW" },
      { name: "Saint Barthélemy", iso: "BL" },
      { name: "Saint Helena, Ascension and Tristan da Cunha", iso: "SH" },
      { name: "Saint Kitts and Nevis", iso: "KN" },
      { name: "Saint Lucia", iso: "LC" },
      { name: "Saint Martin (French part)", iso: "MF" },
      { name: "Saint Pierre and Miquelon", iso: "PM" },
      { name: "Saint Vincent and the Grenadines", iso: "VC" },
      { name: "Samoa", iso: "WS" },
      { name: "San Marino", iso: "SM" },
      { name: "Sao Tome and Principe", iso: "ST" },
      { name: "Saudi Arabia", iso: "SA" },
      { name: "Senegal", iso: "SN" },
      { name: "Serbia", iso: "RS" },
      { name: "Seychelles", iso: "SC" },
      { name: "Sierra Leone", iso: "SL" },
      { name: "Singapore", iso: "SG" },
      { name: "Sint Maarten (Dutch part)", iso: "SX" },
      { name: "Slovakia", iso: "SK" },
      { name: "Slovenia", iso: "SI" },
      { name: "Solomon Islands", iso: "SB" },
      { name: "Somalia", iso: "SO" },
      { name: "South Africa", iso: "ZA" },
      { name: "South Georgia and the South Sandwich Islands", iso: "GS" },
      { name: "South Sudan", iso: "SS" },
      { name: "Spain", iso: "ES" },
      { name: "Sri Lanka", iso: "LK" },
      { name: "Sudan", iso: "SD" },
      { name: "Suriname", iso: "SR" },
      { name: "Svalbard and Jan Mayen", iso: "SJ" },
      { name: "Sweden", iso: "SE" },
      { name: "Switzerland", iso: "CH" },
      { name: "Syria", iso: "SY" },
      { name: "Taiwan", iso: "TW" },
      { name: "Tajikistan", iso: "TJ" },
      { name: "Tanzania", iso: "TZ" },
      { name: "Thailand", iso: "TH" },
      { name: "Timor-Leste", iso: "TL" },
      { name: "Togo", iso: "TG" },
      { name: "Tokelau", iso: "TK" },
      { name: "Tonga", iso: "TO" },
      { name: "Trinidad and Tobago", iso: "TT" },
      { name: "Tunisia", iso: "TN" },
      { name: "Turkey", iso: "TR" },
      { name: "Turkmenistan", iso: "TM" },
      { name: "Turks and Caicos Islands", iso: "TC" },
      { name: "Tuvalu", iso: "TV" },
      { name: "Uganda", iso: "UG" },
      { name: "Ukraine", iso: "UA" },
      { name: "United Arab Emirates", iso: "AE" },
      { name: "United Kingdom", iso: "GB" },
      { name: "United States of America", iso: "US" },
      { name: "United States Minor Outlying Islands", iso: "UM" },
      { name: "Uruguay", iso: "UY" },
      { name: "Uzbekistan", iso: "UZ" },
      { name: "Vanuatu", iso: "VU" },
      { name: "Venezuela", iso: "VE" },
      { name: "Vietnam", iso: "VN" },
      { name: "Virgin Islands (British)", iso: "VG" },
      { name: "Virgin Islands (U.S.)", iso: "VI" },
      { name: "Wallis and Futuna", iso: "WF" },
      { name: "Western Sahara", iso: "EH" },
      { name: "Yemen", iso: "YE" },
      { name: "Zambia", iso: "ZM" },
      { name: "Zimbabwe", iso: "ZW" }
    ]
  }
];

// Function that suggests countries when i type also i can press a country and select it
function showSuggestions() {
  const input = document.getElementById("Country").value.toLowerCase();//isn't case sensitive
  const suggestionBox = document.getElementById("country-suggestions");

  suggestionBox.innerHTML = "";
  if (!input) return;

  const allCountries = countryList[0].countries;

  const results = allCountries.filter(c =>
    c.name.toLowerCase().startsWith(input)
  );

  //creates a button for each country so i can select one
  results.forEach(country => {
    const item = document.createElement("button");
    item.className = "list-group-item list-group-item-action";
    item.textContent = `${country.name} (${country.iso})`;
    item.onclick = () => selectCountry(country.name, country.iso);
    suggestionBox.appendChild(item);
  });
}

//when a country is clicked it puts it in the input box+then after selection the dropdown menu dissapears
function selectCountry(name, iso) {
  document.getElementById("Country").value = name;
  document.getElementById("country-suggestions").innerHTML = "";
  document.getElementById("Country").dataset.iso = iso;
}

//map marker function
function addMarker(country) {
  fetch(`https://nominatim.openstreetmap.org/search?q=${country}&format=json&limit=1`)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        alert("Ai fost intr-un loc imaginar(Narnia)");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      const marker = L.marker([lat, lon]).addTo(map);
      // optional if i want the name of the country on top of the marker
      //marker.bindPopup(`<b>${country}</b>`).openPopup();
      map.setView([lat, lon], 5);
    })
    .catch(() => alert("Nu pot sa ma pun ajutor!"));
}

let saveTravelButton = document.getElementById('Save-Button');
saveTravelButton.addEventListener('click', () => {
  console.log('merge');
  //travelModal.dispose();
  if (!validateForm()) {
    return; // stop saving if invalid
  }
  let travelLog = {};
  travelLog.id = travelLogs.length + 1;
  travelLog.Country = document.getElementById("Country").value;
  travelLog.tripType = document.getElementById("tripType").value;
  travelLog.BeginningDate = document.getElementById("beginningDate").value;
  travelLog.EndingDate = document.getElementById("endDate").value;
  let activities = [];
  if (document.getElementById('activity1').checked) activities.push("Visited Landmarks");
  if (document.getElementById('activity2').checked) activities.push("Used public transport");
  if (document.getElementById('activity3').checked) activities.push("Tried Local Restaurants");
  if (document.getElementById('activity4').checked) activities.push("Went to the beach");
  if (document.getElementById('activity5').checked) activities.push("Took a trip to Lidl");
  if (document.getElementById('activity6').checked) activities.push("Ate at MCDonald's");
  travelLog.activities = activities;
  travelLog.Memories = document.getElementById('travelNotes').value;
  travelLog.Expenses = document.getElementById('expenses').value;

  travelLogs.push(travelLog);
  console.log(travelLogs);
  travelModal.hide();

  //put the marker in the country i have selected
  addMarker(travelLog.Country);

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
  LoadActivity();

});

function LoadActivity() {

  const log = travelLogs[travelLogs.length - 1];   // ← added
  const id = log.id;                               // ← added

  const dayDiv = document.createElement('div');
  dayDiv.className = 'accordion';
  dayDiv.id = `log-${id}`;                         // ← added (unique id for delete)

  dayDiv.innerHTML = `
  <div class="accordion-item">
    <h2 class="accordion-header" >
      <button class="accordion-button" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapse-${id}" aria-expanded="true">   <!-- ← changed -->
        ${log.Country} - ${log.BeginningDate} to ${log.EndingDate}
      </button>
    </h2>

    <div id="collapse-${id}" class="accordion-collapse collapse"
         data-bs-parent="#accordionExample">                  <!-- ← changed -->
      <div class="accordion-body">
        <strong>Trip Type:</strong> ${log.tripType} <br>
        <strong>Memories:</strong> ${log.Memories} <br>
        <strong>Activities:</strong> ${log.activities.join(', ')} <br>
        <strong>Expenses:</strong> ${log.Expenses} <br>

      
        <button class="btn btn-danger mt-2" onclick="deleteLog(${id})">
          Delete
        </button>
        

      </div>
    </div>
  </div>
  `;

  document.getElementById('travelLogsContainer').appendChild(dayDiv);
}

function deleteLog(id) {
  travelLogs = travelLogs.filter(log => log.id !== id);
  const element = document.getElementById(`log-${id}`);
  if (element) element.remove();
  console.log("Remaining logs:", travelLogs);
}

function validateForm() {
  let Form = document.getElementById("travelForm");
  let isValid = true;

  let startDate = document.getElementById("beginningDate");
  let endDate = document.getElementById("endDate");

  let country = document.getElementById("Country");
  if (country.value.trim() === "") {
    country.classList.add("is-invalid");
    isValid = false;
  } else {
    country.classList.remove("is-invalid");
  }

  if (startDate.value === "") {
    startDate.classList.add("is-invalid");
    isValid = false;
  } else {
    startDate.classList.remove("is-invalid");
  }

  if (endDate.value === "") {
    endDate.classList.add("is-invalid");
    isValid = false;
  } else if (endDate.value < startDate.value) {
    endDate.classList.add("is-invalid");
    endDate.nextElementSibling.textContent = "End date must be after start date.";
    isValid = false;
  } else {
    endDate.classList.remove("is-invalid");
    endDate.nextElementSibling.textContent = "Please choose an end date.";
  }
  return isValid;
}