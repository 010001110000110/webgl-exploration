import '../styles/main.scss';

import { Engine } from './engine';

window.addEventListener('load', () => {
  const container = document.getElementById('app') as HTMLDivElement;
  const engine = new Engine(container);
  engine.init();
});
