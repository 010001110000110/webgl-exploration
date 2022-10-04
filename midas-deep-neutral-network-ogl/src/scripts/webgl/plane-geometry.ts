import {
  Mesh,
  OGLRenderingContext,
  Plane,
  Program,
  TextureLoader,
  Transform,
  Vec2
} from 'ogl-typescript';

import depth from '../../assets/depth.png';
import normal from '../../assets/normal.png';
import diffuse from '../../assets/diffuse.jpg';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export interface PlaneGeometryOptions {
  gl: OGLRenderingContext;
  scene: Transform;
}

export class PlaneGeometry {
  gl: OGLRenderingContext;
  scene: Transform;
  geometry: Plane;
  program: Program;
  mesh: Mesh;

  constructor({ gl, scene }: PlaneGeometryOptions) {
    this.gl = gl;
    this.scene = scene;

    const { diffuse, normal, depth } = this.loadTextures();

    this.geometry = new Plane(this.gl, {
      width: 1,
      height: 1
    });

    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uDiffuse: { value: diffuse },
        uNormal: { value: normal },
        uDepth: { value: depth },
        uMouse: { value: new Vec2(0.5, 0.5) },
        uActivePointLight: { value: false }
      }
    });

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });

    this.mesh.setParent(this.scene);
  }

  loadTextures() {
    const diffuseTexture = TextureLoader.load(this.gl, {
      src: diffuse
    });

    const normalTexture = TextureLoader.load(this.gl, {
      src: normal
    });

    const depthTexture = TextureLoader.load(this.gl, {
      src: depth
    });

    diffuseTexture.needsUpdate = true;
    normalTexture.needsUpdate = true;
    depthTexture.needsUpdate = true;

    return {
      diffuse: diffuseTexture,
      normal: normalTexture,
      depth: depthTexture
    };
  }
}
