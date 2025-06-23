'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { DecalGeometry, DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons'

export default function PrintFlower() {
  const loader = new THREE.TextureLoader()
  const texture = loader.load('/material/xiaoxin.png')
  const gltfLoader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
  gltfLoader.setDRACOLoader(dracoLoader)
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer()

  useEffect(() => {
    {
      gltfLoader.load('/model/tshirt/tshirt.glb', (gltf) => {
        gltf.scene.scale.setScalar(400)
        scene.add(gltf.scene)
      })
    }

    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(500, 400, 300)
    scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(200)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
    camera.position.set(0, 0, 400)
    camera.lookAt(0, 0, 0)
    renderer.setSize(width, height)

    renderer.domElement.addEventListener('click', (event) => {
      const x = (event.offsetX / width) * 2 - 1
      const y = -((event.offsetY / height) * 2 - 1)
      const r = new THREE.Raycaster()
      r.setFromCamera(new THREE.Vector2(x, y), camera)
      const is = r.intersectObjects(scene.children)
      if (is.length) {
        const { point, object } = is[0]
        const orientation = new THREE.Euler()
        const size = new THREE.Vector3(30, 30, 30)
        const geometry = new DecalGeometry(object as THREE.Mesh, point, orientation, size)
        const material = new THREE.MeshPhongMaterial({
          polygonOffset: true,
          polygonOffsetFactor: -4,
          map: texture,
          transparent: true,
        })
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
      }
    })

    document.body.appendChild(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)

    function r() {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    requestAnimationFrame(r)
  }, [])
}
