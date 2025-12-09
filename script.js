const themeButton = document.getElementById('Theme-Button');
const aboutButton = document.getElementById('About-Button');
const body = document.body;

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
    item.textContent = `${country.name} ${country.iso}`;
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
var markers = L.featureGroup();
function addMarker(travelLog) {
  fetch(`https://nominatim.openstreetmap.org/search?q=${travelLog.Country}&format=json&limit=1`)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        alert("Ai fost intr-un loc imaginar(Narnia)");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);


      travelLog.Marker = L.marker([lat, lon]).addTo(map);;
      markers.addLayer(travelLog.Marker);
      // optional if i want the name of the country on top of the marker
      //marker.bindPopup(`<b>${country}</b>`).openPopup();
      map.fitBounds(markers.getBounds(), { padding: [50, 50], maxZoom: 5 });
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
  addMarker(travelLog);

  document.getElementById("Country").value = null;
  document.getElementById("tripType").value = document.getElementById("tripType").options[0].value;
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
        <strong>Memories:</strong> <p style="word-break: break-all;">${log.Memories}</p> <br>
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


  for (travelLog of travelLogs) {
    if (travelLog.id == id) {
      map.removeLayer(travelLog.Marker);
    }
  }
  travelLogs = travelLogs.filter(log => log.id !== id);
  const element = document.getElementById(`log-${id}`);
  if (element) element.remove();
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

