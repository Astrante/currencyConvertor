/**
 * Created by Olya on 15.07.2021.
 */

import {LightningElement, track, api} from 'lwc';

export default class CurrencyConvertor extends LightningElement {

    firstCurrency = '';
    secondCurrency = '';

    firstValue;
    secondValue;

    @track
    result;

    connectedCallback() {
        this.getCurrencies();
    }

    async getCurrencies() {
        const urlCurrencies = 'https://www.cbr-xml-daily.ru/daily_json.js';
        const response = await fetch(urlCurrencies).catch(e => console.error(e));
        if (response.ok) {
            let data = await response.json();
            this.result = JSON.parse(JSON.stringify(await data));
        } else {
            throw new Error(`HTTP error, status code = ${response.status}, status = ${response.statusText}`);
        }
    }

    get options() {
        let currencies = [];
        if (this.result && this.result.Valute) {
            for (let valute in this.result.Valute) {
                if (this.result.Valute.hasOwnProperty(valute)) {
                    currencies.push(valute)
                }
            }
            currencies = currencies.map(option => ({
                label: this.result.Valute[option].Name,
                value: this.result.Valute[option].Value + ''
            }));
            currencies.push({label: 'Рубль', value: '1'});
            this.firstCurrency = currencies.find(e => e.label === 'Рубль').value;
            this.secondCurrency = currencies.find(e => e.label === 'Доллар США').value;
        }
        return currencies;
    }

    firstValueChange(e) {
        this.secondValue = ((e.detail.value * this.firstCurrency) / this.secondCurrency).toFixed(2);
    }

    secondValueChange(e) {
        this.firstValue = ((e.detail.value * this.secondCurrency) / this.firstCurrency).toFixed(2);
    }

    firstCurrencyChange(e) {
        this.firstCurrency = e.detail.value;
        this.secondValue = ((this.firstValue * e.detail.value) / this.secondCurrency).toFixed(2);
    }

    secondCurrencyChange(e) {
        this.secondCurrency = e.detail.value;
        this.secondValue = ((this.firstValue * this.firstCurrency) / e.detail.value).toFixed(2);
    }
}