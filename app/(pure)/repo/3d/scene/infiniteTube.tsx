import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect } from 'react'

export default function InfiniteTube() {
  useEffect(() => {
    const scene = new THREE.Scene()

    const loader = new THREE.TextureLoader()
    const texture = loader.load('/material/thumb.png')
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 2)

    const geometry = new THREE.CylinderGeometry(30, 50, 1000, 32, 32, true)
    const material = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      alphaMap: texture,
      transparent: true,
    })
    const tunnel = new THREE.Mesh(geometry, material)
    scene.add(tunnel)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    // const axesHelper = new THREE.AxesHelper(200)
    // scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000)
    // camera.position.set(0, 100, 200)
    camera.position.set(0.9, -500, 6.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    let H = 0
    const clock = new THREE.Clock()
    function render() {
      H = H >= 1 ? 0 : H + 0.0006
      const delta = clock.getDelta()
      tunnel.material.color.setHSL(H, 0.5, 0.5)
      tunnel.material.alphaMap!.offset.y += delta * 0.2
      tunnel.rotation.y += delta * 0.4
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
