// Required variables
let rightKey = false;
let leftKey = false;
const canvasWidth = 1800
const canvasHeight = 750
let balSnelheidX = 7;
let balSnelheidY = 7;
var rij = 9;
var kolom = 8;
let gameIsGestart = true;
let levenKwijt = false;
let volgendLevel = false;
let levens = 3;
let score = 0;
let level = 1;
let currentSong;
const kleurtjes = ['#7400B8', '#6930C3', '#5E60CE', '#5390D9', '#4EA8DE', '#48BFE3', '#56CFE1', '#64DFDF', '#72EFDD', '#80FFDB'];
const powerUp = ['BIGGER_PLANK', "EXTRA_BALL", "TRIPLE_BALL"]
const blokkies = [];

/*
Voor de bal:
1. Class voor bal object maken (gedaan)
2. functie omschrijven om bal class the gebruiker(gedaan)
3. functie herschrijven om als er meer ballen zijn niet gelijk leven eraf
3.1 Als er weer maar 1 bal is dan natuurlijk weer leven eraf 
*/

// save data
if(window.localStorage.getItem('musicVolume') === null){ // muziekVolume opslaan
  window.localStorage.setItem('musicVolume', 0.03);
  var muziekVolume = parseFloat(window.localStorage.getItem('musicVolume'));
}else {
  var muziekVolume = parseFloat(window.localStorage.getItem('musicVolume'));
}

if(window.localStorage.getItem('leaderboard') === null){
  // leaderboard komt hier
}

// Plank constructor -- will be converted to
const plankConstructor = {
  x: 750,
  y: 700,
  width: 100,
  kleur: "#ABABAB"
}

// Place the plank in the middle of the screen
plankConstructor.x = (canvasWidth / 2) - (plankConstructor.width / 2);
plankConstructor.y = canvasHeight - 50;


// Ball to construct a ball
class BallClass {

  constructor(x, y, diameter, kleur){
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.kleur = kleur;
  }

