const express = require('express')
const app = express()

// Config
app.set('view engine', 'ejs')

// Serve assets folder
app.use(express.static('assets'))

// Routing
app.get('/', (_, res) => {
    res.render('pages/home')})

app.get('/blog', (req, res) => {
    res.render('pages/blog', {posts: []})})

// Start listening
app.listen(3000)
