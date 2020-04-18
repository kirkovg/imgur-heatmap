import './index.scss';
import 'bootstrap';
import { startSpinning, stopSpinning } from './spinner';
import fetch from './fetch';
import render from './render';

startSpinning();

window.onload = () => {
  stopSpinning();
};

document.getElementById('search').addEventListener('click', async () => {
  startSpinning();
  const userName = document.getElementById('userName').value;
  const data = await fetch(userName, 'comments');
  render(data);
  stopSpinning();
});
