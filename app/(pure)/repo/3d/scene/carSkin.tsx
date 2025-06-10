import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

export default function CarSkin() {
  useEffect(() => {
    const scene = new THREE.Scene()
    const loader = new GLTFLoader()
    const gui = new GUI()
    const body = gui.addFolder('车身')
    const win = gui.addFolder('车窗')

    {
      const textureLoader = new THREE.CubeTextureLoader()
      const texture = textureLoader
        .setPath('/material/forest/')
        .load(['nx.png', 'ny.png', 'nz.png', 'px.png', 'py.png', 'pz.png'])

      loader.load('/model/car/car.glb', (gltf) => {
        gltf.scene.scale.set(4, 4, 4)
        gltf.scene.traverse((obj) => {
          if (obj.isMesh) {
            if (obj.material.isMeshPhysicalMaterial) {
              obj.material.envMap = texture
              obj.material.envMapIntensity = 2
            }
            if (obj.name === '车身') {
              obj.material.metalness = 0.9
              obj.material.roughness = 0.2
              obj.material.clearcoat = 1
              obj.material.clearcoatRoughness = 0.1

              // 金属度 metalness
              // 粗糙度 roughness
              // 清漆层 clearcoat
              // 透光率 transmission
              // 折射率 ior
              body.addColor(obj.material, 'color')
              body.add(obj.material, 'metalness', 0, 1)
              body.add(obj.material, 'roughness', 0, 1)
              body.add(obj.material, 'clearcoat', 0, 1)
              body.add(obj.material, 'clearcoatRoughness', 0, 1)
            }
            if (obj.name === '车窗') {
              obj.material.color.set('white')
              obj.material.transmission = 1
              obj.material.ior = 1.3

              win.addColor(obj.material, 'color')
              win.add(obj.material, 'transmission', 0, 1)
              win.add(obj.material, 'ior', 1, 2.3)
              win.add(obj.material, 'metalness', 0, 1)
              win.add(obj.material, 'roughness', 0, 1)
            }
          }
        })
        scene.add(gltf.scene)
      })
    }

    const directionLight = new THREE.DirectionalLight(0xffffff, 1)
    directionLight.position.set(100, 100, 100)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(20)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(12, 6, 10)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    renderer.setSize(width, height)

    const render = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
