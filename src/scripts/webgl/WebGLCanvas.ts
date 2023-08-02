import { Triangles } from './Triangles'
import { WebGL } from './WebGL'
import { Matrix4 } from './core/Matrix4'
import { PerspectiveCamera } from './core/PerspectiveCamera'
import { Quaternion } from './core/Quaternion'
import fragmentShader from './shader/fragmentShader.glsl'
import vertexShader from './shader/vertexShader.glsl'

export class WebGLCanvas extends WebGL {
  private triangles: Triangles
  private camera?: PerspectiveCamera
  private modelMatrix: Matrix4
  private angle = 0

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    this.init()
    this.triangles = this.createTriangles()
    this.modelMatrix = this.createModelMatrix()
    this.createCamera()
    this.setResize()
    this.render()
  }

  private init() {
    this.setClearColor({ r: 0.1, g: 0.1, b: 0.1, a: 1 })
  }

  private createTriangles() {
    const triangles = new Triangles(this.gl, vertexShader, fragmentShader)
    const { position, normal } = this.createAttributes()

    triangles.setAttribute('position', position, 3)
    triangles.setAttribute('normal', normal, 3)

    triangles.setUniform('uTime', '1f', 0)
    triangles.setUniform('uCenter', '2fv', Float32Array.from([0.1, 0.1]))

    this.setProgram(triangles.PROGRAM)

    return triangles
  }

  private createAttributes() {
    const position: number[] = []
    const normal: number[] = []

    const size = { w: 0.5, h: 0.5 }
    const segments = { w: 200, h: 200 }
    const tile = { w: size.w / segments.w, h: size.h / segments.h }
    const half = { w: tile.w / 2, h: tile.h / 2 }

    // const gap = 0.001
    const gap = 0
    const offset = { w: (tile.w * (segments.w - 1)) / 2, h: (tile.h * (segments.h - 1)) / 2 }

    for (let w = 0; w < segments.w; w++) {
      for (let h = 0; h < segments.h; h++) {
        const x = w * (tile.w + gap) - offset.w
        const y = h * (tile.h + gap) - offset.h

        // prettier-ignore
        position.push(
          // left triangle
          x - half.w, 0, y + half.h,
          x - half.w, 0, y - half.h,
          x + half.w, 0, y + half.h,
          // right
          x + half.w, 0, y - half.h,
          x + half.w, 0, y + half.h,
          x - half.w, 0, y - half.h,
        )

        // prettier-ignore
        normal.push(
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
        )
      }
    }

    return { position: new Float32Array(position), normal: new Float32Array(normal) }
  }

  private createModelMatrix() {
    const modelMatrix = new Matrix4()
    this.triangles.setUniform('modelMatrix', 'm4', modelMatrix.array)
    return modelMatrix
  }

  private createCamera() {
    this.camera = new PerspectiveCamera({ fov: 30, aspect: this.size.aspect, near: 0.1, far: 10 })
    this.camera.setCoordinate('position', [0, 0.5, 1])

    this.triangles.setUniform('viewMatrix', 'm4', this.camera.viewMatrix.array)
    this.triangles.setUniform('projectionMatrix', 'm4', this.camera.projectionMatrix.array)
  }

  private setResize() {
    this.setResizeCallback(() => {
      this.camera?.setProperty('aspect', this.size.aspect)
    })
  }

  private render = () => {
    requestAnimationFrame(this.render)

    this.setClearColor()

    this.triangles.addUniformValue('uTime', 0.01)

    this.modelMatrix.rotate([0, 1, 0], 0.003)

    this.triangles.updateUniform('modelMatrix', this.modelMatrix.array)
    this.triangles.updateUniform('viewMatrix', this.camera?.viewMatrix.array)
    this.triangles.updateUniform('projectionMatrix', this.camera?.projectionMatrix.array)

    this.angle += 0.003
    const invRot = new Quaternion().rotate([0, 1, 0], this.angle).applyV3([0.15, 0, 0])
    this.triangles.updateUniform('uCenter', Float32Array.from([invRot[0], invRot[2]]))

    this.triangles.draw(this.gl.TRIANGLES)
  }
}
