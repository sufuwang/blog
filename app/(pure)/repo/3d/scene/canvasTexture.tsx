import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect } from 'react'
import SpriteText from 'three-spritetext'

const createCanvas = (text) => {
  const dpr = window.devicePixelRatio
  const canvas = document.createElement('canvas')
  const w = (canvas.width = 100 * dpr)
  const h = (canvas.height = 100 * dpr)
  const c = canvas.getContext('2d')!
  c.translate(w / 2, h / 2)
  c.arc(0, 0, 40 * dpr, 0, Math.PI * 2)
  c.fillStyle = 'orange'
  c.fill()

  c.beginPath()
  c.moveTo(-10 * dpr, -20 * dpr)
  c.lineTo(-10 * dpr, 20 * dpr)
  c.lineTo(20 * dpr, 0)
  c.closePath()
  c.fillStyle = 'white'
  c.fill()

  c.fillStyle = '#000'
  c.font = 'normal ' + 20 * dpr + 'px 微软雅黑'
  c.textBaseline = 'middle'
  c.textAlign = 'center'
  c.fillText(text, 0, 0)
  return canvas
}

const createPlane = (x, y) => {
  const text = 'Pause'
  const texture = new THREE.CanvasTexture(createCanvas(text))
  texture.colorSpace = THREE.SRGBColorSpace
  const geometry = new THREE.PlaneGeometry(100, 100)
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, 0)
  // mesh.scale.set(8, 4, 4)
  return mesh
}

export default function Curve() {
  useEffect(() => {
    const scene = new THREE.Scene()
    {
      const planes = [createPlane(0, 0)]
      planes.forEach((mesh) => {
        scene.add(mesh)
      })

      const spriteText = new SpriteText('Stop', 20, 'white')
      spriteText.position.set(0, 100, 0)
      spriteText.padding = 4
      spriteText.strokeWidth = 2
      spriteText.strokeColor = 'blue'
      spriteText.borderColor = '#ffffff'
      spriteText.borderWidth = 2
      spriteText.borderRadius = 4
      spriteText.backgroundColor = 'lightpink'
      scene.add(spriteText)
    }

    const directionLight = new THREE.DirectionalLight(0xffffff, 2)
    directionLight.position.set(1000, 1000, 1000)
    scene.add(directionLight)

    const axesHelper = new THREE.AxesHelper(200)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000)
    camera.position.set(0, 0, 400)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
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
