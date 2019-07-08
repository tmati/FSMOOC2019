const logger = require('./utils/logger')
const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const morgan = require('morgan')
mongoose.set('useFindAndModify', false);
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true })
    .then(() => {
        logger.info('connected to mongoDB')
    })
    .catch((error) => {
        logger.info('error connecting to mongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())


//morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app