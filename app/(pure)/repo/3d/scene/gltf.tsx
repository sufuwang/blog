import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useEffect } from 'react'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default function Gltf() {
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
      loader.load('/model/cow/Cow.gltf', async function (gltf) {
        gltf.scene.position.x = 10
        scene.add(gltf.scene)

        const helper = new THREE.BoxHelper(gltf.scene, 'pink')
        scene.add(helper)

        const cowBox = new THREE.Box3()
        // box.expandByObject(gltf.scene)
        cowBox.setFromObject(gltf.scene)
        const width = cowBox.max.x - cowBox.min.x
        const height = cowBox.max.y - cowBox.min.y
        const depth = cowBox.max.z - cowBox.min.z
        const size = new THREE.Vector3()
        cowBox.getSize(size)
        console.info('cowBox size:', { width, height, depth }, size)
        // cowBox.expandByScalar(2)
        const helper3 = new THREE.Box3Helper(cowBox, 'red')
        scene.add(helper3)

        const ringGeometry = new THREE.RingGeometry(depth / 2, depth / 2 + 0.4)
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 'green',
          side: THREE.DoubleSide,
        })
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.position.y = height / 2
        ring.rotateX(Math.PI / 2)
        gltf.scene.add(ring)

        const michelle = await loader.loadAsync('/model/michelle/Michelle.glb')
        scene.add(michelle.scene)
        const michelleBox = new THREE.Box3()
        michelleBox.setFromObject(michelle.scene)
        // michelleBox.expandByScalar(8)
        const michelleBoxHelper = new THREE.Box3Helper(michelleBox, 'blue')
        scene.add(michelleBoxHelper)
        console.info('Michelle & Cow 是否碰撞: ', michelleBox.intersectsBox(cowBox))
        // const intersectBox = michelleBox.intersect(cowBox)
        // const intersectSize = intersectBox.getSize(new THREE.Vector3())
        // console.info('Michelle & Cow 碰撞尺寸: ', intersectSize)

        const unionBox = michelleBox.union(cowBox)
        const helper4 = new THREE.Box3Helper(unionBox, 'green')
        scene.add(helper4)
        const unionSize = unionBox.getSize(new THREE.Vector3())
        console.info('Michelle & Cow 并集尺寸', unionSize)

        const michelleBoxCenter = michelleBox.getCenter(new THREE.Vector3())
        console.info('Michelle Box Center:', michelleBoxCenter)
      })
    }

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(200)
    scene.add(axesHelper)

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