  drawBall() {
    noStroke();
    fill(this.kleur)
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

}

/*
class PlankClass {

  constructor(x, y, width, height, kleur, round){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.kleur = kleur;
    this.round = round
  }

  drawPlank(){
    noStroke();
    fill(this.kleur);
    rect(this.x, this.y, this.width, this.height, this.round);
  }

}

const plank = new PlankClass((canvasWidth / 2) - (plankConstructor.width / 2), canvasHeight - 50, 100, 20, 25);

*/

const ballArray = [new BallClass(plankConstructor.x + (plankConstructor.width / 2), plankConstructor.y - 25, 30, "#FFFFFF"), new BallClass(plankConstructor.x + (plankConstructor.width / 2), plankConstructor.y - 25, 30, "#FFFFFF")] // register all balls needed (three in total)

function ball(ballObject) {
  ballObject.drawBall(); // drawBall method from the ball class

  if (ballObject.y <= ballObject.diameter / 2) { // If ball touches ceiling of canvas, bounce off
    balSnelheidY *= -1;
  }
  if (ballObject.x <= ballObject.diameter / 2 || ballObject.x >= width - (ballObject.diameter / 2)) { // If ball touches edge of canvas, bounce off
    balSnelheidX *= -1;
  }
  if (ballObject.y >= height - ((height - plankConstructor.y) + (ballObject.diameter / 2)) && ballObject.x >= plankConstructor.x && ballObject.x <= plankConstructor.x + (plankConstructor.width / 2)) { // If ball touches first part of plank, bounce to the left and bounce off
    if (balSnelheidX < 0) balSnelheidX = balSnelheidX; // invertion of ballx
    if (balSnelheidX > 0) balSnelheidX *= -1;
    plankGeluid.play();
    rightKey = false
    leftKey = false
    balSnelheidY *= -1;
  }
  if (ballObject.y >= height - ((height - plankConstructor.y) + (ballObject.diameter / 2)) && ballObject.x >= plankConstructor.x + (plankConstructor.width / 2) && ballObject.x <= plankConstructor.x + plankConstructor.width) { // if ball touches second part of the plank, bounce to the right and bounce off
    if (balSnelheidX < 0) balSnelheidX *= -1;
    if (balSnelheidX > 0) balSnelheidX = balSnelheidX;
    plankGeluid.play();
    rightKey = false
    leftKey = false
    balSnelheidY *= -1;
  }

  // Check for each block if the ball touches it and then remove the block from array
  blokkies.forEach((blok, index) => {
    if(ballObject.y < blok.y + 2 + blok.h + ballObject.diameter / 2 && ballObject.x > blok.x  && ballObject.x < blok.x + blok.b){
      if(blok.powerup.enabled){
        let type = powerUp[blok.powerup.type];
        console.log(type)
        switch(type){
          case "BIGGER_PLANK":
              plankConstructor.width = 150;
              setTimeout(() => {
                plankConstructor.width = 100;
              }, 30000);
              break;
          case "EXTRA_BALL":

              break;
          case "TRIPLE_BALL":
              break;
        }
      }
      blokGeluid.play(); // plays block sound
      console.log("Block broken");
      score++;
      blokkies.splice(index, 1);
      balSnelheidY *= -1;
    }
  })

// Checks if there are any blocks left, if there are none --> next level
  if(blokkies.length === 0){
    level++
    balSnelheidX++
    balSnelheidY++
    if (rij <= 14){
      rij++
    }
    volgendLevel = true;
    gameIsGestart = false;
  }

  // Checks if the ball goes out of screen on the bottom. if it is --> lose life
  if (ballObject.y >= 750) {
    if (levens === 0) { // no lives left? game over
      currentSong.stop();
      gameIsGestart = false;
      gameOverGeluid.play();
    } else {
      levenKwijtGeluid.play();
      levenKwijt = true;
      levens--;
    }
  }

  // ball movement
  ballObject.x += balSnelheidX;
  ballObject.y += balSnelheidY;
}

// Preload and Setup
function preload() {
  // Sounds
  soundFormats('mp3');
  blokGeluid = loadSound('assets/blockhit');
  plankGeluid = loadSound('assets/paddlehit');
  levenKwijtGeluid = loadSound('assets/livelost');
  gameOverGeluid = loadSound('assets/death.mp3');
  themeSongs = [loadSound('assets/music/1'), loadSound('assets/music/2'), loadSound('assets/music/3'), loadSound('assets/music/4'), loadSound('assets/music/5')];

  // load fonts
  loadFont('assets/sansbold.ttf');
  loadFont('assets/sans.ttf');

  // instellingen gui
  sliderRange(0, 1, 0.01);
  var gui = createGui('Instellingen');
  gui.addGlobals('muziekVolume');
}



function setup() {
  createCanvas(canvasWidth, canvasHeight);
  maakBlokkies(); // creates blocks and pushes them to array
  blokGeluid.setVolume(0.3);
  plankGeluid.setVolume(0.3);
  levenKwijtGeluid.setVolume(0.3);
  gameOverGeluid.setVolume(0.3);
}

// Screen when live is lost
function levenKwijtScherm() {
  noStroke();
  fill('#FFEEEE');
  textAlign(CENTER);
  textFont('sansbold');
  textSize(40);
  text('Leven kwijt!', canvasWidth / 2, canvasHeight / 2)
  textSize(30);
  if (levens === 1) {
    text('Je hebt nu ' + levens + ' leven over', canvasWidth / 2, canvasHeight / 2 + 40);
  } else {
    text('Je hebt nu ' + levens + ' levens over', canvasWidth / 2, canvasHeight / 2 + 40);
  }
}

// scherm volgend level
function volgendlevelScherm(){
  noStroke();
  fill('#FFEEEE');
  textAlign(CENTER);
  textFont('sansbold');
  textSize(40)
  text('Gefeliciteerd!', canvasWidth / 2, canvasHeight / 2)
  textSize(30);
  text('Je hebt level ' + (level - 1) + ' gehaald!', canvasWidth / 2, canvasHeight / 2 + 40 );
}

function mainSchermTekst() {
  // score
  noStroke();
  fill('#FFEEEE');
  textFont('sans')
  textSize(20);
  text('Score: ' + score, 45, 30);

  // levens
  switch (levens) {
    case 3:
      fill('#E6E6FA')
      hart(width - 80, 10, 25)
      hart(width - 114, 10, 25)
      hart(width - 149, 10, 25)
      break;
    case 2:
      fill('#E6E6FA')
      hart(width - 80, 10, 25)
      hart(width - 114, 10, 25)
      break;
    case 1:
      fill('#E6E6FA')
      hart(width - 80, 10, 25)
      break;
  }

}

function chance(p){
  var d = Math.random();
  if(d < ((100 - p) / 100)){
    return false;
  }else {
    return true;
  }
}

// Maakt de blokjes
function maakBlokkies() {
  const blokBreedte = width / kolom - 4
  for (let c = 0; c < kolom; c++) {
    for (let l = 0; l < rij; l++) {
      // const powerupType = Math.round(Math.random() * (2 - 0) + 0)
      const powerupType = 0;

      const blok = {
        kleur: kleurtjes[l],
        h: 30,
        b: blokBreedte,
        powerup: {
          enabled: chance(25),
          type: powerupType
        },
        x: c * (blokBreedte + 2) + 10,
        y: l * (30 + 2) + 40
      }
      blokkies.push(blok);
    }
  }
}

function blokkiesZeichnen() {
  blokkies.forEach(blok => {
    fill(blok.kleur);
    rect(blok.x, blok.y, blok.b, blok.h);
  })
}

// Screen when no life left
function eindeSpel() {
  noStroke();
  fill('#FFEEEE');
  textAlign(CENTER);
  textFont('sansbold');
  textSize(40);
  text('Game over!', canvasWidth / 2, canvasHeight / 2);
  textSize(30);
  text('Je eindscore is ' + score, canvasWidth / 2, canvasHeight / 2 + 40);
}

// Hart shape
function hart(x, y, s) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - s / 2, y - s / 2, x - s, y + s / 3, x, y + s);
  bezierVertex(x + s, y + s / 3, x + s / 2, y - s / 2, x, y);
  endShape(CLOSE);
}



