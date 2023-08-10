import { M4, Matrix4 } from './Matrix4'
import { V3, Vector3 } from './Vector3'

type Qtn = [number, number, number, number]

export class Quaternion {
  private q: Qtn

  constructor(quaternion?: Qtn) {
    if (quaternion) this.q = [...quaternion]
    else this.q = this.identity()
  }

  set xyzw(_q: Qtn) {
    this.q = [..._q]
  }

  identity() {
    return [0, 0, 0, 1] as Qtn
  }

  inverse() {
    const _q = [...this.q]
    return new Quaternion([-_q[0], -_q[1], -_q[2], _q[3]])
  }

  multiply(b: Qtn) {
    const a = [...this.q]
    const out0 = a[0] * b[3] + a[3] * b[0] + a[1] * b[2] - a[2] * b[1]
    const out1 = a[1] * b[3] + a[3] * b[1] + a[2] * b[0] - a[0] * b[2]
    const out2 = a[2] * b[3] + a[3] * b[2] + a[0] * b[1] - a[1] * b[0]
    const out3 = a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
    return new Quaternion([out0, out1, out2, out3])
  }

  rotate(axis: V3, angle: number) {
    const normAxis = Vector3.Normalize(axis)
    const s = Math.sin(angle * 0.5)
    this.xyzw = [normAxis[0] * s, normAxis[1] * s, normAxis[2] * s, Math.cos(angle * 0.5)]
    return this
  }

  applyV3(v3: V3 | Vector3) {
    const v = v3 instanceof Vector3 ? v3.array : v3
    const vq = new Quaternion([v[0], v[1], v[2], 0])
    const cq = this.inverse()
    const mq = cq.multiply(vq.q).multiply(this.q)
    return [mq.q[0], mq.q[1], mq.q[2]] as V3
  }

  // prettier-ignore
  createMatrix4(dest?: Matrix4) {
    const out = dest ?? new Matrix4()
    const x = this.q[0], y = this.q[1], z = this.q[2], w = this.q[3]
    const _2x = x * 2, _2y = y * 2, _2z = z * 2
    const xx = x * _2x, xy = x * _2y, xz = x * _2z
    const yy = y * _2y, yz = y * _2z, zz = z * _2z
    const wx = w * _2x, wy = w * _2y, wz = w * _2z
    
    out.matrix = [
      [1 - (yy + zz),       xy - wz,       xz + wy, 0],
      [      xy + wz, 1 - (xx + zz),       yz - wx, 0],
      [      xz - wy,       yz + wx, 1 - (xx + yy), 0],
      [            0,             0,             0, 1]
    ] as M4

    return out.transpose()
  }
}
