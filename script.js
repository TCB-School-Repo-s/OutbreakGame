// Required variables
let rightKey = false;
let leftKey = false;
let canvasWidth = 1800
let canvasHeight = 750
let balSnelheidX = 5;
let balSnelheidY = 5;
let gameIsGestart = true;
let levenKwijt = false;
let levens = 3;
let score = 0;
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

plankConstructor.x = (canvasWidth / 2) - (plankConstructor.width / 2);
plankConstructor.y = canvasHeight - 50;

const balConstructor = {
  x: plankConstructor.x + (plankConstructor.width / 2),
  y: plankConstructor.y - 25,
  kleur: "#E6E6FA",
  diameter: 30
}

// Preload and Setup
function preload() {
  // load heart icon
  heartImage = loadImage('assets/heart.png');

  // load fonts
  loadFont('assets/sansbold.ttf');
  loadFont('assets/sans.ttf');
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

// Screen when live is lost
function levenKwijtScherm(){
  noStroke();
  fill('#FFEEEE');
  textAlign(CENTER);
  textFont('sansbold');
  textSize(40);
  text('Leven kwijt!', canvasWidth / 2, canvasHeight / 2)
  textSize(30);
  if(levens === 1){
    text('Je hebt nu ' + levens + ' leven over', canvasWidth / 2, canvasHeight / 2 + 40);
  }else{
    text('Je hebt nu ' + levens + ' levens over', canvasWidth / 2, canvasHeight / 2 + 40);
  }
  
}

function mainSchermTekst(){
  // score
  noStroke();
  fill('#FFEEEE');
  textFont('sans')
  textSize(20);
  text('Score: ' + score, 40, 30); // waarom verplaatst de score als je maar 2 levens hebt????? i dont begrijp

  // levens
  switch(levens){
    case 3:
      image(heartImage, width - 80, 10, 32, 32);
      image(heartImage, width - 114, 10, 32, 32);
      image(heartImage, width - 149, 10, 32, 32);
      break;
    case 2:
      image(heartImage, width - 80, 10, 32, 32);
      image(heartImage, width - 114, 10, 32, 32);
      break;
    case 1:
      image(heartImage, width - 80, 10, 32, 32);
      break;
  }
}

// Screen when live is lost
function eindeSpel(){
  noStroke();
  fill('#FFEEEE');
  textAlign(CENTER);
  textFont('sansbold');
  textSize(40);
  text('Game over!', canvasWidth / 2, canvasHeight / 2);
  textSize(30);
  text('Je eindscore is ' + score, canvasWidth / 2, canvasHeight / 2 + 40);
  score = 0;
  levens = 3;
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
    if(levens === 0){
      gameIsGestart = false;
    }else{
      levenKwijt = true;
      levens--;
    } 
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
  }else if(leftKey && plankConstructor.x > 0){
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
    case 74:
      level = 2;
      break;
    case 32:
      if(levenKwijt){
        levenKwijt = false;
        balConstructor.y = plankConstructor.y - 25;
        balConstructor.x = plankConstructor.x + (plankConstructor.width / 2);
      }else if(!gameIsGestart){
        gameIsGestart = true;
        plankConstructor.x = (canvasWidth / 2) - (plankConstructor.width / 2);
        balConstructor.y = plankConstructor.y - 25;
        balConstructor.x = plankConstructor.x + (plankConstructor.width / 2);
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

//Draw
function draw() {
  background("#f04352");
  if(gameIsGestart && !levenKwijt){ // If gameIsGestart and there is no life lost, draw plank and ball
    mainSchermTekst();
    gekkePlank();
    bal();
  }else if(levenKwijt){
     levenKwijtScherm();
  }else if(!gameIsGestart){
    eindeSpel();
  }
}

// VRAGEN VOOR WUMPIE --> HOE KAN HET DAT DEZELFDE CODE INEENS ANDERS WERKT DAN DAT IE DEED VOORHEEN?! (plank doet raar)

