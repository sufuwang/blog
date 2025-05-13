import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useEffect } from 'react'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default function InfiniteTube() {
  useEffect(() => {
    const scene = new THREE.Scene()

    {
      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
      loader.setDRACOLoader(dracoLoader)
      loader.load('/model/cow/Cow.mini.glb', function (gltf) {
        scene.add(gltf.scene)
        gltf.scene.traverse((obj) => {
          if (obj.isMesh) {
            obj.material.wireframe = true
            if (obj.name === 'Cylinder_1') {
              obj.material.color = new THREE.Color('white')
            }
          }
        })
        gltf.scene.getObjectByName('Cylinder').material = new THREE.MeshBasicMaterial({
          color: 'yellow',
          wireframe: true,
        })
      })
    }
    {
      const loader = new GLTFLoader()
      loader.load('/model/cow/Cow.gltf', function (gltf) {
        gltf.scene.position.x = 10
        scene.add(gltf.scene)
      })
    }

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    // const axesHelper = new THREE.AxesHelper(200)
    // scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000)
    camera.position.set(14, 10, 10)
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
