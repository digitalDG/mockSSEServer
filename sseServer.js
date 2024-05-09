const express = require('express');
//const parser = require('body-parser');
const app = express();

const EventEmitter = require('events');
const Stream = new EventEmitter();
const PORT = 8081;
let currentState = 'RED';

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}),
);


app.get('/sse/light-status', function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        Connecton: 'keep-alive',
    });

   
    Stream.on('push', function(event, data) {
        response.write('event: ' + String(event) + '\n' + 'data: ' + JSON.stringify(data) + '\n\n');
    });

});

//let currentState = "red";

function getNextState(currentState) {
    let nextState = '';
    switch (currentState) {
        case 'RED':
            nextState = 'GREEN';
            break;
        case 'YELLOW':
            nextState = 'RED';
            break;
        case 'GREEN':
            nextState = 'YELLOW';
            break;
        default:
            break;
    }

    return nextState;
}



function updateLightState() {

    //let nextState = getNextState(currentState);
    console.log('Current light state: ' + currentState);

    Stream.emit('push', 'message', { currentState: currentState });

    currentState = getNextState(currentState);;

    //let rndInt = Math.floor(Math.random() * 10) + 3;
    let max = 10;
    let min = 3;
    let rndInt = Math.floor(Math.random() * (max - min + 1) + min);
    console.log('Waiting for ' + rndInt + ' seconds');

    setTimeout(updateLightState, rndInt * 1000);
}

//app.listen(3000);

//console.log('Express e2e mock server is running');
app.listen(PORT, () => {
    console.log(`Express e2e mock server app listening at http://localhost:${PORT}`);

    updateLightState();
  });

