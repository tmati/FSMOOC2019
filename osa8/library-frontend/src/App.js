import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/react-hooks'


const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  id
  title
  author
  published
  genres
}`


const BOOK_ADDED = gql` 
subscription {
  bookAdded {
    ...BookDetails
  }
}

  ${BOOK_DETAILS}
`

const LOGIN =  gql` 
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres:[String!]!) {
  addBook(
  title: $title,
  author: $author,
  published: $published,
  genres: $genres
  ) {
    title
    author {
      name
    }
    published
    genres
  }
}
`

const EDIT_BORN_YEAR = gql`
mutation editAuthorBorn($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
  name
  born
  }
}
`

const ALL_AUTHORS = gql`
{allAuthors {
    name,
    bookCount 
    born
}}
`

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author {
      name
    }
    published
    genres
    id
  }
}
`

const ME = gql`
{
  me{
    username
    favoritegenre
  }
}
` 


const App = () => {
  const client = useApolloClient()
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const authors = useQuery(ALL_AUTHORS)
  const allBooks = useQuery(ALL_BOOKS)
  const loggedin = useQuery(ME)
  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const [login] = useMutation(LOGIN, {
    onError:handleError
  })

  const errorNotification = () => errorMessage &&
  <div style={{ color: 'red' }}>
    {errorMessage}
  </div>
  

  const [editAuthorBorn] = useMutation(EDIT_BORN_YEAR, {
    onError: handleError, refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      dataInStore.allBooks.push(addedBook)
      client.writeQuery({
        query: ALL_BOOKS,
        data: dataInStore
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      console.log(addBook)
      window.alert(`A new book ${addedBook.title} by ${addedBook.author.name} added`)
      updateCacheWith(addedBook)
    }
  })

  const [addBook] = useMutation(CREATE_BOOK, {
    onError: handleError,
    update: (store, response) => {
      updateCacheWith(response.data.addBook)
    }
  })

  const userMgmtBtns = () => {
    if (localStorage.getItem('books-user-token') !== null) {

      return (
        <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommended')}>recommend</button>
        <button onClick={() => logout()}>logout</button>
        </div>
      )
    }

    return(
      <div>
      <button onClick={() => setPage('authors')}>authors</button>
      <button onClick={() => setPage('books')}>books</button>
      <button onClick={() => setPage('login')}>login</button>
      </div>
    )
  }

  return (
    <div>
        {userMgmtBtns()}
      <div>
        {errorNotification()}
      </div>

      <Authors authors={authors} editAuthorBorn={editAuthorBorn}
        show={page === 'authors'}
      />

      <Books books={allBooks}
        show={page === 'books'}
      />

      <NewBook addBook={addBook}
        show={page === 'add'}
      />

      <Recommendations user={loggedin} books={allBooks} show={page === 'recommended'}/>

      <LoginForm login={login}
      setToken={(token) => setToken(token)}
        show={page === 'login'}/>

    </div>
  )
}

export default App