export type V3 = [number, number, number]

export class Vector3 {
  /**
   * Subtracts（a - b）
   */
  static Sub(a: V3, b: V3) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]] as V3
  }

  static Normalize(a: V3) {
    const len = Math.hypot(...a)
    return [a[0] / len, a[1] / len, a[2] / len] as V3
  }

  // --------------------------------------------
  private vec3: V3 = [0, 0, 0]

  constructor(v3?: V3) {
    if (v3) {
      this.vec3 = this.copy(v3)
    }
  }

  get x() {
    return this.vec3[0]
  }
  get y() {
    return this.vec3[1]
  }
  get z() {
    return this.vec3[2]
  }
  get array() {
    return this.copy()
  }

  set x(v: number) {
    this.vec3[0] = v
  }
  set y(v: number) {
    this.vec3[1] = v
  }
  set z(v: number) {
    this.vec3[2] = v
  }
  set array(v: V3) {
    this.vec3 = [...v]
  }

  copy(v?: V3) {
    return [...(v ?? this.vec3)] as V3
  }

  clone() {
    return new Vector3([...this.vec3])
  }

  equal(v: Vector3) {
    return this.x === v.x && this.y === v.y && this.z === v.z
  }

  sub(v: Vector3) {
    this.vec3 = Vector3.Sub(this.array, v.array)
    return this
  }

  multiplyScalar(v: number) {
    this.x *= v
    this.y *= v
    this.z *= v
    return this
  }

  multiply(v: Vector3) {
    this.x *= v.x
    this.y *= v.y
    this.z *= v.z
    return this
  }

  normalize() {
    this.vec3 = Vector3.Normalize(this.vec3)
  }
}
