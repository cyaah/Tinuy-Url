var express = require("express");
var cookieParser = require("cookie-parser");

var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

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
  let templateVars = { urls: urlDatabase,
  					 username: req.cookies["username"]}; //|| 'Anonymous' };
  //console.log('boop', templateVars, req.cookies);
  res.render("urls_index", templateVars);
});

 app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                        urls: urlDatabase[req.params.id],
                        username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

 app.get("/new", (req, res) => {
  res.render("urls_new");
});

 app.get("/register",(req, res) => {

 	res.render("urls_register");
 })


//Creates a new random short url and sets it the submitted longurl
app.post("/urls/new", (req, res) => {	
	let shortURL = generateRandomString();
	urlDatabase[shortURL] = req.body.longURL;
  console.log('blah', req.body);  // debug statement to see POST parameters
  res.redirect("/urls");      // Respond with 'Ok' (we will replace this)
});

//Redirects the page to the long url page when short url is used
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  console.log(longURL);
  res.redirect(longURL);
});
//Deleting the url
app.post("/urls/:id/delete", (req, res) => {
	delete urlDatabase[req.params.id];
	res.redirect("/urls");
});

//Adds a new link and generating a random short url
app.post("/urls/:id", (req, res) => {
urlDatabase[req.params.id] = req.body.longURL;
	console.log("jaa");
    res.redirect("/urls");
});

//Sets the submitted string in a cookie and shows the user is logged in"
app.post("/login",(req, res) => {
   res.cookie('username',req.body.Username)
   res.redirect("/urls");
});
// Clears cookies after logout and redirects to main page
app.post("/logout",(req, res) => {
   res.clearCookie('username');
   res.redirect("/urls");
})
 
app.post("/register", (req, res) =>{
	res.cookie('user',req.body.email)
	res.cookie('password',req.body.password)
	res.redirect("/urls");
})


function generateRandomString() {
return Math.random().toString(16).substring(2,8) 
}