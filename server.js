//imported software packages
var express = require('express');//library used to create the web server i.e express framework
var morgan = require('morgan');//library used to output logs of our server
var path = require('path');
var Pool = require('pg').Pool; //DB Pool
var crypto = require('crypto'); //Library of NodeJs For Hashing
var bodyParser = require('body-parser'); //for GETTING username, password as JSON
var session = require('express-session'); //Implement Sessions

 //DB Configuration
 var config = {
  user: 'abhishekbhattacharya',
  database: 'abhishekbhattacharya',
  host: 'db.imad.hasura-app.io', 
  port: '5432',
  password: process.env.DB_PASSWORD  //use the environment variable that is available called 'DB_PASSWORD' for secure password
};




var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json()); //tell express to load JSON in req.body variable whenever see it
app.use(session({
    secret :'someRandomSecretValue',
    cookie :{ maxAge : 1000 * 60 * 60 * 24 * 30} 
    
}));//Two configurations in session library ,secret--encrypts cookies,cookie--sets duration of our cookie ,here: 1 month



function createTemplate(data){
var title = data.title;
var date = data.date;
var heading = data.heading;
var content = data.content;
var htmlTemplate =
`<html>
    <head>
        <title>
           ${title}        
        </title>
        <meta name="viewport" content="width-device-width,initialscale=1"/>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
        <div class="container">
         <div>
            <a href="\">Home</a>
         </div>
         <hr/>
         <h3>
           ${heading}
         </h3>
         <div>
           ${date.toDateString()}
         </div>
         <div>
           ${content}
         </div>
        </div>
    </body>
 </html>
`;
return htmlTemplate;
}

    



app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));//when url path '/' is requested , then picks up ui/index.html and sends it contents ..these are called url handlers
});

//hashing

function hash(input,salt) {//read crypto doccumentation in nodejs for info
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');//takes input,appends the value of salt and applies hash function 10k times result ids a 512 byte value using sha512 coding 
    return ['pbkdf2Sync','10000',salt,hashed.toString('hex')].join('$');   //convert bytes to string using hexadecimal encoding , even if we store the algoname , hacker cannot recognize the original password string
       
       
    //algorithm :md5 
    //'password'-> sdjgsdcfihsc64sdvfsf4cs6v6w4sdw4cf6acf4  // can be looked up by hackers easily
    //Thus use salting for a completely different hash value
    //'password-this-is-some-random-string'-> 355sdfwsdfwe6854f6w4ef6as4dasd684f6c84s --no way to hack it as its random!! :)
    //further hashed 10k times for better protection
    //thus
    //'password'-->'password-this-is-a-salt'--> <hash> -> <hash> X 10k times
    
}


//enndpoint for hash
app.get('/hash/:input', function (req, res){
   var hashedString = hash(req.params.input,'this-is-some-random-string');
   res.send(hashedString);
});
    
//endpoint to create user
app.post('/create-user', function (req, res) {//post request as get request is not recommended for getting raw username and password
   //takes username,password and creates entry in the user table 
   //assume username ansd password as JSON string -- done using body parser in express framework in header files
   //{"username":"abhishekbhattacharya" , "password":"password"}
   var username = req.body.username;
   var password = req.body.password;
   //Use SSH to IMAD terminal and running curl command to execute the query 
   
   var salt = crypto.randomBytes(128).toString('hex'); //salting 
   var dbString = hash(password,salt);  //hashed password
   pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString] ,function (err,result){
       if (err){//if error occurs , send status 500 error mesaage
           res.status(500).send(err.toString());
       }
       else {
           res.send('Username succesfully created:' + username);
       } 
   });
   
});

//Logging in as a user
app.post('/login',function(req,res){
   var username = req.body.username;
   var password = req.body.password;
   //Use SSH to IMAD terminal and running curl command to execute the query 
   
   pool.query('SELECT * FROM "user" WHERE username=$1',[username],function (err,result){
       if (err){//if error occurs , send status 500 error mesaage
           res.status(500).send(err.toString());
       }
       else {
           if (result.rows.length === 0){
               res.status(403).send('username/password is invalid');  //403--Forbidden Request
           }
           else {
               //Match the password
               var dbString = result.rows[0].password; 
               var salt = dbString.split('$')[2]; //salt value is the third element in the array
               var hashedPassword = hash(password,salt); //Creating  a Hash based on the password submitted and the original salt
               if (hashedPassword === dbString){
               
                 //Set a Session before the response is sent
                 
                 req.session.auth = {userId:result.rows[0].id}; 
                 //Session middleware is  setting the cookie with a session id(All that the cookie contains is SessionId)
                 // internally , on the server side , it maps the seesion id to an object
                 // object -- auth = {{userId}}
                 
                 
                 res.send('Credentials are correct');  
                 
                
                 
       } else {
            res.status(403).send('username/password is invalid'); 
       }
     }
    }
  });
});





// create the pool somewhere globally so its lifetime (for the database)
// lasts for as long as your app is running
var pool = new Pool(config);


//Endpoint for connecting to the database
app.get('/test-db', function (req, res) {
   //make a select request
   //return a response with the results
   pool.query('SELECT * FROM TEST', function (err,result){
       if (err){//if error occurs , send status 500 error mesaage
           res.status(500).send(err.toString());
       }
       else {
           res.send(JSON.stringify(result.rows));  //send the result back as a JSON string 'result.rows for array of objects
       }
   });
});


var counter = 0;
app.get('/counter', function(req,res) {
    counter = counter + 1;
    res.send(counter.toString()); //only allowed to send string as a response
});


var names = [];
app.get('/submit-name', function(req,res){ //URL: /submit-name?name=xyz
    //Get the name from the request object and extract it, concatenate to the overall list and then return that response
   // var name = req.params.name;
    var name = req.query.name;  // for the URL request
    names.push(name);
    //JSON :Javascript Object Notation - a way of converting complex javascript objects to strings
    res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function (req, res) {
    //articleName == article-one
    //articles[articleName] == {} content object for article one
    var articleName = req.params.articleName;
    //SELECT * FROM article WHERE title = '\';DELETE where a = \'asdf' --SQL INJECTION ESCAPED BY BACKSLASH IN FRONT OF SINGLE QUOTE
    pool.query("SELECT * FROM article WHERE title = $1" , [req.params.articleName], function (err ,result) {
      if(err) {
          res.status(500).send(err.toString());
      }  
      else {
          if (result.rows.length === 0){
              res.status(404).send('Article not found');
          } else {
              var articleData = result.rows[0]; //first element
              res.send(createTemplate(articleData)); //Template the data
          }
      }
    }); 
 });



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
