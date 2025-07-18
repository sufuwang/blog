import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default function Histogram() {
  const createLine = (type) => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      type === 'y' ? new THREE.Vector3(0, 100, 0) : new THREE.Vector3(100, 0, 0),
    ]
    const geometry = new THREE.BufferGeometry()
    const material = new THREE.LineBasicMaterial({
      color: '#ffffff',
    })
    geometry.setFromPoints(points)
    return new THREE.Line(geometry, material)
  }
  const createScaleLine = (type) => {
    const points: Array<THREE.Vector3> = []
    for (let i = 0; i <= 100; i += 10) {
      if (type === 'y') {
        points.push(new THREE.Vector3(0, i, 0))
        points.push(new THREE.Vector3(-5, i, 0))
      } else {
        points.push(new THREE.Vector3(i, 0, 0))
        points.push(new THREE.Vector3(i, -5, 0))
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: '#ffffff',
    })
    return new THREE.LineSegments(geometry, material)
  }
  const createCanvas = (text) => {
    const canvas = document.createElement('canvas')
    const w = (canvas.width = 100)
    const h = (canvas.height = 100)
    const c = canvas.getContext('2d')!
    c.translate(w / 2, h / 2)
    c.fillStyle = '#ffffff'
    c.font = 'normal 48px 宋体'
    c.textBaseline = 'middle'
    c.textAlign = 'center'
    c.fillText(text, 0, 0)
    return canvas
  }
  const createNum = (dataArr) => {
    const numbers = new THREE.Group()
    dataArr.forEach((item, i) => {
      const texture = new THREE.CanvasTexture(createCanvas(item))
      const geometry = new THREE.PlaneGeometry(10, 10)
      const material = new THREE.MeshBasicMaterial({
        // color: 'orange',
        side: THREE.DoubleSide,
        map: texture,
      })
      const num = new THREE.Mesh(geometry, material)
      num.position.y = item + 4
      num.position.x = 10 + i * 20 + 5
      numbers.add(num)
    })
    return numbers
  }
  const createBar = (dataArr) => {
    const bars = new THREE.Group()
    dataArr.forEach((item, i) => {
      const geometry = new THREE.PlaneGeometry(10, item, 1, 20)
      const positions = geometry.attributes.position
      const colorsArr: Array<number> = []
      const color1 = new THREE.Color('green')
      const color2 = new THREE.Color('blue')
      const color3 = new THREE.Color('red')
      for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i) + item / 2
        if (y <= 50) {
          const percent = y / 50
          const c = color1.clone().lerp(color2, percent)
          colorsArr.push(c.r, c.g, c.b)
        } else if (y > 50 && y <= 100) {
          const percent = (y - 50) / 50
          const c = color2.clone().lerp(color3, percent)
          colorsArr.push(c.r, c.g, c.b)
        }
      }
      const colors = new Float32Array(colorsArr)
      geometry.attributes.color = new THREE.BufferAttribute(colors, 3)
      const material = new THREE.MeshBasicMaterial({
        // color: 'orange'
        vertexColors: true,
        side: THREE.DoubleSide,
      })
      const bar = new THREE.Mesh(geometry, material)
      bar.position.x = 15 + i * 20
      bar.position.y = item / 2
      bars.add(bar)
    })
    return bars
  }

  useEffect(() => {
    const scene = new THREE.Scene()
    const group = new THREE.Group()

    {
      const xLine = createLine('x')
      const yLine = createLine('y')
      const xScaleLine = createScaleLine('x')
      const yScaleLine = createScaleLine('y')
      const h = [70, 22.2, 100, 40, 50]
      const bar = createBar(h)
      const numbers = createNum(h)
      group.add(xLine, yLine, xScaleLine, yScaleLine, bar, numbers)
    }

    scene.add(group)

    const directionLight = new THREE.DirectionalLight(0xffffff)
    directionLight.position.set(500, 400, 300)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    // const axesHelper = new THREE.AxesHelper(20000)
    // scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(90, width / height, 1, 10000)
    camera.position.set(30, 0, 240)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: true,
    })
    renderer.setSize(width, height)

    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
