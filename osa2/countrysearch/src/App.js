import React, {useState} from 'react'
import axios from 'axios'
import Country from './components/Country'

const App = () => {

    const [searchVal, setSearchVal] = useState('')
    const [countries, setCountries] = useState([])

    const handleSearchChange = (event) => {
        setSearchVal(event.target.value)
        if (searchVal !== '') {
            axios
                .get(`https://restcountries.eu/rest/v2/name/${searchVal}`)
                .then(response => {
                    //console.log('promise fulfilled')
                    //console.log(response.data)
                    setCountries(response.data)
                })
        }
    }

    const handleCountryClick = (country) => {
        //console.log(country)
        const finalArr = [country]
        setCountries(finalArr)
        //console.log(countries)
    }

    const search = () => {

        return (
            <div>
                find countries
            <input value={searchVal} onChange={handleSearchChange}></input>
            </div>
        )
    }

    const countryInfo = () => {
        if (searchVal === '' || countries.length > 10) {
            return (
                <p>Too many matches, specify</p>
            )
        } else if (countries.length === 1) {
            return <Country countries={countries}/>
        }
            return (countries.map(country =>
                <div key={country.alpha3Code}>
                    {country.name}
                    <button onClick={() => handleCountryClick(country)}>show</button>
                </div>
            ))
        }
    
return (
    <div>
        {search()}
        {countryInfo()}
    </div>
)
}

export default App