//imported software packages
var express = require('express');//library used to create the web server i.e express framework
var morgan = require('morgan');//library used to output logs of our server
var path = require('path');

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
           ${date}
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


app.get('/:articleName', function (req, res) {
    //articleName == article-one
    //articles[articleName] == {} content object for article one
    var articleName = req.params.articleName;
   res.send(createTemplate(articles[articleName]));
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