//The list of ISO Countries - we know its not idel but its the only way without an API call
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
      { name: "Zimbabwe", iso: "ZW" },
      { name: "Tokyo", iso: "" },
      { name: "New Delhi", iso: "" },
      { name: "Beijing", iso: "" },
      { name: "London", iso: "" },
      { name: "Paris", iso: "" },
      { name: "Berlin", iso: "" },
      { name: "Rome", iso: "" },
      { name: "Moscow", iso: "" },
      { name: "Brasília", iso: "" },
      { name: "Buenos Aires", iso: "" },
      { name: "Cairo", iso: "" },
      { name: "Mexico City", iso: "" },
      { name: "Ottawa", iso: "" },
      { name: "Canberra", iso: "" },
      { name: "Pretoria", iso: "" },
      { name: "Seoul", iso: "" },
      { name: "Jakarta", iso: "" },
      { name: "Madrid", iso: "" },
      { name: "Amsterdam", iso: "" },
      { name: "Vienna", iso: "" },
      { name: "Lisbon", iso: "" },
      { name: "Helsinki", iso: "" },
      { name: "Stockholm", iso: "" },
      { name: "Warsaw", iso: "" },
      { name: "Bucharest", iso: "" },
      { name: "Athens", iso: "" },
      { name: "Dublin", iso: "" },
      { name: "Brussels", iso: "" },
      { name: "New York", iso: "" },
      { name: "Los Angeles", iso: "" },
      { name: "Chicago", iso: "" },
      { name: "Houston", iso: "" },
      { name: "Phoenix", iso: "" },
      { name: "Philadelphia", iso: "" },
      { name: "San Antonio", iso: "" },
      { name: "San Diego", iso: "" },
      { name: "Dallas", iso: "" },
      { name: "San Jose", iso: "" },
      { name: "Austin", iso: "" },
      { name: "Jacksonville", iso: "" },
      { name: "Fort Worth", iso: "" },
      { name: "Columbus", iso: "" },
      { name: "Charlotte", iso: "" },
      { name: "San Francisco", iso: "" },
      { name: "Indianapolis", iso: "" },
      { name: "Seattle", iso: "" },
      { name: "Denver", iso: "" },
      { name: "Washington", iso: "" },
      { name: "Boston", iso: "" },
      { name: "El Paso", iso: "" },
      { name: "Nashville", iso: "" },
      { name: "Detroit", iso: "" },
      { name: "Oklahoma City", iso: "" },
      { name: "Portland", iso: "" },
      { name: "Memphis", iso: "" },
      { name: "Las Vegas", iso: "" },
      { name: "Louisville", iso: "" },
      { name: "Baltimore", iso: "" },
      { name: "Milwaukee", iso: "" },
      { name: "Albuquerque", iso: "" },
      { name: "Tucson", iso: "" },
      { name: "Fresno", iso: "" },
      { name: "Sacramento", iso: "" },
      { name: "Mesa", iso: "" },
      { name: "Kansas City", iso: "" },
      { name: "Atlanta", iso: "" },
      { name: "Omaha", iso: "" },
      { name: "Colorado Springs", iso: "" },
      { name: "Raleigh", iso: "" },
      { name: "Miami", iso: "" },
      { name: "Virginia Beach", iso: "" },
      { name: "Oakland", iso: "" },
      { name: "Minneapolis", iso: "" },
      { name: "Tulsa", iso: "" },
      { name: "Wichita", iso: "" },
      { name: "New Orleans", iso: "" },
      { name: "Arlington", iso: "" },
      { name: "Tampa", iso: "" },
      { name: "Corpus Christi", iso: "" },
      { name: "Cleveland", iso: "" },
      { name: "St. Louis", iso: "" },
      { name: "Pittsburgh", iso: "" },
      { name: "Hamburg", iso: "" },
      { name: "Munich", iso: "" },
      { name: "Cologne", iso: "" },
      { name: "Frankfurt", iso: "" },
      { name: "Stuttgart", iso: "" },
      { name: "Marseille", iso: "" },
      { name: "Lyon", iso: "" },
      { name: "Toulouse", iso: "" },
      { name: "Nice", iso: "" },
      { name: "Bordeaux", iso: "" },
      { name: "Milan", iso: "" },
      { name: "Naples", iso: "" },
      { name: "Turin", iso: "" },
      { name: "Palermo", iso: "" },
      { name: "Genoa", iso: "" },
      { name: "Barcelona", iso: "" },
      { name: "Valencia", iso: "" },
      { name: "Seville", iso: "" },
      { name: "Zaragoza", iso: "" },
      { name: "Málaga", iso: "" },
      { name: "Saint Petersburg", iso: "" },
      { name: "Novosibirsk", iso: "" },
      { name: "Yekaterinburg", iso: "" },
      { name: "Kazan", iso: "" },
      { name: "Nizhny Novgorod", iso: "" },
      { name: "Birmingham", iso: "" },
      { name: "Manchester", iso: "" },
      { name: "Glasgow", iso: "" },
      { name: "Liverpool", iso: "" },
      { name: "Leeds", iso: "" },
      { name: "Bristol", iso: "" },
      { name: "Sheffield", iso: "" },
      { name: "Cluj-Napoca", iso: "" },
      { name: "Timișoara", iso: "" },
      { name: "Iași", iso: "" },
      { name: "Constanța", iso: "" },
      { name: "Craiova", iso: "" },
      { name: "Rotterdam", iso: "" },
      { name: "Hague", iso: "" },
      { name: "Utrecht", iso: "" },
      { name: "Eindhoven", iso: "" },
      { name: "Groningen", iso: "" },
      { name: "Shanghai", iso: "" },
      { name: "Mumbai", iso: "" },
      { name: "Shenzhen", iso: "" },
      { name: "Guangzhou", iso: "" },
      { name: "Manila", iso: "" },
      { name: "Bangkok", iso: "" },
      { name: "Ho Chi Minh City", iso: "" },
      { name: "Dubai", iso: "" },
      { name: "Karachi", iso: "" },
      { name: "Delhi", iso: "" },
      { name: "Kolkata", iso: "" },
      { name: "Chennai", iso: "" },
      { name: "Tianjin", iso: "" },
      { name: "Chongqing", iso: "" },
      { name: "Chengdu", iso: "" },
      { name: "Nanjing", iso: "" },
      { name: "Wuhan", iso: "" },
      { name: "Seongnam", iso: "" },
      { name: "Suwon", iso: "" },
      { name: "Daejeon", iso: "" },
      { name: "Busan", iso: "" },
      { name: "Incheon", iso: "" },
      { name: "Osaka", iso: "" },
      { name: "Nagoya", iso: "" },
      { name: "Sapporo", iso: "" },
      { name: "Fukuoka", iso: "" },
      { name: "Lahore", iso: "" },
      { name: "Faisalabad", iso: "" },
      { name: "Rawalpindi", iso: "" },
      { name: "Multan", iso: "" },
      { name: "Riyadh", iso: "" },
      { name: "Jeddah", iso: "" },
      { name: "Tehran", iso: "" },
      { name: "Baghdad", iso: "" },
      { name: "Kuala Lumpur", iso: "" },
      { name: "George Town", iso: "" },
      { name: "Ipoh", iso: "" },
      { name: "Johor Bahru", iso: "" },
      { name: "Kota Kinabalu", iso: "" },
      { name: "São Paulo", iso: "" },
      { name: "Rio de Janeiro", iso: "" },
      { name: "Salvador", iso: "" },
      { name: "Brasília", iso: "" },
      { name: "Fortaleza", iso: "" },
      { name: "Guadalajara", iso: "" },
      { name: "Monterrey", iso: "" },
      { name: "Toronto", iso: "" },
      { name: "Montreal", iso: "" },
      { name: "Vancouver", iso: "" },
      { name: "Bogotá", iso: "" },
      { name: "Lima", iso: "" },
      { name: "Santiago", iso: "" },
      { name: "Lagos", iso: "" },
      { name: "Ibadan", iso: "" },
      { name: "Kinshasa", iso: "" },
      { name: "Johannesburg", iso: "" },
      { name: "Durban", iso: "" },
      { name: "Cape Town", iso: "" },
      { name: "Alexandria", iso: "" },
      { name: "Nairobi", iso: "" },
      { name: "Budapest", iso: "" },
      { name: "Prague", iso: "" },
      { name: "Krakow", iso: "" },
      { name: "Kyiv", iso: "" },
      { name: "Kharkiv", iso: "" },
      { name: "Belgrade", iso: "" },
      { name: "Sofia", iso: "" },
      { name: "Zagreb", iso: "" },
      { name: "Istanbul", iso: "" },
      { name: "Ankara", iso: "" },
      { name: "Sydney", iso: "" },
      { name: "Melbourne", iso: "" },
      { name: "Perth", iso: "" },
      { name: "Brisbane", iso: "" },
      { name: "Auckland", iso: "" },
      { name: "Surabaya", iso: "" },
      { name: "Bandung", iso: "" },
      { name: "Medan", iso: "" },
      { name: "Pattaya", iso: "" },
      { name: "Chiang Mai", iso: "" },
      { name: "Phnom Penh", iso: "" },
      { name: "Hanoi", iso: "" },
      { name: "Yangon", iso: "" },
      { name: "Taipei", iso: "" },
      { name: "Hiroshima", iso: "" },
      { name: "Fukuoka", iso: "" },
      { name: "Abu Dhabi", iso: "" },
      { name: "Doha", iso: "" },
      { name: "Kuwait City", iso: "" },
      { name: "Amman", iso: "" },
      { name: "Beirut", iso: "" },
      { name: "Tashkent", iso: "" },
      { name: "Porto", iso: "" },
      { name: "Zurich", iso: "" },
      { name: "Geneva", iso: "" },
      { name: "Brussels", iso: "" },
      { name: "Ghent", iso: "" },
      { name: "Antwerp", iso: "" },
      { name: "Oslo", iso: "" },
      { name: "Copenhagen", iso: "" },
      { name: "Cork", iso: "" },
      { name: "Accra", iso: "" },
      { name: "Luanda", iso: "" },
      { name: "Khartoum", iso: "" },
      { name: "Casablanca", iso: "" },
      { name: "Marrakech", iso: "" },
      { name: "Algiers", iso: "" },
      { name: "Tunis", iso: "" },
      { name: "Calgary", iso: "" },
      { name: "Edmonton", iso: "" },
      { name: "Havana", iso: "" },
      { name: "Medellín", iso: "" },
      { name: "Salvador", iso: "" },
      { name: "Fortaleza", iso: "" },
      { name: "Quito", iso: "" },
      { name: "Caracas", iso: "" },
      { name: "Cincinnati", iso: "" },
      { name: "Providence", iso: "" },
      { name: "Salt Lake City", iso: "" },
      { name: "Honolulu", iso: "" },
      { name: "Anchorage", iso: "" },
      { name: "Riverside", iso: "" },
      { name: "Adelaide", iso: "" },
      { name: "Wellington", iso: "" },
      { name: "Brașov", iso: "" },
      { name: "Galați", iso: "" },
      { name: "Ploiești", iso: "" },
      { name: "Oradea", iso: "" },
      { name: "Brăila", iso: "" },
      { name: "Arad", iso: "" },
      { name: "Pitești", iso: "" },
      { name: "Sibiu", iso: "" },
      { name: "Târgu Mureș", iso: "" },
      { name: "Bologna", iso: "" },
      { name: "Florence", iso: "" },
      { name: "Bari", iso: "" },
      { name: "Catania", iso: "" },
      { name: "Venice", iso: "" },
      { name: "Verona", iso: "" },
      { name: "Padua", iso: "" },
      { name: "Trieste", iso: "" },
      { name: "Bilbao", iso: "" },
      { name: "Alicante", iso: "" },
      { name: "Murcia", iso: "" },
      { name: "Las Palmas", iso: "" },
      { name: "Córdoba", iso: "" },
      { name: "Valladolid", iso: "" },
      { name: "Vigo", iso: "" },
      { name: "Granada", iso: "" },
      { name: "Thessaloniki", iso: "" },
      { name: "Patras", iso: "" },
      { name: "Heraklion", iso: "" },
      { name: "Larissa", iso: "" },
      { name: "Rhodes", iso: "" },
    ]
  }
];