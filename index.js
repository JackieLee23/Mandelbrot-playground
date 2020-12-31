var ctx = document.getElementById("Complex").getContext("2d");

//settings
ctx.translate(1000, 500);
ctx.font = "30px Arial";
var xsize = 1000;
var ysize = 500;
var maxiterate = 100;
var iteration = 1;

//initialize grid
var grid = new Array(xsize * 2);
for (var i = 0; i < grid.length; i++) {
  grid[i] = new Array(ysize * 2);
  for (var j = 0; j < grid[i].length; j++) {
    grid[i][j] = [0, 0];
  }
}


window.requestAnimationFrame(draw);

//draws one iteration of animation
function draw() {
  for (var i = -1 * xsize; i < xsize; i++) {
    for (var j = -1 * ysize; j < ysize; j++) {

      //check if current pixel has already diverged
      var freal = grid[i + xsize][j + ysize][0];
      var fimag = grid[i + xsize][j + ysize][1];
      if (freal * freal + fimag * fimag >= 4) {
        continue;
      }

      //if current pixel has not diverged, calculate next iteration
      ctx.fillStyle = calculateColor(i, j);
      ctx.fillRect(i, j, 1, 1);
    }
  }
  ctx.fillStyle = "blue";
  ctx.fillRect(-1 * xsize, -1 * ysize, 500, 250);
  ctx.fillStyle = "white";
  ctx.fillText("Iteration number: " + iteration, -1 * xsize + 200, -1 * ysize + 200);
  iteration++;
  if (iteration >= maxiterate) return;
  window.requestAnimationFrame(draw);
}

//calculates the color of a pixel for an iteration
function calculateColor(i, j) {
  var xc = i / (ysize / 2);
  var yc = j / (ysize / 2);
  var freal = grid[i + xsize][j + ysize][0];
  var fimag = grid[i + xsize][j + ysize][1];

  var temp = freal;
  freal = temp * temp - fimag * fimag + xc;
  fimag = 2 * temp * fimag + yc;

  grid[i + xsize][j + ysize][0] = freal;
  grid[i + xsize][j + ysize][1] = fimag;

  if (freal * freal + fimag * fimag >= 4) {
    var col = Math.floor(Math.log(iteration) * (255 / Math.log(maxiterate)));
    return 'rgb(' + col + ', ' + col + ', ' + (255 - col) + ')';
  }


  return "black";
}
