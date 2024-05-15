const express = require('express');
const Ably = require('ably');
const cors = require('cors');


const client = new Ably.Realtime('VcZiuA.EIf9Qw:jN4lJsYTgMsXm8__yyp_1WaTS6CD8MMiNzYE1pwoEic');

const app = express();
app.use(cors()); // Enable CORS for all origins (adjust for specific origins if needed)
app.get("/", async (request, response) => {
    response.sendFile(__dirname + '/views/index.html');
});

app.get("/api/createTokenRequest", async (request, response) => {
    const tokenRequestData = await client.auth.createTokenRequest({ 
        clientId: 'ably-client-side-api-calls-demo' 
    });
    response.send(tokenRequestData);
});
  
app.listen(5000, () => console.log(`Example app listening at http://localhost:5000`))