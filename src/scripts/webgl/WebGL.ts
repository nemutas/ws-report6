type Color = { r: number; g: number; b: number; a: number }

export abstract class WebGL {
  protected gl: WebGLRenderingContext
  private clearColor: Color = { r: 1, g: 1, b: 1, a: 1 }
  private resizeCallback?: () => void

  constructor(protected canvas: HTMLCanvasElement) {
    this.gl = this.createContext()
    this.resize()
    this.addEvents()
  }

  private createContext() {
    const gl = this.canvas.getContext('webgl')
    if (gl) {
      gl.enable(gl.DEPTH_TEST)
      return gl
    } else {
      throw new Error('webgl not supported')
    }
  }

  private addEvents() {
    window.addEventListener('resize', () => {
      this.resize()
      this.resizeCallback?.()
    })
  }

  protected resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.setViewport(0, 0, this.canvas.width, this.canvas.height)
  }

  protected setResizeCallback(callback: () => void) {
    this.resizeCallback = callback
  }

  protected get size() {
    return { width: this.canvas.width, height: this.canvas.height, aspect: this.canvas.width / this.canvas.height }
  }

  protected setViewport(x: number, y: number, w: number, h: number) {
    this.gl.viewport(x, y, w, h)
  }

  protected setClearColor(color?: Color) {
    if (color) {
      this.clearColor = { ...color }
    }
    this.gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearColor.a)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  protected setProgram(program: WebGLProgram) {
    this.gl.useProgram(program)
  }
}
