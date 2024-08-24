const COORDS = ['left', 'right', 'top', 'bottom'];

$(document).ready(() => {
  console.log("let's get ready to bumble!");
  startBackgroundWork();
  _.range(25).forEach(doSingleAnimation);
  checkRemixSupport();
});

function doSingleAnimation() {
  return getImageName()
    .then(loadImage)
    .then((img) => {
      let trajectory = getTrajectory(img);
      img.css({ left: trajectory.start.x, top: trajectory.start.y });

      mutateImage(img);

      let animateOptions = {
        left: trajectory.end.x + 'px',
        top: trajectory.end.y + 'px',
      };
      if (_.random(0, 100) < 25) {
        animateOptions.rotateZ = _.random(-720, 720) + 'deg';
      }
      img.velocity(animateOptions, {
        easing: null,
        duration: _.random(1000, 20000),
        complete: () => {
          img.remove();
          return doSingleAnimation();
        },
      });
    });
}

function mutateImage(img) {
  if (_.random(0, 1)) {
    flipHorizontal(img);
  }
  if ((img.width() == 400 || img.height() == 400) && _.random(0, 100) < 25) {
    let min = 150;
    img.css({ 'max-width': _.random(min, 400) + 'px' });
    img.css({ 'max-height': _.random(min, 400) + 'px' });
  }
}

function getTrajectory(img) {
  let start = randomEdgePoint();
  start = positionOffScreen(start, img);
  let end = randomEdgePoint(COORDS.filter((c) => c != start.coord));
  end = positionOffScreen(end, img);
  return { start: start, end: end };
}

function randomEdgePoint(coords) {
  coords = coords || COORDS;
  let coord = coords[_.random(0, coords.length - 1)];
  switch (coord) {
    case 'left':
      return { coord: coord, x: 0, y: randomY() };
    case 'right':
      return { coord: coord, x: $(window).width(), y: randomY() };
    case 'top':
      return { coord: coord, x: randomX(), y: 0 };
    case 'bottom':
      return { coord: coord, x: randomX(), y: $(window).height() };
  }
}

function positionOffScreen(point, img) {
  switch (point.coord) {
    case 'left':
      point.x = point.x - img.width();
      break;
    case 'top':
      point.y = point.y - img.height();
  }
  return point;
}

function randomX() {
  return _.random(0, $(window).width());
}

function randomY() {
  return _.random(0, $(window).height());
}

function flipHorizontal(img) {
  return img.css({
    '-moz-transform': 'scaleX(-1)',
    '-o-transform': 'scaleX(-1)',
    '-webkit-transform': 'scaleX(-1)',
    transform: 'scaleX(-1)',
    filter: 'FlipH',
    '-ms-filter': 'FlipH',
  });
}

function loadImage(filename) {
  return new Promise((fulfill, reject) => {
    let img = new Image();
    img.className = 'imgitem';
    img.onload = () => {
      img = $(img);
      $('body').append(img);
      fulfill(img);
    };
    img.src = `/images/${filename}`;
  });
}

function getImageName() {
  return new Promise((fulfill, reject) => {
    $.get('/i', (file) => {
      fulfill(file);
    });
  });
}

//---------------------------------------------------------------------------
// background stuff starts here....
function startBackgroundWork() {
  setupBgCanvas();
  const timer = setInterval(bgPath, 100);
  const bias_adjust = setInterval(() => {
    xtilt_bias = _.random(-21, 21);
  }, 45000);
  //...
}

function setupBgCanvas() {
  const c = document.getElementById('bk');
  const ctx = c.getContext('2d');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

var xtilt_bias = 0;

function bgPath() {
  const XSWAY = 12;
  const c = document.getElementById('bk');
  const ctx = c.getContext('2d');
  const ww = $(window).width();
  const wh = $(window).height();
  var x = randomX();
  var y = 0;
  // console.log(`x = ${x}, y = ${y}`)
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.strokeStyle = pickBgStokeOnce();
  ctx.globalAlpha = _.random(0.01, 0.1);
  while (y < wh) {
    dy = Math.min(wh, y + _.random(0, 0.05 * wh));
    ctx.lineTo(x, dy);
    y = dy;
    x = Math.max(0, Math.min(ww, x + _.random(-XSWAY, XSWAY) + xtilt_bias));
  }
  ctx.stroke();
}

function pickBgStokeOnce() {
  const colors = [
    '0, 0, 255',
    '83,102,132',
    '23,62,112',
    '0, 0, 0',
    '255, 255, 255',
  ];
  const color = _.sample(colors);
  return `rgb(${color})`;
}

async function checkRemixSupport() {
  if (await webgpuAvailable()) {
    $('#other_version').removeClass('hidden');
  }
}
