import express from 'express'

// Initialize the state to "INIT"
let appState = 'INIT';
let runLog = [];

function changeState(newState){
    // Nothing happens and no change is logged if state is not changed
    if (newState == appState){
        return;
    }
    let date = new Date().toJSON().toString();
    runLog.push((date + ": " + appState + "->" + newState).toString());
    appState = newState;
    return;
}

// Set port by environment variable or default to 8000 for testing
const port = process.env.PORT || 8000;
const app = express();
app.use(express.json())

app.get('/state', (req, res) => {
    res.set('Content-Type', 'text/plain')
    res.send(appState)
})

app.get('/run-log', (req, res) => {
    res.set('Content-Type', 'text/plain')
    let response = runLog.join("\n")
    res.send(response);
})

// Responds to requests to change state via json payloads
// Ex. using postman send a raw json body of {"status":"INIT"}
app.put('/state', (req, res) => {
    if (req.body.status == "INIT"){
        changeState("INIT")
        res.sendStatus(200)
        return
    }
    if (req.body.status == "PAUSED"){
        changeState("PAUSED")
        res.sendStatus(200)
        return
    }
    if (req.body.status == "RUNNING"){
        changeState("RUNNING")
        res.sendStatus(200)
        return
    }
    if (req.body.status == "SHUTDOWN"){
        changeState("SHUTDOWN")
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