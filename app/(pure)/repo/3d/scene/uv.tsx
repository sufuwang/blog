import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default function UV() {
  useEffect(() => {
    const scene = new THREE.Scene()

    {
      const geometry = new THREE.PlaneGeometry(200, 100)
      geometry.attributes.uv = new THREE.BufferAttribute(
        new Float32Array([0, 0.5, 0.5, 0.5, 0, 0, 0.5, 0]),
        2
      )
      const loader = new THREE.TextureLoader()
      const texture = loader.load('/material/uv.png')
      texture.colorSpace = THREE.SRGBColorSpace
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
    }

    const loader = new THREE.TextureLoader()
    const texture = loader.load('/material/uv.png')
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.RepeatWrapping
    const geometry = new THREE.SphereGeometry(50)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 0, 100)
    scene.add(mesh)

    const axesHelper = new THREE.AxesHelper(200)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    function render() {
      mesh.material.map!.offset.x += 0.001
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
