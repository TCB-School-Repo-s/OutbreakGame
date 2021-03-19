// Ball to construct a ball
export default class BallClass {

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
