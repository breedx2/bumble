setInterval(changeBackground, 10);

let r = 50;
let g = 0;
let b = 0;

function changeBackground() {
  let which = _.random(0, 2);
  let amt = _.random(-3, 3);
  switch (which) {
    case 0:
      r = Math.max(0, Math.min(r + amt, 256));
      break;
    case 1:
      g = Math.max(0, Math.min(g + amt, 256));
      break;
    case 2:
      b = Math.max(0, Math.min(b + amt, 256));
      break;
  }
  let color = `rgb(${r},${g},${b})`;
  $("body").css("background-color", color);
}

async function checkRemixSupport() {
  const available = await webgpuAvailable();
  // Weight this pretty high because most browsers don't support webgpu
  if (available && Math.random() < 0.7) {
    $("#bumble_link").attr("href", "/r");
  }
}

checkRemixSupport();
