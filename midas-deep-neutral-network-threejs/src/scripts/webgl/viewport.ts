import { Camera } from 'ogl-typescript';

export class Viewport {
  public w: number;
  public h: number;
  public wh: number;
  public pixelRatio: number;
  public container: HTMLDivElement;
  public camera: Camera | undefined;

  constructor(container: HTMLDivElement) {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.wh = this.w / this.h;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.container = container;
  }

  resize() {
    this.w = this.container.offsetWidth;
    this.h = this.container.offsetHeight;
    this.wh = this.w / this.h;
  }

  get viewSize() {
    if (this.camera) {
      const fovInRad = (this.camera.fov * Math.PI) / 180;
      const height = Math.abs(this.camera.position.z * Math.tan(fovInRad / 2) * 2);
      return { w: height * this.wh, h: height };
    }

    return { w: 0, h: 0 };
  }
}
