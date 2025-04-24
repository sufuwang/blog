import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect } from 'react'

export default function TubeTravel() {
  useEffect(() => {
    const scene = new THREE.Scene()
    const curve = new THREE.CubicBezierCurve3(
      ...[
        new THREE.Vector3(-100, 50, 50),
        new THREE.Vector3(50, 150, 0),
        new THREE.Vector3(100, 0, 100),
        new THREE.Vector3(100, 50, -50),
      ]
    )
    const points = curve.getPoints(1000)
    const geometry = new THREE.TubeGeometry(curve, 100, 20, 20)

    const loader = new THREE.TextureLoader()
    const texture = loader.load('/material/stone.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.colorSpace = THREE.SRGBColorSpace
    texture.repeat.x = 20
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      aoMap: texture,
      // wireframe: true,
      map: texture,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(200)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000)
    camera.position.set(0, 100, 200)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    let i = 0
    function render() {
      if (i < points.length - 1) {
        camera.position.set(points[i].x, points[i].y, points[i].z)
        // camera.position.copy(points[i])
        camera.lookAt(points[i + 1])
        i += 1
      } else {
        i = 0
      }
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    // document.addEventListener('keydown', (e) => {
    //   if (e.code === 'ArrowDown') {
    //     i += 50
    //   }
    // })
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
