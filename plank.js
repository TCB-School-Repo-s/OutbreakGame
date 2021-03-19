export default class PlankClass {

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

  plankMovement(){
    //
  }

}
