import { WebGL } from './webgl/webgl';
import { Viewport } from './webgl/viewport';

export class Engine {
  container: HTMLDivElement;

  vp: Viewport;
  webgl: WebGL;

  constructor(container: HTMLDivElement) {
    this.container = container;

    this.vp = new Viewport(this.container);
    this.webgl = new WebGL({
      container: this.container,
      vp: this.vp
    });
  }

  init() {
    this.resize();

    window.requestAnimationFrame(this.loop.bind(this));

    this.initEvents();
  }

  initEvents() {
    window.addEventListener('resize', this.resize.bind(this), false);
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  }

  onMouseMove(event: MouseEvent) {
    const x = 2.0 * (event.x / this.vp.w) - 1.0;
    const y = 2.0 * (1.0 - event.y / this.vp.h) - 1.0;

    if (this.webgl) {
      this.webgl.mouseMove({ x, y });
    }
  }

  resize() {
    if (this.vp) {
      this.vp.resize();
    }

    if (this.webgl) {
      this.webgl.resize();
    }
  }

  loop() {
    if (this.webgl) {
      this.webgl.render();
    }

    window.requestAnimationFrame(this.loop.bind(this));
  }
}
