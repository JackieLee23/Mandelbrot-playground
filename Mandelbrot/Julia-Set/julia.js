//set up canvas grid

var canvdiv = document.querySelector(".canvasContainer");
var canv = document.getElementById("Complex");
var ctx = canv.getContext("2d");
ctx.canvas.width = Math.floor(canvdiv.clientWidth);
ctx.canvas.height = Math.floor(canvdiv.clientHeight);

var xsize = Math.round(ctx.canvas.width / 2);
var ysize = Math.round(ctx.canvas.height / 2);
ctx.translate(xsize, ysize);


var grid = new Array(xsize * 2);
for (var i = 0; i < grid.length; i++) {
  grid[i] = new Array(ysize * 2);
  for (var j = 0; j < grid[i].length; j++) {
    grid[i][j] = [(i - xsize) / (ysize / 2), (j - ysize) / (ysize / 2)];
  }
}



//initial settings

var iterationOut = document.querySelector("#iterationNumberDisplay");
var equation = document.querySelector("#equation");
var divergedprop = document.querySelector("#divergedNum");
var area = 4 * xsize * ysize;
var cvnum = 0;
var p = 2;
var maxiterate = 30;
var iteration = 1;
var divlimit = 2;
var mousedown = false;
var pixelrad = divlimit * (ysize / 2);
var maxx = Math.floor(Math.min(xsize, pixelrad));
var maxy = 0;
var colored = true;
var logscaleon = true;
var xc = 0;
var yc = 0;
ctx.fillStyle = "blue";



//Handle sliders

//creal slider
var crealSlider = document.querySelector("#creal");
var crealSliderOut = document.querySelector("#crealSliderOut");
crealSliderOut.innerHTML = "C.Real: " + crealSlider.value;

crealSlider.oninput = function(){
  crealSliderOut.innerHTML = "C.Real: " + this.value;
  xc = parseFloat(crealSlider.value);
}

//
var cimagSlider = document.querySelector("#cimag");
var cimagSliderOut = document.querySelector("#cimagSliderOut");
cimagSliderOut.innerHTML = "C.imag: " + cimagSlider.value;

cimagSlider.oninput = function(){
  cimagSliderOut.innerHTML = "C.imag: " + this.value;
  yc = parseFloat(cimagSlider.value)
}

//Power Slider
var powSlider = document.querySelector("#power");
var powSliderOut = document.querySelector("#powSliderOut");
powSliderOut.innerHTML = "Power: " + powSlider.value;

powSlider.oninput = function(){
  powSliderOut.innerHTML = "Power: " + this.value;
  p = parseFloat(this.value);
}

//Iteration Slider
var itSlider = document.querySelector("#maxIterations");
var itSliderOut = document.querySelector("#iterationSliderOut");
itSliderOut.innerHTML = "Max iterations: " + itSlider.value;

itSlider.oninput = function(){
  itSliderOut.innerHTML = "Max iterations: " + this.value;
  maxiterate = parseInt(this.value);
}

//Limit Slider
var limitSlider = document.querySelector("#limit");
var limitSliderOut = document.querySelector("#limitSliderOut");
limitSliderOut.innerHTML = "Cutoff value: " + limitSlider.value;

limitSlider.oninput = function(){
  limitSliderOut.innerHTML = "Cutoff value: " + this.value;
  divlimit = parseFloat(this.value);
}

//add variables for checkbox options
var coloroption = document.querySelector("#color-option");
var logscale = document.querySelector("#log-scale");



var options = [powSlider, itSlider, limitSlider, crealSlider, cimagSlider, coloroption, logscale];

for (var i = 0; i < 7; i++){
  var item = options[i];
  item.onmousedown = function(){
    mousedown = true;
  }

  item.onmouseup = function(){
    mousedown = false;
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        grid[i][j] = [(i - xsize) / (ysize / 2), (j - ysize) / (ysize / 2)];
      }
    }
    window.requestAnimationFrame(drawset);
  }
}






//Change default javascript for dropdown
var dropdown = document.querySelector(".dropdown-toggle");

dropdown.onclick = function(){
  this.style.backgroundColor = "#003366";
  this.style.border = "#003366";
}

//initial draw
ctx.fillRect(-1 * xsize, -1 * ysize, xsize * 2, ysize * 2);
window.requestAnimationFrame(drawset);



