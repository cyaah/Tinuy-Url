var express = require("express");
var cookieParser = require("cookie-parser");

var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//Database to store Long URLS an their short urls
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Database to user information
const users = { 
  "user1": {
    id: "Random1", 
    email: "john@gmail.com", 
    password: "purple"
  },
 "user2": {
    id: "Random2", 
    email: "bob@gmail.com", 
    password: "dish"
  }
}


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

//Gets a page that lists all the urls and their short forms and other functions like editing and deleting
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
  					   user: users[req.cookies.id]}; // req.cookies["username"]}; || 'Anonymous' };
  console.log('boop');
  res.render("urls_index", templateVars);
});


 app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                        urls: urlDatabase[req.params.id],
                        user: users[req.cookies.id]};    //req.cookies["username"] };
  res.render("urls_show", templateVars);
});


//Renders the page when you want to register a new user
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
	let arr = Object.keys(users);
	let num = arr.length;
	let user = `user${num+1}`;
	let id = generateRandomString();	
  	let email = req.body.email
  	let pass = req.body.password
    res.cookie('userid',id)
	//res.cookie('user',req.body.email)
	//res.cookie('password',req.body.password)


	if(email ==="" || pass===""){
		res.status(400).send('Please enter an email and password')
	}
	
	//Turning the object into an array and passing in the email to check if it exists in the newly formed array 
	else if(Object.keys(users).map(obj => users[obj].email).includes(email)){
		res.status(400).send('You already registered!!1')
	}
    
    else{
	users[user] = {'id' : id, 'email' : req.body.email, 'password' : req.body.password }
     console.log(users);
	res.redirect("/urls");
	}

})


function generateRandomString() {
return Math.random().toString(16).substring(2,8) 
}