let randomNumber = () => {
  let num = Math.random() * 360;
  return num.toFixed(0);
};

console.log(randomNumber());

setInterval(() => {
  window.getComputedStyle(
    document.querySelector("main"),
    ":before"
  ).backgroundSize = `100% 400%`;
}, 5000);
