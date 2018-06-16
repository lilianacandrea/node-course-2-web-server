// hanlder for http
// firs arg is request : '/'  in order to get an url (the root of the app)
// second arg: e o funtie care va rula o functie care transmite xatre Express ce sa trimita inapoi catre cel care a facut request

 //req: contine orice tip de info lagata de request
 // res: poti sa raspunzi la un HTTP request cu o multime de metode disponibile - you can customize what data you send back, you can set your HTTP statuts code

 // LISTEN - is going to bind the application to a port on our machine
 // localhost: 3000

const express = require('express');

//handlebars engine (ai doc.in bookmarks) - folosesti cand vrei sa randezi templates
// este dinamic
const hbs = require('hbs');
const fs = require('fs');

//heroku
const port = process.env.PORT || 3000;

var app = express();

// ne permint sa creeam reusable chunk of code like headers and footers
hbs.registerPartials(__dirname + '/views/partials');
//hbs permine sa setezi ceva: key / value pairs
app.set('view engine', 'hbs');

//middleware  -poate face orice. Poti executa some code like logging something to the screen
// poti modifica the request sau response object
// express.static ia the absolute pathe to the folder you want to serve up
// __dirname - stores the path of our projects directory

app.use(express.static(__dirname + '/public'));

// app.use - is how you register middleware and it takes a function
// next exists so you can tell express that when your middleware function is done.
// This is usefull because you can have as much middleware as you like.
// NEXT: we use next to tell express when we're done. If we do something asynchronous, the middelware is not going to move on only when we call next like this: next(); ,will the application continue to run.
// => asta inseamna ca daca my middleware nu este chemat NEXT pentru fiecare request, they're never going to fire

// create a logger that's going to log out all of the requests that come into the server.
//we're also going to story time stamp, so we can see exactly when someone madfe a request for a specific URL.
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to appent to server.log')
    }
  });
  next();
});

// this middelware is going to stop everything after it formn executing. we don't call next, so the actual handlers are never going to get executed.
//(aplocatia se opreste aici :) daca scrim un middleware in felul asta)
// app.use((req, res, next) => {
//   res.render('maintanance.hbs');
// });
// app.use(express.static(__dirname + '/public'));

//this is a helper. - which is a way to run some javascript code form inside of your handlebars templates.
//Using handlebars helpers we can create both functions that don't take arguments and functions that do take arguments.
// So you need to do something to the data inside of your webpage, you can do that with JAVASCRIPT.
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

// un helper care transforma textul in uppercases
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>');
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'Welcome to my first template engine in node.js'
  });
});

app.get('/about', (req, res) => {
  // res.send('About page');
  //using handlebars to render a template
  res.render('about.hbs', {
    pageTitle: 'About title',
  });
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send( {
    errorMessage: 'Unable to handle request'
  });
});

//heroku sets

app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
