'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class WorkOut {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords; // lat and log arr
    this.distance = distance; // km
    this.duration = duration; // in min
  }
}

class Running extends WorkOut {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends WorkOut {
  constructor(coords, distance, duration, cadence, elevation) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.elevation = elevation; // meter
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const workouts = []; // array to store workouts

const run_1 = new Running([39, -12], 24, 178);
const cyc_1 = new Cycling([39, -12], 20, 128);
console.log(run_1);
console.log(cyc_1);

let map, map_event;
// geolocation api
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const coords = [latitude, longitude];
      // latitude comes first
      //  L.map('map') this refers to the id
      map = L.map('map').setView(coords, 13);
      L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      // handling clicks on map
      map.on('click', function (map_e) {
        map_event = map_e;
        form.classList.remove('hidden');
        inputDistance.focus();
        console.log(map_event);
      });
    },
    function () {
      alert('could not get current location');
    }
  );

form.addEventListener('submit', function (e) {
  e.preventDefault();
  // lat and log
  const { lat } = map_event.latlng;
  const { lng } = map_event.latlng;
  const coords = [lat, lng];

  // adding data to form
  const type = inputType.value;
  const distance = +inputDistance.value;
  const duration = +inputDuration.value;
  const cadence = +inputCadence.value;
  const elevation = +inputElevation.value;

  // check data
  if (type === 'running') {
    if (!Number.isFinite(distance) || distance <= 0) {
      alert('Input has to be a positive number for distance');
      return (inputDistance.value = '');
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      alert('Input has to be a positive number for duration');
      return (inputDuration.value = '');
    }
    if (!Number.isFinite(cadence) || cadence <= 0) {
      alert('Input has to be a positive number for cadence');
      return (inputCadence.value = '');
    }

    workouts.push(new Running([lat, lng], distance, duration, cadence));
  }

  // check data
  if (type === 'cycling') {
    if (!Number.isFinite(elevation) || elevation <= 0) {
      alert('Input has to be a positive number for elevation');
      return (inputElevation.value = '');
    }
    if (!Number.isFinite(distance) || distance <= 0) {
      alert('Input has to be a positive number for distance');
      return (inputDistance.value = '');
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      alert('Input has to be a positive number for duration');
      return (inputDuration.value = '');
    }

    workouts.push(new Cycling([lat, lng], distance, duration, cadence, elevation));
  }

  // clear input fields
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

  // display marker
  console.log(lat, lng);
  // getting months
  const monthDay = new Date();
  const month = monthDay.getMonth();

  L.marker(coords)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${type}-popup`,
      })
    )
    .setPopupContent(` ${type} on ${months[month]} ${monthDay.getDate()} `)
    .openPopup();

  let html = `  
   <li class="workout workout--${type}" data-id="${workouts[workouts.length - 1].id}">
    <h2 class="workout__title">${type} on ${months[month]} ${monthDay.getDate()}</h2>
    <div class="workout__details">
      <span class="workout__icon"> ${type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} </span>
      <span class="workout__value"> ${workouts[workouts.length - 1].distance} </span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workouts[workouts.length - 1].duration}</span>
      <span class="workout__unit">min</span>
    </div>`;

  if (type === 'running') {
    html += `  
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workouts[workouts.length - 1].pace}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workouts[workouts.length - 1].cadence}</span>
        <span class="workout__unit">spm</span>
      </div>`;
  }

  if (type === 'cycling') {
    html += `  
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workouts[workouts.length - 1].speed}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workouts[workouts.length - 1].elevation}</span>
        <span class="workout__unit">m</span>
      </div>
    </li>`;
  }

  containerWorkouts.insertAdjacentHTML('beforeend', html);
});

inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
});
