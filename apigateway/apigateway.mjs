import express from 'express'

// Initialize the state to "INIT"
let appState = 'INIT';

// Set port by environment variable or default to 8000 for testing
const port = process.env.PORT || 8000;
const app = express();
app.use(express.json())

app.get('/state', (req, res) => {
    res.set('Content-Type', 'text/plain')
    res.send(appState)
})

// Responds to requests to change state via json payloads
// Ex. using postman send a raw json body of {"status":"INIT"}
app.put('/state', (req, res) => {
    if (req.body.status == "INIT"){
        appState = "INIT"
        res.sendStatus(200)
        return
    }
    if (req.body.status == "PAUSED"){
        appState = "PAUSED"
        res.sendStatus(200)
        return
    }
    if (req.body.status == "RUNNING"){
        appState = "RUNNING"
        res.sendStatus(200)
        return
    }
    if (req.body.status == "SHUTDOWN"){
        appState = "SHUTDOWN"
        res.sendStatus(200)
        return
    }
    // None matched, bad request
    res.sendStatus(400)
    return
})


app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`)
})