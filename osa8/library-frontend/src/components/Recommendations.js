import React from 'react'

const Recommendations = (props) => {
    if (!props.show || props.books.loading) {
        return null
    }
    const books = props.books.data.allBooks
    const userGenre = props.user.data.me.favoritegenre
    const favGenreBooks = books.filter(book => book.genres.includes(userGenre))

    return (
        <div>
            <h2>books</h2>

            <p>in your favorite genre <b>{userGenre}</b></p>

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
                    {favGenreBooks.map(a =>
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Recommendations