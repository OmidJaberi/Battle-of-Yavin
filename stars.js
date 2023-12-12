export class Stars {
  static ctx;
  constructor(cnt, width, height, start = -1) {
    this.width = width;
    this.height = height;
    this.cnt = cnt;
    this.create(start);
  }
  create(start = -1) {
    this.arr = [];
    this.life = start;
    for (let i = 0; i < this.cnt; i++)
      this.arr.push({
        'x': parseInt(Math.random() * this.width),
        'y': parseInt((Math.random() + start) * this.height),
        'phase': Math.random(),
        'freq': Math.random() * 0.4 + 0.4
      });
  }
  draw() {
    for (let i = 0; i < this.cnt; i++) {
      let opac = Math.abs(this.arr[i].phase * 1000 + parseInt(Date.now() * this.arr[i].freq) % 1000 - 500) / 500;
      Stars.ctx.fillStyle = `rgba(255, 255, 255, ${opac})`;
      Stars.ctx.fillRect(this.arr[i].x, this.arr[i].y, 1, 1);
    }
    this.update();
  }
  update() {
    this.life += 0.001;
    if (this.life < 1)
      for (let i = 0; i < this.arr.length; i++) {
        this.arr[i].y += 0.001 * this.height;
      }
    else
      this.create();
  }
}
