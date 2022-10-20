import {
  Mesh,
  OGLRenderingContext,
  Plane,
  Program,
  TextureLoader,
  Transform,
  Vec2
} from 'ogl-typescript';

import depth from '../../assets/depth-map.png';
import map from '../../assets/map.jpg';
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

    const { map, depth } = this.loadTextures();

    const geometrySize = {
      w: 1,
      h: 1.3
    };

    this.geometry = new Plane(this.gl, {
      width: geometrySize.w,
      height: geometrySize.h
    });

    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uMap: { value: map },
        uDepth: { value: depth },
        uMouse: { value: new Vec2(0.5, 0.5) },
        uImageSizes: { value: new Vec2(3648, 5472) },
        uPlaneSizes: { value: new Vec2(geometrySize.w, geometrySize.h) }
      }
    });

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });

    this.mesh.setParent(this.scene);
  }

  loadTextures() {
    const mapTexture = TextureLoader.load(this.gl, {
      src: map
    });

    const depthTexture = TextureLoader.load(this.gl, {
      src: depth
    });

    mapTexture.needsUpdate = true;
    depthTexture.needsUpdate = true;

    return {
      map: mapTexture,
      depth: depthTexture
    };
  }
}
