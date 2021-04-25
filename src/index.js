import './styles.css';
import _ from "../node_modules/lodash";
import { error } from '../node_modules/@pnotify/core';
import '../node_modules/@pnotify/core/dist/PNotify.css';
import '../node_modules/@pnotify/core/dist/BrightTheme.css';
import * as Confirm from '../node_modules/@pnotify/confirm';
import '../node_modules/@pnotify/confirm/dist/PNotifyConfirm.css';
import getRefs from '../src/js/get-refs';
import fetchCountries from '../src/js/fetchCountries';
import countryCardTpl from '../src/templates/country-card.hbs';
import countriesListTpl from '../src/templates/countries-list.hbs';



const refs = getRefs();

refs.input.addEventListener('input', _.debounce(onInputChange, 500));

function onInputChange(evt) {
    const searchQuery = evt.target.value;

    fetchCountries(searchQuery)
        .then(array => {
            if (array.length === 1) {
                renderCountryCard(array);
            }
            if (array.length > 1 && array.length <= 10) {
                renderCountriesList(array);
            }
            if (array.length > 10) {
                refs.searchResult.innerHTML = '';
                error({
                    text: 'Too many matches found. Please enter a more specific query!'
                })
            }
        })
        .catch(onFetchError);
}

function renderCountriesList(countries) {
    const markup = countriesListTpl(countries);
    refs.searchResult.innerHTML = markup;
}

function renderCountryCard(country) {
    const markup = countryCardTpl(country);
    refs.searchResult.innerHTML = markup;
}

function onFetchError() {
    error({
        text: 'No such country! Try again!',
        modules: new Map([
            [Confirm,
                {
                    confirm: true,
                    buttons: [{
                        text: "Ok",
                        primary: true,
                        click: notice => {
                            notice.close();
                        }
                }]}]
        ])
    })
}
