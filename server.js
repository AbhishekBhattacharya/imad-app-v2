//imported software packages
var express = require('express');//library used to create the web server i.e express framework
var morgan = require('morgan');//library used to output logs of our server
var path = require('path');
var Pool = require('pg').Pool; //DB Pool

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

//javascript object
var articles = {
    'article-one': {
    title : 'Article One | Abhishek Bhattacharya',
    heading : 'Article One',
    date: '12 Feb 2017',
    content :`
    <p>
        This is the content for my first article.
        My IMAD's first html file.
    </p>
    <p>
        This is the content for my first article.
        My IMAD's first html file.
    </p>
    <p>
        This is the content for my first article.
        My IMAD's first html file.
    </p>`},
    'article-two': {
        title : 'Article Two | Abhishek Bhattacharya',
    heading : 'Article Two',
    date: '12 Feb 2017',
    content :`
    <p>
        This is the content for my second article.
        My IMAD's second html file.
    </p>
    <p>
        This is the content for my second article.
        My IMAD's second html file.
    </p>
    <p>
        This is the content for my second article.
        My IMAD's second html file.
    </p>`
    },
    'article-three': {
        title : 'Article Three | Abhishek Bhattacharya',
    heading : 'Article Three',
    date: '12 Feb 2017',
    content :`
    <p>
        This is the content for my third article.
        My IMAD's third html file.
    </p>
    <p>
        This is the content for my third article.
        My IMAD's third html file.
    </p>
    <p>
        This is the content for my third article.
        My IMAD's third html file.
    </p>`
    }
}; // backquote to use multiple lines of javascript in content



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
    //SELECT * FROM article WHERE title = 'article-one'
    pool.query("SELECT * FROM article WHERE title = '" + req.params.articleName + "'", function (err ,result) {
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
