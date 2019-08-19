const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const JWT_SECRET = 'SALAISUUS'

mongoose.set('useFindAndModify', false)

const MONGODB_URI = 'mongodb+srv://MOOCuser:5TkHaSWONIGNk9Xt@tm-cluster-sv3gi.mongodb.net/graphql?retryWrites=true&w=majority'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(() => {
  console.log('connected to MongoDB')
})
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`

type User {
  username: String!
  favoritegenre: String
  id: ID!
}

type Token {
  value: String!
}

type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}

type Author {
      name: String!
      id: ID!
      born: Int
      bookCount: Int!
}

type Query {
    hello: String!
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
}

type Mutation {
      addBook(
          title: String!
          author: String!
          published: Int!
          genres: [String!]!
      ): Book
      editAuthor(
          name:String!
          setBornTo:Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
}

type Subscription {
  bookAdded: Book!
}
`

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),
    hello: () => { return "world" },
    me: async (root, args, context) => {
      return context.currentUser
    },
    allBooks: (root, args) => {
      /* NON-DB ANSWER
      if (args.author !== undefined && args.genre !== undefined) {
        const filteredByAuthor = books.filter(book => book.author === args.author)
        const filteredByAuthorAndGenre = filteredByAuthor.filter(book => book.genres.includes(args.genre))
        return filteredByAuthorAndGenre

      }
      else if (args.genre === undefined && args.author !== undefined) {

        return books.filter(book => book.author === args.author)
      }
      else if (args.author === undefined && args.genre !== undefined) {
        return books.filter(book => book.genres.includes(args.genre))
      } else {*/
        //return books

        if (args.genre !== undefined) {
          const books = Book.find({})
          return books.filter(book => book.genres.includes(args.genre))
        }

        return Book.find({}).populate('author', {name:1})
    },
    allAuthors: (root, args) => {return Author.find({})
  }
  },
  Author: {
    bookCount: async (root) => {
      const allFoundBooks = await Book.find({}).populate('author', {name:1, id:1})
      authorsBooks = allFoundBooks.filter(book => book.author.id === root.id)
      return authorsBooks.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const books = await Book.find({}).populate('author', {name:1, id:1})
      //IF NOT MAKE NEW AUTHOR
      if (books.filter(book => book.author.name === args.author).length === 0) {
        const author = new Author({name:args.author})
        try {
        await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args.author,
          })
        }
        const book = new Book({...args, author: author })

        try{
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }

        pubsub.publish('BOOK_ADDED', { bookAdded: book })

        return book

      } else {
        //IF FOUND FIND OLD AND USE IT
        const author = books.find(b => b.author.name === args.author)
        const id = author.author.id
        const existingAuthor = await Author.findById(id)
        const book = new Book({...args, author: existingAuthor})
        try {
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }


        pubsub.publish('BOOK_ADDED', { bookAdded: book })

        return book

      }

    },
    editAuthor: async (root, args, context) => {

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      return author.save()
      /* NON-DB ANSWER
      const editedAuthor = authors.find(author => author.name === args.name)
      if (!editedAuthor) {
        return null
      }
      const updatedAuthor = { ...editedAuthor, born:args.setBornTo }
      authors = authors.map(author => author.name === args.name ? updatedAuthor : author)
      return updatedAuthor*/
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoritegenre:args.favoritegenre })

      return user.save().catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if(!user || args.password !== '123') {
        throw new UserInputError("invalid credentials!")
      }

      const userForToken = {
        username: user.username,
        favoritegenre: user.favoritegenre,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, JWT_SECRET)}
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})