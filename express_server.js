var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});	

 app.get("/", (req, res) => {
   res.end("Hello!");
 });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
}); 

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

 app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  console.log('boop');
  res.render("urls_index", templateVars);
});

 app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                        urls: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

 app.get("/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
	let shortURL = generateRandomString();
	urlDatabase[shortURL] = req.body.longURL;
  console.log('blah', req.body);  // debug statement to see POST parameters
  res.redirect(`urls/${shortURL}`);      // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  console.log(longURL);
  res.redirect(longURL);
});


function generateRandomString() {
return Math.random().toString(16).substring(2,8) 
}