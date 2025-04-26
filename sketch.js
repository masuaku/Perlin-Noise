let data = [];
let center = [];
let topLeftVector = [];
let topRightVector = [];
let botLeftVector = [];
let botRightVector = [];
let topLeftDP = [];
let topRightDP = [];
let botLeftDP = [];
let botRightDP = [];
let PN = [];

// Initialize the gradient vector field (randomized)
for (let i = 0; i < 10; i++) {
  data[i] = [];
  topLeftVector[i] = [];
  topRightVector[i] = [];
  botLeftVector[i] = [];
  botRightVector[i] = [];
  topLeftDP[i] = [];
  topRightDP[i] = [];
  botLeftDP[i] = [];
  botRightDP[i] = [];
  PN[i] = [];

  for (let j = 0; j < 10; j++) {
    data[i][j] = [Math.random() * 2 - 1, Math.random() * 2 - 1]; // Random vectors in range [-1,1]
  }
}

// Compute Perlin noise at each center point
for (let i = 0; i < 10; i++) {
  center[i] = [];
  PN[i] = [];

  for (let j = 0; j < 10; j++) {
    center[i][j] = 0;

    if (i > 0 && i < 9 && j > 0 && j < 9) {
      let u = (i % 1); // Fractional x component
      let v = (j % 1); // Fractional y component

      // Compute offset vectors
      topLeftVector[i-1][j-1] = [u, v];
      topRightVector[i+1][j-1] = [u - 1, v];
      botLeftVector[i-1][j+1] = [u, v - 1];
      botRightVector[i+1][j+1] = [u - 1, v - 1];

      // Compute dot products
      topLeftDP[i-1][j-1] = data[i-1][j-1][0] * topLeftVector[i-1][j-1][0] + data[i-1][j-1][1] * topLeftVector[i-1][j-1][1];
      topRightDP[i+1][j-1] = data[i+1][j-1][0] * topRightVector[i+1][j-1][0] + data[i+1][j-1][1] * topRightVector[i+1][j-1][1];
      botLeftDP[i-1][j+1] = data[i-1][j+1][0] * botLeftVector[i-1][j+1][0] + data[i-1][j+1][1] * botLeftVector[i-1][j+1][1];
      botRightDP[i+1][j+1] = data[i+1][j+1][0] * botRightVector[i+1][j+1][0] + data[i+1][j+1][1] * botRightVector[i+1][j+1][1];

      // Perform bilinear interpolation
      let LTop = topLeftDP[i-1][j-1] + u * (topRightDP[i+1][j-1] - topLeftDP[i-1][j-1]);
      let LBot = botLeftDP[i-1][j+1] + u * (botRightDP[i+1][j+1] - botLeftDP[i-1][j+1]);
      let LVert = LBot + v * (LTop - LBot);

      PN[i][j] = LVert;
    } else {
      PN[i][j] = data[i][j][0]; // Use one component of the gradient for edges
    }
  }
}

console.table(PN);

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  let w = 40;
  let h = 40;
  
  for (let m = 0; m < 10; m++) {  
    for (let n = 0; n < 10; n++) {  
      let colorCode = Math.abs(Math.floor(PN[m][n] * 100) * 25.6 / 100);
      fill(colorCode, colorCode, colorCode);
      rect(m * w, n * h, w, h);
    }
  }
}
