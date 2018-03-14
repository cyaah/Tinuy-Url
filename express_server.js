var express = require("express");
var cookieSession = require('cookie-session')
var bcrypt = require('bcrypt');
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ["light"],
}));


// Create our own middleware to check for a logged in user!
function checkUser(req, res, next) {
  if (req.path.match(/login|register|u\/.delet|u\/./)) {
    next() // Execute next middleware or go to routes
    return
  }
  
  // Get user from session
  const currentUser = req.session.userid
  if (currentUser) {
    console.log('User is logged in!', currentUser)
    req.currentUser = currentUser
    next()
    //res.redirect('/urls') // ALways call next to proceed
  }
  else {
    res.redirect('/login')
  }
}
app.use(checkUser)



//Database to store Long URLS an their short urls
const urlDatabase = {
   "b2xVn2":
   {
   		longurl: "http://www.lighthouselabs.ca",
   		userid : "user2"
    },  
     "ca2Vn2":
   {
   		longurl: "http://www.lighthouselabs123.ca",
   		userid : "user1"
    },
   "9sm5xK":{
        longurl: "http://www.google.com",
        userid  : "user2"
    }
};

//Database to user information
const users = { 
  "user1": {
    //id: "Random1", 
    email: "john@gmail.com", 
    password: "purple"
  },
 "user2": {
    //id: "Random2", 
    email: "bob@gmail.com", 
    password: "$2a$10$7GyEDXxCd6Yy9NhE.mxXT.dIpFkuU1ID1wcxOMil0GY7ZJx5Z9/la"
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
	let filterUrls = filterByUserId(urlDatabase,req.session.userid)
  let templateVars = { urls: filterUrls,
  					           user: users[req.session.userid]}; // req.cookies["username"]}; || 'Anonymous' };
  res.render("urls_index", templateVars);
});

 app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

 app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                        urls: urlDatabase[req.params.id],
                        user: users[req.session.id]};    //req.cookies["username"] };
  res.render("urls_show", templateVars);
});


//Renders the page when you want to register a new user

 app.get("/register",(req, res) => {
	res.render("urls_register");
 })


app.get("/login",(req,res) =>{
  res.render("urls_login");
  
})

//Creates a new random short url and sets it the submitted longurl
app.post("/urls/new", (req, res) => { 
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    "longurl" : req.body.longURL,
    "userid"  : req.currentUser
  }
  console.log('blah', urlDatabase[shortURL]);  
  res.redirect("/urls");      
});
//Adds a new link and generating a random short url
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = {
   "longurl" : req.body.longURL,
   "userid"  : req.currentUser
  };
	console.log("hi", urlDatabase[req.params.id] );
    res.redirect("/urls");
});

//Redirects the page to the long url page when short url is used
app.get("/u/:shortURL", (req, res) => {
  let db = urlDatabase[req.params.shortURL];
  res.redirect(db.longurl);
 // res.redirect(urlDatabase[req.params.shortURL].longurl);  
});

//Deleting the url
app.post("/urls/:id/delet", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});


//Sets the submitted string in a cookie and shows the user is logged in"
app.post("/login",(req, res) => {
	let email = req.body.email
	let password = req.body.password
	let hashedPassword = bcrypt.hashSync(password, 10);
	let currentUser = req.body.currentUser	
  for (var uid in users) { 
    if(email === users[uid].email) { 
    	bcrypt.compare(password, users[uid].password, (err, matched) => {
        if (matched) {
        // set a cookie to keep track of the user
  	  	  req.session.userid = uid;
          res.redirect("/urls");
   	 
        } else {
  	      res.status(403).send("Email or Password incorrect")
         	console.log("403");
    	  }
    	}) 
    }
	}
});
// Clears cookies after logout and redirects to main page
app.post("/logout",(req, res) => {
   req.session =null 
   res.redirect("/login");
   
})
 
app.post("/register", (req, res) =>{
	let user = generateRandomString();	
  	let email = req.body.email
  	let pass = req.body.password
  	let hashedPassword = bcrypt.hashSync(pass, 10);
    req.session.userid = user;

	if(email ==="" || pass===""){
		res.status(400).send('Please enter an email and password')
	}
	
	//Turning the object into an array and passing in the email to check if it exists in the newly formed array 
	else if(Object.keys(users).map(obj => users[obj].email).includes(email)){
		res.status(400).send('You already registered!!')
	}
    
    else{
	users[user] = {'email' : req.body.email, 'password' : hashedPassword }
     
	res.redirect("/urls");
	}

})


function generateRandomString() {
  return Math.random().toString(16).substring(2,8) 
}


function filterByUserId (urls, userId){
 return Object.entries(urls).filter(entry=> {
	//console.log(userId);
	//console.log(entry[1].userid, "entry");
   return entry[1].userid === userId
	 })
    .reduce((acc,entry)=>{
    	let short = entry[0];
    	let content = entry [1];
    	acc[short] = content
    	return acc
    },[])
}