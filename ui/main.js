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
var button = document.getElementById('counter');
var counter = 0;
button.onclick = function () {
  //Make  a request to the counter endpoint
  
  //Capture the response and store it  in a variable\
  
  //Render  the variable in the correct span
  counter = counter + 1;
  var span = getElementById('count');
  span.innerHTML = counter.toString();
  
};