import {
  Mesh,
  OGLRenderingContext,
  Plane,
  Program,
  TextureLoader,
  Transform,
  Vec2
} from 'ogl-typescript';

import map from '../../assets/map.jpg';
import map_bw from '../../assets/map-bw.jpg';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import map_noise from '../../assets/normal-distortion.jpg';

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

    const { map, mapBW, mapNoise } = this.loadTextures();

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
        uMapBW: { value: mapBW },
        uMapNoise: { value: mapNoise },
        uTime: { value: 0 },
        uMouse: { value: new Vec2(0, 0) },
        uImageSizes: { value: new Vec2(768, 768) },
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
    const texture = TextureLoader.load(this.gl, {
      generateMipmaps: false,
      src: map
    });

    const textureBW = TextureLoader.load(this.gl, {
      generateMipmaps: false,
      src: map_bw
    });

    const textureNoise = TextureLoader.load(this.gl, {
      generateMipmaps: false,
      src: map_noise
    });

    texture.needsUpdate = true;
    textureBW.needsUpdate = true;
    textureNoise.needsUpdate = true;

    return {
      map: texture,
      mapBW: textureBW,
      mapNoise: textureNoise
    };
  }
}
