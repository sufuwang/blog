import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useEffect } from 'react'

export default function InfiniteTube() {
  useEffect(() => {
    const scene = new THREE.Scene()

    {
      const loader = new GLTFLoader()
      loader.load('/model/cow/Cow.gltf', function (gltf) {
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

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    // const axesHelper = new THREE.AxesHelper(200)
    // scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000)
    camera.position.set(10, 0, 0)
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
