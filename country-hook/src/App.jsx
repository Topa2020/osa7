import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const serverUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name/'
  const [country, setCountry] = useState(null)
  
  useEffect(() => {
    axios.get(`${serverUrl}/${name}`).then(({ data }) => {
      setCountry(data)})
    }, [serverUrl, name])
  return country
}

const Country = ({ country, name }) => {
  if (!country && name === '') {
    return null
  }

  if (country === null || country.name.common.toLowerCase() !== name.toLowerCase()) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.name.common} </h3>
      <div>capital {country.capital} </div>
      <div>population {country.population}</div> 
      <img src={country.flags.png} height='100' alt={`flag of ${country.name.common}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} name={name}/>
    </div>
  )
}

export default App
