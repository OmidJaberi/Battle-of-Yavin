export class Stars {
  static speed = 1e-3;
  static ctx;
  constructor(cnt, width, height, start = -1) {
    this.width = width;
    this.height = height;
    this.starCount = cnt;
    this.create(start);
  }
  create(start = -1) {
    this.stars = [];
    this.life = start;
    for (let i = 0; i < this.starCount; i++)
      this.stars.push({
        'x': Math.random(),
        'y': Math.random() + start,
        'phase': Math.random(),
        'freq': Math.random() * 0.4 + 0.4
      });
  }
  draw() {
    this.stars.forEach(star => {
      let opacity = Math.abs(star.phase * 1000 + parseInt(Date.now() * star.freq) % 1000 - 500) / 500;
      Stars.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      Stars.ctx.fillRect(parseInt(star.x * this.width), parseInt(star.y * this.height), 1, 1);
    });
    this.update();
  }
  update() {
    this.life += Stars.speed;
    if (this.life < 1)
      this.stars.forEach(star => { star.y += Stars.speed; });
    else
      this.create();
  }
}
