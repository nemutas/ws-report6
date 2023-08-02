import { Matrix4 } from './Matrix4'
import { V3, Vector3 } from './Vector3'

export class PerspectiveCamera {
  private fov: number
  private aspect: number
  private near: number
  private far: number
  private position: Vector3
  private target: Vector3
  private up: Vector3

  private _projectionMatrix: Matrix4
  private _viewMatrix: Matrix4

  constructor(params: { fov: number; aspect: number; near: number; far: number; position?: V3; target?: V3 }) {
    this.fov = params.fov
    this.aspect = params.aspect
    this.near = params.near
    this.far = params.far
    this.position = new Vector3(params.position)
    this.target = new Vector3(params.target)
    this.up = new Vector3([0, 1, 0])

    this._projectionMatrix = this.makeProjectionMatrix()
    this._viewMatrix = this.makeViewMatrix()
  }

  get projectionMatrix() {
    return this._projectionMatrix
  }

  get viewMatrix() {
    return this._viewMatrix
  }

  setCoordinate(key: 'position' | 'target', value: V3) {
    this[key].array = value
    this.makeViewMatrix(this._viewMatrix)
  }

  setProperty(key: 'fov' | 'aspect' | 'near' | 'far', value: number) {
    this[key] = value
    this.makeProjectionMatrix(this._projectionMatrix)
  }

  makeProjectionMatrix(dest?: Matrix4) {
    const [fov, aspect, near, far] = [this.fov, this.aspect, this.near, this.far]

    const mat = dest ?? new Matrix4()
    const t = near * Math.tan((fov * Math.PI) / 360)
    const r = t * aspect
    const a = r * 2
    const b = t * 2
    const c = far - near
    // prettier-ignore
    mat.matrix = [
      [(near * 2) / a,              0,                     0,  0],
      [             0, (near * 2) / b,                     0,  0],
      [             0,              0,     -(far + near) / c, -1],
      [             0,              0, -(far + near * 2) / c,  0],
    ]
    return mat
  }

  makeViewMatrix(dest?: Matrix4) {
    const [po, ta, up] = [this.position, this.target, this.up]

    const mat = dest ?? new Matrix4()

    if (po.equal(ta)) return mat

    const z = new Vector3(Vector3.Sub(po.array, ta.array))
    let l = 1 / Math.hypot(...z.array)
    z.multiplyScalar(l)

    const x = new Vector3(Vector3.Sub([up.y * z.z, up.z * z.x, up.x * z.y], [up.z * z.y, up.x * z.z, up.y * z.x]))
    l = Math.hypot(...x.array)
    if (l === 0) x.array = [0, 0, 0]
    else x.multiplyScalar(1 / l)

    const y = new Vector3(Vector3.Sub([z.x * x.y, z.z * x.x, z.x * x.y], [z.z * x.y, z.x * x.z, z.y * x.x]))
    l = Math.hypot(...y.array)
    if (l === 0) y.array = [0, 0, 0]
    else y.multiplyScalar(1 / l)

    const w1 = x.clone().multiply(po)
    const w2 = y.clone().multiply(po)
    const w3 = z.clone().multiply(po)
    const w = [-(w1.x + w1.y + w1.z), -(w2.x + w2.y + w2.z), -(w3.x + w3.y + w3.z)]

    // prettier-ignore
    mat.matrix = [
      [ x.x,  y.x,  z.x, 0],
      [ x.y,  y.y,  z.y, 0],
      [ x.z,  y.z,  z.z, 0],
      [w[0], w[1], w[2], 1]
    ]
    return mat
  }
}
