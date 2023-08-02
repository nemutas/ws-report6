import { qs } from './utils'
import { WebGLCanvas } from './webgl/WebGLCanvas'

new WebGLCanvas(qs<HTMLCanvasElement>('.webgl-canvas'))
