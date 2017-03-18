//Client Side Javascript


//console.log('Loaded!'); //prints Loaded! on the console.. see inspect element 
// can write Javascript code directly in Chrome Dev Tools(inspect element)

//Change the text of the main-text div
//var element = document.getElementById('main-text'); // only one element of index.html should have a  id i.e unique
//element.innerHTML = "New Value";

//Move the image 
//var img = document.getElementById('madi');
//var marginLeft = 0;
//function moveRight() {
  //  marginLeft = marginLeft + 1 ;
    //img.style.marginLeft = marginLeft + "px";
//}
//img.onclick=function(){
  // img.style.marginLeft = "100px";
   //var interval = setInterval(moveRight,50);//every 50 ms , apply the move right function
     
//};


//Counter Code
//var button = document.getElementById('counter');
//button.onclick = function () {
  //Create a request object
 // var request = new XMLHttpRequest();
  
  //Capture the response and store it  in a variable\
  //request.onreadystatechange = function () {
   //if (request.readyState === XMLHttpRequest.DONE){
       //Take some action
     //  if (request.status === 200){ 
           //req succesfully completed, so extract the req
       //    var counter = request.responseText;
         //  var span = document.getElementById('count');
         //  span.innerHTML = counter.toString();
        
//       }
       
 //  }   
   // if statement no executed i.e request not done
   
//  };
 
 // Make the request
 //   request.open('GET',"http://abhishekbhattacharya.imad.hasura-app.io/counter",true);
 //   request.send(null);
 
//};

//Submit username/password to login
var submit = document.getElementById('submit_btn');
submit.onclick = function () {
  //Make  a request to the server and send the name
   var request = new XMLHttpRequest();
  
  //Capture the response and store it  in a variable\
  request.onreadystatechange = function () {
   if (request.readyState === XMLHttpRequest.DONE){
       //Take some action
       if (request.status === 200){ 
           //req succesfully completed, so extract the req
             console.log('user logged in');
             alert('Logged In Succesfully');
             
       }
       else (request.status === 403){
           alert('username/password is incorrect');
       }
       else (request.status === 500){
           alert('Something went wrong on the server');
       }
       
   }   
  }; 
   
  
 
     // Make the request
     //Submit names
    var username = document.getElementById('username').value;//extract username on click
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST',"http://abhishekbhattacharya.imad.hasura-app.io/login",true);
    request.send(JSON.stringify({username:username , password:password}));
 
  
  
};






