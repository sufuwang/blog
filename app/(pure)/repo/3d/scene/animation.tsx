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
    const mixers: THREE.AnimationMixer[] = []

    {
      const geometry = new THREE.BoxGeometry(4, 4, 4)
      const material = new THREE.MeshLambertMaterial({
        color: 'orange',
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.name = 'Box'
      scene.add(mesh)
      const times = [0, 2, 5]
      const values = [0, 0, 0, 0, 10, 0, 0, 0, 0]
      const track = new THREE.KeyframeTrack('Box.position', times, values)
      const clip = new THREE.AnimationClip('hello', 5, [track])
      const mixer = new THREE.AnimationMixer(mesh)
      const clipAction = mixer.clipAction(clip)
      clipAction.play()
      mixers.push(mixer)
    }

    {
      const animation = (gltf, index = 0) => {
        const mixer = new THREE.AnimationMixer(gltf.scene)
        const clipAction = mixer.clipAction(gltf.animations[index])
        clipAction.play()
        gltf.scene.position.x = 10 + index * 10
        mixers.push(mixer)
        scene.add(gltf.scene)
      }
      const loader = new GLTFLoader()
      loader.load('/model/cow/Cow.gltf', function (gltf) {
        animation(gltf, 0)
      })
      loader.load('/model/cow/Cow.gltf', function (gltf) {
        animation(gltf, 1)
      })
      loader.load('/model/cow/Cow.gltf', function (gltf) {
        animation(gltf, 2)
      })
      loader.load('/model/cow/Cow.gltf', function (gltf) {
        animation(gltf, 3)
      })
      loader.load('/model/cow/Cow.gltf', function (gltf) {
        animation(gltf, 4)
      })
    }

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(200)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000)
    camera.position.set(19, 19, 40)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    const clock = new THREE.Clock()
    function render() {
      const delta = clock.getDelta()
      mixers.forEach((mixer) => mixer.update(delta))
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.target.set(19, -10, 10)
    orbitControls.update()
  }, [])
}
