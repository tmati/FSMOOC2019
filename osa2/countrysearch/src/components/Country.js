import React, {useState, useEffect} from 'react'
import axios from 'axios'

/*Sääominaisuus ei lähtenyt toimimaan. Herjaa cleanupista. Weather-olio tulostuu kuitenkin konsoliin.
 */

const Country = ({countries}) => {

    const [weather, setWeather] = useState('')
    const capital = countries[0].capital
    console.log(capital)

    const hook =() => {    
    axios
        .get(`https://api.apixu.com/v1/current.json?key=83252904ea834c47a97102759192406&q=${capital}`)
        .then(response => {
            setWeather(response.data)
            console.log(weather)
        })
    }
    useEffect(hook, [])

    return(
        (countries.map(country =>
            <div key={country.alpha3Code}>
                <h1>{country.name}</h1>
                <p>Capital: {country.capital}</p>
                <p>Population: {country.population}</p>
                <h2>Languages</h2>
                <ul>{country.languages.map(e =>
                <li key={e.iso639_1}>{e.name}</li>)}
                </ul>
                <img src={country.flag} alt="flag here" height="250"/>
                <h2>Weather in {country.capital}</h2>
                {hook()}
            


            </div>))
    )
}

export default Country