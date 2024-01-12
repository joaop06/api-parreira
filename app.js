require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const express = require('express')

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

const server = app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`)
})

require('./app/routes')(app)

app.use(function onError(err, req, res, next) {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({ error: err.message })
}) 