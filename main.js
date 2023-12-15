import './style.css'
import { Stars } from './stars.js'
import { Ship } from './ship.js'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;

Stars.ctx = ctx;
Ship.ctx = ctx;
Ship.width = width;
Ship.height = height;

const stars1 = new Stars(100, width, height, 0);
const stars2 = new Stars(100, width, height);
const xWing = new Ship('x-wing', -1, 'red');
const tieFighter = new Ship();

let interval = setInterval(() => {
  ctx.clearRect(0, 0, width, height);
  stars1.draw();
  stars2.draw();
  Ship.draw();
  document.getElementById('charged').style.width = `${parseInt(xWing.blastCharge * 100)}%`;
  document.getElementById('charged').innerHTML = '<div></div>'.repeat(parseInt(xWing.blastCharge * 5));
}, 60);

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowRight':
      xWing.accelerate(+1);
      break;
    case 'ArrowLeft':
      xWing.accelerate(-1);
      break;
    case ' ':
      xWing.shoot();
      break;
  }
});

document.addEventListener('keyup', e => {
  switch (e.key) {
    case 'ArrowRight':
      xWing.break();
      break;
    case 'ArrowLeft':
      xWing.break();
      break;
  }
});

let i = setInterval(() => {
  if (Math.random() > 0.5 && tieFighter.active)
    tieFighter.shoot();
}, 1000);
