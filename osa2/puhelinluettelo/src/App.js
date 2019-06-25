import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import axios from 'axios'
import pbservices from './services/pbservices'
import Infobox from './components/Notification'
import ErrorBox from './components/Error'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [searchFilter, setSearchFilter] = useState('')
  const [information, setInformation] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
        setInformation(`Contacts  succesfully loaded`)
        setTimeout(() => { setInformation(null) }, 5000)
      })
  }, [])

  const namesToshow = showAll
    ? persons
    : persons.filter(person => { return person.name.toLocaleLowerCase().includes(`${searchFilter}`.toLocaleLowerCase()) }
    )

  const handleremovalOf = personID => {
    const target = persons.find(n => n.id === personID)
    const result = window.confirm(`Are you sure you want to remove ${target.name} from contacts?`)
    if (result) {
      pbservices.deleteContact(personID)
      setPersons(persons.filter(p => p.id !== personID))
      setInformation(`${target.name} removed from contacts`)
      setTimeout(() => { setInformation(null) }, 5000)
      setNewName('')
      setNewNumber('')
    }
  }


  const rows = () =>
    namesToshow.map(person =>
      <Person
        key={person.id}
        person={person}
        handleRemoval={() => handleremovalOf(person.id)}
      />)

  const updateContact = (id) => {
    const persontoChange = persons.find(p => p.id === id)
    const changedPerson = { ...persontoChange, number: newNumber }
    console.log(changedPerson)
    pbservices.update(id, changedPerson).then(response => {
      console.log(response.data)
      setPersons(persons.map(person => person.id !== id ? person : changedPerson))
      setInformation(`${changedPerson.name} number changed`)
      setTimeout(() => { setInformation(null) }, 5000)
    })
      .catch(error => {
        setErrorMessage(`Information of ${changedPerson.name} has already been removed from the server`)
        setTimeout(() => { setErrorMessage(null) }, 5000);
      })
    }

  const addPerson = (event) => {
      event.preventDefault()
      const newPersonObj = {
        name: newName,
        number: newNumber,
      }

      let alreadyIn = persons.some(person => person.name === `${newName}`)
      if (alreadyIn) {
        const foundPerson = persons.find(person => person.name === newName)
        console.log(foundPerson)
        const result = window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)
        if (result) {
          updateContact(foundPerson.id)
        }
      } else {
        pbservices.create(newPersonObj)
          .then(data => {
            setPersons(persons.concat(data))
            setInformation(`Added ${newName} to contacts`)
            setTimeout(() => { setInformation(null) }, 5000)
          })
        setNewName('')
        setNewNumber('')
      }
    }

    const handleNameChange = (event) => {
      console.log(event.target.value)
      setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
      console.log(event.target.value)
      setNewNumber(event.target.value)
    }

    const handleChange = (event) => {
      setSearchFilter(event.target.value)
      if (event.target.value !== '') {
        setShowAll(false)
        console.log(false)
      } else {
        setShowAll(true)
        console.log(true)

      }
      console.log(`${searchFilter}`)
    }

    return (
      <div>
        <h2>Phonebook</h2>

        <Infobox message={information} />
        <ErrorBox message={errorMessage} />
        <Filter persons={persons} searchFilter={searchFilter} handleChange={handleChange} />
        <h2>Add new contact</h2>
        <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
        <h2>Numbers</h2>
        <Persons rows={rows} />
      </div>
    )

  }

  export default App;
