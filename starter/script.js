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
