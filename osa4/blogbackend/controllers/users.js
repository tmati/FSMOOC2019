const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body

        if (body.password === undefined) {
            return response.status(400).json({ error: 'no password given' })
        } else if (body.password.length <= 3) {
            return response.status(400).json({ error: 'password too short' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (exception) {
        next(exception)
    }
})

usersRouter.get('/', async (request, response, next) => {
    const users = await User
        .find({}).populate('blogs', { title: 1, url: 1, likes: 1 })
    response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter