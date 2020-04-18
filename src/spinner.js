export function startSpinning() {
  document.getElementById('loader').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

export function stopSpinning() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}
