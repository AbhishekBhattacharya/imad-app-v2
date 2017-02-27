//Client Side Javascript


console.log('Loaded!'); //prints Loaded! on the console.. see inspect element 
// can write Javascript code directly in Chrome Dev Tools(inspect element)

//Change the text of the main-text div
var element = document.getElementById('main-text'); // only one element of index.html should have a  id i.e unique
element.innerHTML = "New Value";

//Move the image 
var img = document.getElementById('madi');
var marginLeft = 0;
function moveRight() {
    marginLeft = marginLeft + 1 ;
    img.style.marginLeft = marginLeft + "px";
}
img.onclick=function(){
   img.style.marginLeft = "100px";
   var interval = setInterval(moveRight,50);//every 50 ms , apply the move right function
     
};