function gekkePlank() {
  fill(plankConstructor.kleur);
  rect(plankConstructor.x, plankConstructor.y, plankConstructor.width, 20, 25);
  if (rightKey && plankConstructor.x < width - plankConstructor.width) {
    plankConstructor.x += 18;
  } else if (leftKey && plankConstructor.x > 0) {
    plankConstructor.x -= 18;
  }
}

function keyPressed() {
  switch (keyCode) {
    case 39:
      rightKey = true;
      break;
    case 37:
      leftKey = true;
      break;
    case 32:
      if (levenKwijt) { // Life lost and pressed space? restart game
        levenKwijt = false;
        ballArray.forEach((ball) => {
          ball.y = plankConstructor.y - 25;
          ball.x = plankConstructor.x + (plankConstructor.width / 2);
        })
      } else if (!gameIsGestart && !volgendLevel) { // Game over and pressed space? restart game from zero
        rij = 9;
        kolom = 8;
        level = 1;
        blokkies.length = 0;
        balSnelheidX = 7;
        balSnelheidY = 7;
        maakBlokkies();
        score = 0;
        levens = 3;
        plankConstructor.x = (canvasWidth / 2) - (plankConstructor.width / 2);
        ballArray.forEach((ball) => {
          ball.y = plankConstructor.y - 25;
          ball.x = plankConstructor.x + (plankConstructor.width / 2);
        })
        gameIsGestart = true;
      } else if (!gameIsGestart && volgendLevel){ // Goes to next level if you pressed space.
        maakBlokkies();
        plankConstructor.x = (canvasWidth / 2) - (plankConstructor.width / 2);
        ballArray.forEach((ball) => {
          ball.y = plankConstructor.y - 25;
          ball.x = plankConstructor.x + (plankConstructor.width / 2);
        })
        volgendLevel = false;
        gameIsGestart = true;
      }
      break;
  }
}

function keyReleased() {
  switch (keyCode) {
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
  background("#000000");
  window.localStorage.setItem('musicVolume', muziekVolume);
  if (gameIsGestart && !levenKwijt) {// If gameIsGestart and there is no life lost, draw plank and ball
    if(currentSong){ 
      if(!currentSong.isPlaying()){
        let song = Math.round(Math.random() * (4 - 0) + 0);
        console.log(song)
        currentSong = themeSongs[song];
        currentSong.setVolume(parseFloat(window.localStorage.getItem('musicVolume')));
        currentSong.play();
      }else{
        currentSong.setVolume(parseFloat(window.localStorage.getItem('musicVolume')))
      }
    }else {
      let song = Math.round(Math.random() * (4 - 0) + 0);
      console.log(song)
      currentSong = themeSongs[song];
      currentSong.setVolume(parseFloat(window.localStorage.getItem('musicVolume')));
      currentSong.play();
    }
    blokkiesZeichnen()
    gekkePlank();
    ball(ballArray[0]);
    mainSchermTekst();
  } else if (levenKwijt) {
    levenKwijtScherm();
    currentSong.setVolume(parseFloat(window.localStorage.getItem('musicVolume')));
  } else if (!gameIsGestart && !volgendLevel) {
    eindeSpel();
  } else if(volgendLevel && !gameIsGestart){
    volgendlevelScherm();
  }
}


