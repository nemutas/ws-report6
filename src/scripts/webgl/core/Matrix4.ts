import { Quaternion } from './Quaternion'
import { V3, Vector3 } from './Vector3'

// prettier-ignore
export type M4 = [
  [number, number, number, number], 
  [number, number, number, number], 
  [number, number, number, number], 
  [number, number, number, number]
]

export class Matrix4 {
  // statics
  static Zero(): M4 {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ] as M4
  }

  static Identity(): M4 {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ] as M4
  }

  static Multiply(a: M4, b: M4) {
    const out = Matrix4.Zero()
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        out[row][col] = a[row][0] * b[0][col] + a[row][1] * b[1][col] + a[row][2] * b[2][col] + a[row][3] * b[3][col]
      }
    }
    return out
  }

  static MultiplyScalar(a: M4, s: number) {
    return [
      [s * a[0][0], s * a[0][1], s * a[0][2], s * a[0][3]],
      [s * a[1][0], s * a[1][1], s * a[1][2], s * a[1][3]],
      [s * a[2][0], s * a[2][1], s * a[2][2], s * a[2][3]],
      [s * a[3][0], s * a[3][1], s * a[3][2], s * a[3][3]],
    ] as M4
  }

  /**
   * 転置行列
   */
  static Transpose(a: M4) {
    return [
      [a[0][0], a[1][0], a[2][0], a[3][0]],
      [a[0][1], a[1][1], a[2][1], a[3][1]],
      [a[0][2], a[1][2], a[2][2], a[3][2]],
      [a[0][3], a[1][3], a[2][3], a[3][3]],
    ] as M4
  }

  /**
   * 逆行列
   * @link http://www.info.hiroshima-cu.ac.jp/~miyazaki/knowledge/tech0023.html
   */
  static Inverse(a: M4) {
    // prettier-ignore
    const a11 = a[0][0], a12 = a[0][1], a13 = a[0][2], a14 = a[0][3],
          a21 = a[1][0], a22 = a[1][1], a23 = a[1][2], a24 = a[1][3],
          a31 = a[2][0], a32 = a[2][1], a33 = a[2][2], a34 = a[2][3],
          a41 = a[3][0], a42 = a[3][1], a43 = a[3][2], a44 = a[3][3]

    // prettier-ignore
    const det = a11 * a22 * a33 * a44 + a11 * a23 * a34 * a42 + a11 * a24 * a32 * a43
              + a12 * a21 * a34 * a43 + a12 * a23 * a31 * a44 + a12 * a24 * a33 * a41
              + a13 * a21 * a32 * a44 + a13 * a22 * a34 * a41 + a13 * a24 * a31 * a42
              + a14 * a21 * a33 * a42 + a14 * a22 * a31 * a43 + a14 * a23 * a32 * a41
              - a11 * a22 * a34 * a43 - a11 * a23 * a32 * a44 - a11 * a24 * a33 * a42
              - a12 * a21 * a33 * a44 - a12 * a23 * a34 * a41 - a12 * a24 * a31 * a43
              - a13 * a21 * a34 * a42 - a13 * a22 * a31 * a44 - a13 * a24 * a32 * a41
              - a14 * a21 * a32 * a43 - a14 * a22 * a33 * a41 - a14 * a23 * a31 * a42;

    if (det === 0) return Matrix4.Zero()

    const b11 = a22 * a33 * a44 + a23 * a34 * a42 + a24 * a32 * a43 - a22 * a34 * a43 - a23 * a32 * a44 - a24 * a33 * a42
    const b12 = a12 * a34 * a43 + a13 * a32 * a44 + a14 * a33 * a42 - a12 * a33 * a44 - a13 * a34 * a42 - a14 * a32 * a43
    const b13 = a12 * a23 * a44 + a13 * a24 * a42 + a14 * a22 * a43 - a12 * a24 * a43 - a13 * a22 * a44 - a14 * a23 * a42
    const b14 = a12 * a24 * a33 + a13 * a22 * a34 + a14 * a23 * a32 - a12 * a23 * a34 - a13 * a24 * a32 - a14 * a22 * a33

    const b21 = a21 * a34 * a43 + a23 * a31 * a44 + a24 * a33 * a41 - a21 * a33 * a44 - a23 * a34 * a41 - a24 * a31 * a43
    const b22 = a11 * a33 * a44 + a13 * a34 * a41 + a14 * a31 * a43 - a11 * a34 * a43 - a13 * a31 * a44 - a14 * a33 * a41
    const b23 = a11 * a24 * a43 + a13 * a21 * a44 + a14 * a23 * a41 - a11 * a23 * a44 - a13 * a24 * a41 - a14 * a21 * a43
    const b24 = a11 * a23 * a34 + a13 * a24 * a31 + a14 * a21 * a33 - a11 * a24 * a33 - a13 * a21 * a34 - a14 * a23 * a31

    const b31 = a21 * a32 * a44 + a22 * a34 * a41 + a24 * a31 * a42 - a21 * a34 * a42 - a22 * a31 * a44 - a24 * a32 * a41
    const b32 = a11 * a34 * a42 + a12 * a31 * a44 + a14 * a32 * a41 - a11 * a32 * a44 - a12 * a34 * a41 - a14 * a31 * a42
    const b33 = a11 * a22 * a44 + a12 * a24 * a41 + a14 * a21 * a42 - a11 * a24 * a42 - a12 * a21 * a44 - a14 * a22 * a41
    const b34 = a11 * a24 * a32 + a12 * a21 * a34 + a14 * a22 * a31 - a11 * a22 * a34 - a12 * a24 * a31 - a14 * a21 * a32

    const b41 = a21 * a33 * a42 + a22 * a31 * a43 + a23 * a32 * a41 - a21 * a32 * a43 - a22 * a33 * a41 - a23 * a31 * a42
    const b42 = a11 * a32 * a43 + a12 * a33 * a41 + a13 * a31 * a42 - a11 * a33 * a42 - a12 * a31 * a43 - a13 * a32 * a41
    const b43 = a11 * a23 * a42 + a12 * a21 * a43 + a13 * a22 * a41 - a11 * a22 * a43 - a12 * a23 * a41 - a13 * a21 * a42
    const b44 = a11 * a22 * a33 + a12 * a23 * a31 + a13 * a21 * a32 - a11 * a23 * a32 - a12 * a21 * a33 - a13 * a22 * a31

    return Matrix4.MultiplyScalar(
      [
        [b11, b12, b13, b14],
        [b21, b22, b23, b24],
        [b31, b32, b33, b34],
        [b41, b42, b43, b44],
      ],
      1 / det,
    )
  }

  // --------------------------------------------
  private mat4: M4

  constructor(matrix?: M4) {
    this.mat4 = matrix ?? Matrix4.Identity()
  }

  get matrix() {
    return this.mat4
  }

  set matrix(m: M4) {
    this.mat4 = [[...m[0]], [...m[1]], [...m[2]], [...m[3]]]
  }

  get array() {
    return this.mat4.flat()
  }

  clone() {
    const m = this.mat4
    return new Matrix4([[...m[0]], [...m[1]], [...m[2]], [...m[3]]])
  }

  multiply(target: Matrix4) {
    this.mat4 = Matrix4.Multiply(this.mat4, target.matrix)
    return this
  }

  premultiply(target: Matrix4) {
    this.mat4 = Matrix4.Multiply(target.matrix, this.mat4)
    return this
  }

  multiplyScalar(v: number) {
    this.mat4 = Matrix4.MultiplyScalar(this.mat4, v)
    return this
  }

  transpose() {
    this.mat4 = Matrix4.Transpose(this.mat4)
    return this
  }

  inverse() {
    this.mat4 = Matrix4.Inverse(this.mat4)
    return this
  }

  translate(v: Vector3 | V3) {
    const v3 = v instanceof Vector3 ? v.array : v
    // prettier-ignore
    const tMat = new Matrix4([
      [1, 0, 0, v3[0]],
      [0, 1, 0, v3[1]],
      [0, 0, 1, v3[2]],
      [0, 0, 0,     1],
    ]).transpose() // glslでは、行列が[0][0], [1][0], [2][0], [3][0], [0][1],... の同列から解釈されるので、transposeして辻褄を合わせる
    this.multiply(tMat)
    return this
  }

  scale(v: Vector3 | V3) {
    const v3 = v instanceof Vector3 ? v.array : v
    // prettier-ignore
    const sMat = new Matrix4([
      [v3[0],     0,     0, 0],
      [    0, v3[1],     0, 0],
      [    0,     0, v3[2], 0],
      [    0,     0,     0, 1],
    ])
    this.multiply(sMat)
    return this
  }

  rotate(axis: Vector3 | V3, angle: number) {
    const ax = axis instanceof Vector3 ? axis.array : axis
    const q = new Quaternion()
    this.multiply(q.rotate(ax, angle).createMatrix4())
    return this
  }
}
