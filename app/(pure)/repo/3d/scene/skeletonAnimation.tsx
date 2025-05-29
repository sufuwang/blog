import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export default function InfiniteTube() {
  useEffect(() => {
    const scene = new THREE.Scene()
    const mixers: THREE.AnimationMixer[] = []

    {
      const bone1 = new THREE.Bone()
      const bone2 = new THREE.Bone()
      const bone3 = new THREE.Bone()
      bone1.add(bone2)
      bone2.add(bone3)
      bone1.position.x = 100
      bone2.position.y = 100
      bone3.position.y = 50
      const skeletonHelper = new THREE.SkeletonHelper(bone1)
      bone1.name = 'bone'

      const times = [0, 2.5, 5]
      const values = [100, 0, 0, 140, 0, 0, 100, 0, 0]
      const track = new THREE.KeyframeTrack('bone.position', times, values)
      const clip = new THREE.AnimationClip('hello', 5, [track])
      const mixer = new THREE.AnimationMixer(bone1)
      const clipAction = mixer.clipAction(clip)
      clipAction.play()
      mixers.push(mixer)

      scene.add(bone1, skeletonHelper)
    }
    {
      const loader = new GLTFLoader()
      loader.load('/model/michelle/Michelle.glb', function (gltf) {
        gltf.scene.scale.set(100, 100, 100)
        gltf.scene.rotation.set(0, Math.PI / 4, 0)
        const mixer = new THREE.AnimationMixer(gltf.scene)
        const clipAction = mixer.clipAction(gltf.animations[0])
        clipAction.play()
        mixers.push(mixer)
        scene.add(gltf.scene)

        const helper = new THREE.SkeletonHelper(gltf.scene)
        scene.add(helper)
      })
    }

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(1000)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000)
    camera.position.set(140, 140, 140)
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
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