//Drawing


//Resets initial values and draws whole set
function drawset(){
  //console.log("drawset: " + xc);
  colored = coloroption.checked;
  logscaleon = logscale.checked;

  equation.innerHTML = "Generating equation: f<sub>c</sub>(z) = z<sup>" + p + "</sup> + " + xc + " + " + yc + "i";

  if (colored) ctx.fillStyle = "blue";
  else ctx.fillStyle = "white";
  ctx.fillRect(-1 * xsize, -1 * ysize, xsize * 2, ysize * 2);

  pixelrad = divlimit * (ysize / 2);
  maxx = Math.ceil(Math.min(xsize, pixelrad));
  iteration = 1;
  cvnum = 0;
  window.requestAnimationFrame(draw);
}



//draws one iteration of animation
function draw() {
  //console.log(xc + ", " + yc);
  iterationOut.innerHTML = "Iteration number: " + iteration;
  for (var i = -1 * maxx; i < maxx; i++) {
    maxy = Math.min(ysize, Math.floor(Math.sqrt(pixelrad * pixelrad - i * i)));
    for (var j = -1 * maxy; j < maxy; j++) {

      if (mousedown) return;
      //check if current pixel has already diverged
      var freal = grid[i + xsize][j + ysize][0];
      var fimag = grid[i + xsize][j + ysize][1];
      if (freal * freal + fimag * fimag >= divlimit * divlimit) {
        continue;
      }

      //if current pixel has not diverged, calculate next iteration
      ctx.fillStyle = calculateColor(i, j);
      ctx.fillRect(i, j, 1, 1);
    }
  }
  var fract = 1 - cvnum / area;
  divergedprop.innerHTML = "Diverged proportion: " + fract.toFixed(4);
  iteration++;
  if (iteration > maxiterate || mousedown) return;
  if (!mousedown) window.requestAnimationFrame(draw);
}

//calculates the color of a pixel for an iteration
function calculateColor(i, j) {
  var freal = grid[i + xsize][j + ysize][0];
  var fimag = grid[i + xsize][j + ysize][1];

  var comp = power(freal, fimag);
  //console.log(i + ", " + j + ", " + freal + ", " + fimag);
  freal = comp[0] + xc;
  fimag = comp[1] + yc;


  //console.log(i + ", " + j + ", " + freal + ", " + fimag);

  //console.log(crealSlider.value + ", " + cimagSlider.value);


  grid[i + xsize][j + ysize][0] = freal;
  grid[i + xsize][j + ysize][1] = fimag;

  if (freal * freal + fimag * fimag >= divlimit * divlimit) {
    if (iteration > 1) cvnum--;
    if (!colored){
      return "white";
    }
    if (!logscaleon){
      var col = Math.floor(iteration * (255 / maxiterate));
    }
    else var col = Math.floor(Math.log(iteration) * (255 / Math.log(maxiterate)));

    return 'rgb(' + col + ', ' + col + ', ' + (255 - col) + ')';
  }
  if (iteration === 1) cvnum++;
  return "black";
}

//Calculates power of complex number
function power(freal, fimag){
  var r = Math.sqrt(freal * freal + fimag * fimag);
  if (r === 0) return [0, 0];
  var angle = Math.acos(freal / r);

  if (fimag < 0) angle = 2*Math.PI - angle;

  return [Math.pow(r, p) * Math.cos(angle * p), Math.pow(r, p) * Math.sin(angle * p)];
}




//Resize canvas when window changes
window.addEventListener('resize', function(){
  ctx.canvas.width = Math.floor(canvdiv.clientWidth);
  ctx.canvas.height = Math.floor(canvdiv.clientHeight);

  xsize = Math.round(ctx.canvas.width / 2);
  ysize = Math.round(ctx.canvas.height / 2);
  ctx.translate(xsize, ysize);


  grid = new Array(xsize * 2);
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(ysize * 2);
    for (var j = 0; j < grid[i].length; j++) {
      grid[i][j] = [(i - xsize) / (ysize / 2), (j - ysize) / (ysize / 2)];
    }
  }


  area = 4 * xsize * ysize;
  pixelrad = divlimit * (ysize / 2);
  maxx = Math.floor(Math.min(xsize, pixelrad));
  maxy = 0;

  drawset();

});
