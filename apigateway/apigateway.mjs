import express from 'express'

// Initialize the state to "INIT"
let appState = 'INIT';

// Set port by environment variable or default to 8000 for testing
const port = process.env.PORT || 8000;
const app = express();

app.get('/state', (req, res) => {
    res.set('Content-Type', 'text/plain')
    res.send(appState)
})

app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`)
})