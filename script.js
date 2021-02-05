// Required variables
let rightKey = false;
let leftKey = false;
let canvasWidth = 1500
let canvasHeight = 750
let balSnelheidX = 5;
let balSnelheidY = 5;
let gameIsGestart = true;
let levenKwijt = false;
let levens = 3;
let level = 1;
let leaderbord = [];

// Moeilijkheid
if(level > 1){
  balSnelheidX = balSnelheidX * level * 0.5;
  balSnelheidY = balSnelheidY * level * 0.5;
}

// Constructors
const plankConstructor = {
  x: 750,
  y: 700,
  width: 100,
  kleur: "cornflowerblue"
}

plankConstructor.x = (canvasWidth / 2) - (plankConstructor.width / 2)

const balConstructor = {
  x: plankConstructor.x + (plankConstructor.width / 2),
  y: 380,
  kleur: "lavender",
  diameter: 30
}

// Preload and Setup
function preload() {
  loadFont('assets/sansbold.ttf');
  loadFont('assets/sans.ttf');
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

//Draw
function draw() {
  background("#f04352");
  if(gameIsGestart && !levenKwijt){ // If gameIsGestart and there is no live lost, draw plank and ball
    gekkePlank();
    bal();
  }else if(levenKwijt){
     levenKwijtScherm();
  }
  
  
}

// Screen when live is lost
function levenKwijtScherm(){
  fill('#FFEEEE');
  textAlign(CENTER);
  noStroke();
  textFont('sansbold');
  textSize(40);
  text('Leven kwijt!', canvasWidth / 2, canvasHeight / 2)
  textFont('sans');
  textSize(30);
  if(levens === 1){
    text('Je hebt nu ' + levens + ' leven over', canvasWidth / 2, canvasHeight / 2 + 40);
  }else{
    text('Je hebt nu ' + levens + ' levens over', canvasWidth / 2, canvasHeight / 2 + 40);
  }
  
}

function mainSchermTekst(){
  fill('#FFEEEE');
  noStroke();
  textFont('sans')
}

// Ball function
function bal(){
  noStroke();
  fill(balConstructor.kleur);
  ellipse(balConstructor.x, balConstructor.y , balConstructor.diameter, balConstructor.diameter);

  if(balConstructor.y <= balConstructor.diameter / 2){ // If ball touches ceiling of canvas, bounce off
    balSnelheidY *= -1;
  }
  if(balConstructor.x <= balConstructor.diameter / 2 || balConstructor.x >= width - (balConstructor.diameter / 2)){ // If ball touches edge of canvas, bounce off
    balSnelheidX *= -1;
  }
  if(balConstructor.y >= height - ((height - plankConstructor.y) + (balConstructor.diameter / 2)) && balConstructor.x >= plankConstructor.x && balConstructor.x <= plankConstructor.x + (plankConstructor.width / 2)){ // If ball touches first part of blank, bounce to the left and bounce off
    if(balSnelheidX < 0) balSnelheidX = balSnelheidX;
    if(balSnelheidX > 0) balSnelheidX *= -1;
     balSnelheidY *= -1;
  }
  if(balConstructor.y >= height - ((height - plankConstructor.y) + (balConstructor.diameter / 2)) && balConstructor.x >= plankConstructor.x + (plankConstructor.width / 2) && balConstructor.x <= plankConstructor.x + plankConstructor.width){ // if ball touches second part of the plank, bounce to the right and bounce off
    if(balSnelheidX < 0) balSnelheidX *= -1;
    if(balSnelheidX > 0) balSnelheidX = balSnelheidX;
    balSnelheidY *= -1;
  }
  if(balConstructor.y >= 750){
    levenKwijt = true;
    levens--;
  }

  // ball movement
  balConstructor.x += balSnelheidX;
  balConstructor.y += balSnelheidY;
}

// Draw plank
function gekkePlank(){
  fill(plankConstructor.kleur);
  rect(plankConstructor.x, plankConstructor.y, plankConstructor.width, 20, 25);
  if(rightKey && plankConstructor.x < width - plankConstructor.width){
    plankConstructor.x += 18;
  }else if(leftKey && plankConstructor.x > 4){
    plankConstructor.x -= 18;
  }
}

function keyPressed() {
  switch(keyCode){
    case 39:
      rightKey = true;
      break;
    case 37:
      leftKey = true;
      break;
    case 32:
      if(levenKwijt){
        levenKwijt = false;
        balConstructor.y = 380;
        balConstructor.x = beweging + 50;
      }
      break;
  }
}

function keyReleased() {
  switch(keyCode){
    case 39:
      rightKey = false;
      break;
    case 37:
      leftKey = false;
      break;

  }
}

// VRAGEN VOOR WUMPIE --> HOE KAN HET DAT DEZELFDE CODE INEENS ANDERS WERKT DAN DAT IE DEED VOORHEEN?! (plank doet raar)

