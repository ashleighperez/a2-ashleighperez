const http = require( "node:http" ), // node js is a library written for us to create servers- meanning this is server side code
    fs   = require( "node:fs" ),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require( "mime" ),
    dir  = "public/",
    port = 3000

// using let because const does not allow for modification
let deadline = new Date('2025-02-03');
let appdata = [
    {id: 1, task: 'Homework: Assignment 2', priority: 'High', deadline: deadline.toISOString().slice(0, 10), daysLeft: Math.round((deadline.getTime() - Date.now()) / 86400000) },
]

let nextId = 2;

// let fullURL = ""
const server = http.createServer( function( request,response ) {
    console.log(`request received: ${request.method} ${request.url}`);
    if( request.method === "GET" ) {
        handleGet( request, response )
    }else if( request.method === "POST" ){
        handlePost( request, response )
    }

    // The following shows the requests being sent to the server
    // fullURL = `http://${request.headers.host}${request.url}`
    // console.log( fullURL );
})

const handleGet = function( request, response ) {
    const filename = dir + request.url.slice( 1 )

    if( request.url === "/" ) {
        sendFile( response, "public/index.html" )
    } else if (request.url === "/results") {  // endpoint for fetching data
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(appdata));  // passing appdata to client
    } else {
        sendFile(response, filename);
    }
}

// if we have multiple forms/ ways to send information to the form (ie different buttons) you would create a different URL for each of those buttons
// if URL is = "some path" => if "this path" => do this
// handlePost takes in the request and response and is called when the request method is POST, sending data from the client to the server
const handlePost = function( request, response ) {
    let dataString = ""

    request.on( "data", function( data ) {
        dataString += data // if the data is too large, this will break the data into smaller chunks
    })

    // this is the data that was sent to the server (user input)
    request.on( "end", function() {

        const userInput = JSON.parse( dataString );
        console.log(userInput);

        if (request.url === "/submit") {
            const deadline = new Date(userInput.deadline);
            const daysLeft = Math.round((deadline.getTime() - Date.now()) / 86400000);

            appdata.push({id:nextId++, task: userInput.task, priority: userInput.priority, deadline: userInput.deadline, daysLeft: daysLeft })

        } else if (request.url === "/delete") {
            const tid = Number(userInput.id);
            appdata = appdata.filter(task => task.id !== tid);
            console.log(appdata)
        }


        response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
        response.end(JSON.stringify(appdata)) // this is the data that is sent back to the client
    })
}

const sendFile = function( response, filename ) {
    const type = mime.getType( filename )

    fs.readFile( filename, function( err, content ) {

        // if the error = null, then we've loaded the file successfully
        if( err === null ) {

            // status code: https://httpstatuses.com
            response.writeHeader( 200, { "Content-Type": type })
            response.end( content )

        } else {

            // file not found, error code 404
            response.writeHeader( 404 )
            response.end( "404 Error: File Not Found" )

        }
    })
}

// process.env.PORT references the port that Glitch uses
// the following line will either use the Glitch port or one that we provided
server.listen( process.env.PORT || port )

