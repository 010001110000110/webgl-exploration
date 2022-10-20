import {
  Camera,
  Color,
  OGLRenderingContext,
  Raycast,
  Renderer,
  Transform,
  Vec2
} from 'ogl-typescript';

import { Viewport } from './viewport';
import { PlaneGeometry } from './plane-geometry';

export interface WebGLOptions {
  container: HTMLDivElement;
  vp: Viewport;
}

export class WebGL {
  container: HTMLDivElement;
  vp: Viewport;

  renderer: Renderer;
  gl: OGLRenderingContext;
  camera: Camera;
  scene: Transform;
  mouse: Vec2;
  raycast: Raycast;
  plane: PlaneGeometry;

  constructor({ container, vp }: WebGLOptions) {
    this.container = container;
    this.vp = vp;

    this.renderer = new Renderer({
      dpr: this.vp.pixelRatio,
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.gl = this.renderer.gl;
    const background = new Color('#161616');
    this.gl.clearColor(background.r, background.g, background.b, 1);
    container.appendChild(this.gl.canvas);

    this.camera = new Camera(this.gl);
    this.camera.position.set(0, 0, 2);
    this.vp.camera = this.camera;

    this.mouse = new Vec2();
    this.raycast = new Raycast(this.gl);

    this.scene = new Transform();

    this.plane = new PlaneGeometry({
      gl: this.gl,
      scene: this.scene
    });

    this.resize();
  }

  mouseMove({ x, y }: { x: number; y: number }) {
    this.mouse.set(x, y);

    this.raycast.castMouse(this.camera, this.mouse);

    const hits = this.raycast.intersectMeshes(this.plane.mesh, {
      includeUV: true
    });

    hits.forEach(mesh => {
      mesh.program.uniforms.uMouse.value = mesh.hit.uv;
    });
  }

  onKeyDown(key: string) {
    if (key === 'g') {
      this.plane.program.uniforms.uActivePointLight.value =
        !this.plane.program.uniforms.uActivePointLight.value;
    }
  }

  render() {
    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    });
  }

  resize() {
    this.renderer.setSize(this.vp.w, this.vp.h);
    this.renderer.dpr = this.vp.pixelRatio;

    this.camera.perspective({
      aspect: this.vp.wh
    });
  }
}
