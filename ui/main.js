//Client Side Javascript


console.log('Loaded!'); //prints Loaded! on the console.. see inspect element 
// can write Javascript code directly in Chrome Dev Tools(inspect element)

//Change the text of the main-text div
var element = document.getElementById("main-text");
element.innerHTML = "New Value";

//Move the image 
var img = document.getElementById('img');
img.onclick = function () {
    img.style.marginLeft = "100px";
};
