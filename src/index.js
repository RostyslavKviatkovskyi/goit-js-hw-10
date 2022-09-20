import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

const searchForm = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
searchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  event.preventDefault();
  clearData();
  const value = event.target.value.trim();
  if (value.length === 0) {
    return;
  }
  findCountries(value);
}

function findCountries(name) {
  fetchCountries(name).then(countriesNumber).catch(fetchError);
}

function clearData() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function fetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function countriesNumber(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  countriesCardRender(data);
}

function countriesCardRender(data) {
  renderCountry(data);
  if (data.length === 1) {
    renderCertainCountry(data[0]);
    countryListEl.style.fontSize = '24px';
  }
}

function renderCountry(data) {
  const countryData = data.map(element => {
    return `<div><img src = "${element.flags.svg}" width = "50"><div>${element.name}</div></div>`;
  });
  countryListEl.insertAdjacentHTML('beforeend', countryData.join(''));
}

function renderCertainCountry(data) {
  const languages = data.languages.map(language => language.name).join(', ');
  const countryInfo = `<p><b>Capital: </b> ${data.capital}</p>
  <p><b>Population: </b> ${data.population}</p>
  <p><b>Languages:</b> ${languages}</p>`;
  countryInfoEl.innerHTML = countryInfo;
}
