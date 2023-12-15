const explosion = new Image();
explosion.src = "/public/explosion.png";
const xWingImg = new Image();
xWingImg.src = "/public/x-wing.png";
const tieFighterImg = new Image();
tieFighterImg.src = "/public/tie-fighter.png";

const blastSound = '/public/blast.mp3';
const explosionSound = 'explosion.mp3';

export class Ship {
  static arr = [];
  static blastArr =[];
  static ctx;
  static width;
  static height;
  static draw() {
    let newArr = [];
    for (let i = 0; i < Ship.arr.length; i++)
      if (Ship.arr[i].active) {
        Ship.arr[i].draw();
        newArr.push(Ship.arr[i]);
      }
    Ship.arr = newArr;
    newArr = [];
    for (let i = 0; i < Ship.blastArr.length; i++)
      if (Ship.blastArr[i].y < Ship.height && Ship.blastArr[i].y >= -Ship.blastArr[i].length) {
        Ship.ctx.fillStyle = Ship.blastArr[i].color;
        Ship.ctx.fillRect(Ship.blastArr[i].x, Ship.blastArr[i].y, 1, Ship.blastArr[i].length);
      }
  }
  constructor(type = 'tie-fighter', dir = 1, color = 'green', w = 1 / 8, h = 1 / 8) {
    this.active = true;
    this.img = tieFighterImg;
    if (type != 'tie-fighter')
      this.img = xWingImg;
    this.width = w * Ship.height;
    this.height = h * Ship.height;
    this.posX = (Ship.width - this.width) / 2;
    if (dir == -1)
      this.posY = Ship.height - 1.3 * this.height;
    else
      this.posY = 0.3 * this.height;
    this.xDir = 0;
    this.yDir = dir;
    this.velocity = 0;
    this.move = null;
    this.bullets = [];
    this.color = color;
    this.blastCharge = 1;
    this.blastRecharge = null;
    Ship.arr.push(this);
  }
  draw() {
    Ship.ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
  }
  accelerate(xDir) {
    if (!this.active) return;
    if (this.xDir != 0)
      return;
    this.xDir = xDir;
    this.move = setInterval(() => {
      if (this.velocity < 0.02)
        this.velocity += 0.001;
      if ((this.xDir == +1 && this.posX + this.width >= Ship.width) || (this.xDir == -1 && this.posX <= 0)) {
        this.velocity = 0;
        this.xDir = 0;
        clearInterval(this.move);
      }
      this.posX += (this.velocity * this.xDir * Ship.width);
    }, 30);
  }
  break() {
    if (!this.active) return;
    if (this.xDir == 0)
      return;
    clearInterval(this.move);
    this.move = setInterval(() => {
      if (this.velocity > 0 && !(this.xDir == +1 && this.posX + this.width >= Ship.width) || (this.xDir == -1 && this.posX <= 0))
        this.velocity -= 0.001;
      else {
        this.velocity = 0;
        this.xDir = 0;
        clearInterval(this.move);
      }
      this.posX += (this.velocity * this.xDir * Ship.width);
    }, 30);
  }
  shoot() {
    if (!this.active || this.blastCharge < 0.2) return;
    let audio = new Audio(blastSound);
    audio.play();
    this.blastCharge -= 0.2;
    if (!this.blastRecharge)
      this.blastRecharge = setInterval(() => {
        this.blastCharge += 0.001;
          if (this.blastCharge >= 1) {
            clearInterval(this.blastRecharge);
            this.blastRecharge = null;
          }
      }, 10);
    const bullet = {
      'x': this.posX + this.width / 2,
      'y': this.posY + this.height / 2 * this.yDir,
      'color': this.color,
      'length': 2 * this.height / 3,
      'interval': null
    }
    Ship.blastArr.push(bullet);
    bullet.interval = setInterval(() => {
      bullet.y += 10 * this.yDir;
      for (let i = 0; i < Ship.arr.length; i++)
        if (Ship.arr[i].posX <= bullet.x && Ship.arr[i].posX + Ship.arr[i].width > bullet.x && Ship.arr[i].posY + Ship.arr[i].height / 2 <= bullet.y + bullet.length && Ship.arr[i].posY + Ship.arr[i].height / 2 > bullet.y) {
          Ship.arr[i].hit();
          bullet.y = -1000;
          clearInterval(bullet.interval);
        }
      if (bullet.y < -this.height || bullet.y > Ship.height)
        clearInterval(bullet.interval);
    }, 15);
  }
  hit() {
    if (!this.active) return;
    this.destroy();
  }
  destroy() {
    if (!this.active) return;
    let audio = new Audio(explosionSound);
    audio.play();
    this.img = explosion;
    let t = setTimeout(() => { this.active = false; }, 200);
  }
}
