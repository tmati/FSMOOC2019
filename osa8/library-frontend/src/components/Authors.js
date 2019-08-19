import React, { useState } from 'react'
import Select from 'react-select'

const Authors = (props) => {
  const [authorYear, setAuthorYear] = useState('')
  const [selection, setSelection] = useState('')
  const [name, setName] = useState('')

  if (!props.show || props.authors.loading) {
    return null
  }

  const submit = async (e) => {
    e.preventDefault()
    const setBornTo = parseInt(authorYear) 
    await props.editAuthorBorn({
      variables: { name, setBornTo }
    })

    setAuthorYear('')
    setName('')
    setSelection('')
  }



  const authorNames = props.authors.data.allAuthors.map(a => {const authorselect = {}
  authorselect.value = a.name
  authorselect.label = a.name
  return authorselect})

  const Selector = () => {

    const handleChange = selectedOption => {
      setName(selectedOption.value)
      setSelection(selectedOption)
      console.log(selectedOption.value)
  
    }

    return (
    <Select options={authorNames} value={selection} onChange={handleChange}/>
  )}

  const AuthorEditor = () => {

    if (localStorage.getItem('books-user-token') !== null) {

    return (
    <div>
    <h2>Set author birthyear</h2>
    <h4>Came across some obscure knowledge of an author's birthyear? Update it below!</h4>

    <form onSubmit={submit}>
      <div>
      <Selector/>
      </div>
      <input type='number' value={authorYear}
      onChange={({ target }) => setAuthorYear(target.value)}/>
      <button type='submit'>Update data</button>
    </form>
  </div>
    )
    }
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {props.authors.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
    {AuthorEditor()}
    </div>
  )
}

export default Authors