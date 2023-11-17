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

class work_out {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, Distance, Duration) {
    this.coords = coords; // lat and log arr
    this.Distance = Distance; // km
    this.Duration = Duration; // in min
  }
}

class running extends work_out {
  constructor(coords, Distance, Duration, cadance) {
    super(coords, Distance, Duration);
    this.cadance = cadance;
    this.cal_pace();
  }
  cal_pace() {
    this.pace = this.Duration / this.Distance;
    return this.pace;
  }
}
class cycling extends work_out {
  constructor(coords, Distance, Duration, cadance, elevation_gain) {
    super(coords, Distance, Duration);
    this.cadance = cadance;
    this.elevation_gain = elevation_gain; //meter
    this.calc_speep();
  }
  calc_speep() {
    this.speed = this.Distance / (this.Duration / 60);
    return this.speed;
  }
}

const run_1 = new running([39, -12], 24, 178);
const cyc_1 = new cycling([39, -12], 20, 128);
console.log(run_1);
console.log(cyc_1);

let map, map_event;
// gealocation api
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const coords = [latitude, longitude];
      // latitude comes first
      console.log(
        `https://www.google.com/maps/@${latitude},${longitude},6z?entry=ttu`
      );
      //  L.map('map') this refers to the id
      map = L.map('map').setView(coords, 13);
      L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      // handling clicks om map
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

// .running-popup
// .cycling-popup

form.addEventListener('submit', function (e) {
  e.preventDefault();
  // addding data to form
  const type = inputType.value;
  const distance = +inputDistance.value;
  const duration = +inputDuration.value;
  const cadance = +inputCadence.value;
  const elevation = +inputElevation.value;

  // check data
  if (type === 'running') {
    if (!Number.isFinite(distance) || distance <= 0) {
      alert('input has to be positive number');
      return (inputDistance.value = '');
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      alert('input has to be positive number');
      return (inputDuration.value = '');
    }
    if (!Number.isFinite(cadance) || cadance <= 0) {
      alert('input has to be positive number');
      return (inputCadence.value = '');
    }
  }

  if (type === 'cycling') {
    if (!Number.isFinite(elevation) || elevation <= 0) {
      alert('input has to be positive number');
      return (inputElevation.value = '');
    }
    if (!Number.isFinite(distance) || distance <= 0) {
      alert('input has to be positive number');
      return (inputDistance.value = '');
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      alert('input has to be positive number');
      return (inputDuration.value = '');
    }
    if (!Number.isFinite(cadance) || cadance <= 0) {
      alert('input has to be positive number');
      return (inputCadence.value = '');
    }
  }

  // clear input fields
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';
  //display marker
  const { lat } = map_event.latlng;
  const { lng } = map_event.latlng;
  const coords = [lat, lng];
  console.log(lat, lng);
  L.marker(coords)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('workout')
    .openPopup();
});

inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
});
