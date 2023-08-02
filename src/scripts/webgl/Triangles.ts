import { Program } from './Program'

export class Triangles extends Program {
  constructor(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string) {
    super(gl, vertexShader, fragmentShader)
  }

  draw(mode: number = this.gl.TRIANGLES, vertexCount?: number) {
    const count = vertexCount ?? this.vertexCount
    if (!count) return

    this.gl.drawArrays(mode, 0, count)
  }
}
