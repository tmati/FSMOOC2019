import React, {useState} from 'react'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('all')
  if (!props.show || props.books.loading) {
    return null
  }
  const books = props.books.data.allBooks

  const allGenres = books.map(book => book.genres)

  const flatGenreArray = [].concat.apply([], allGenres)

  const uniqueGenres = [...new Set(flatGenreArray)]

  const filteredByGenre = () => {
    if (selectedGenre === 'all') {
      return books
    }

    return books.filter(book => book.genres.includes(selectedGenre))
  }

  const genreButtons = () => {
    return (
      <div>
        {uniqueGenres.map(genre => 
          <button key={genre} onClick={() => setSelectedGenre(genre)}>{genre}</button>)}
          <button onClick={() => setSelectedGenre('all')}>all books</button>
      </div>
    )
  }

  return (
    <div>
      <h2>books</h2>

      <p>in genre <b>{selectedGenre}</b></p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredByGenre().map(a =>
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {genreButtons()}
    </div>
  )
}

export default Books