import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export default function DistortedAnimation() {
  useEffect(() => {
    const scene = new THREE.Scene()
    const mixers: THREE.AnimationMixer[] = []

    const geometry = new THREE.BoxGeometry(300, 300, 300)
    const positions = geometry.attributes.position.clone()
    for (let i = 0; i < positions.count; i++) {
      positions.setY(i, positions.getY(i) * 2)
    }
    const positions2 = geometry.attributes.position.clone()
    for (let i = 0; i < positions2.count; i++) {
      positions2.setX(i, positions2.getX(i) * 2)
    }
    geometry.morphAttributes.position = [positions, positions2]
    const material = new THREE.MeshLambertMaterial({
      color: 'orange',
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = 'Kkk'
    const track1 = new THREE.KeyframeTrack('Kkk.morphTargetInfluences[0]', [0, 3], [0, 0.5])
    const track2 = new THREE.KeyframeTrack('Kkk.morphTargetInfluences[1]', [3, 6], [0, 1])
    const clip = new THREE.AnimationClip('A', 6, [track1, track2])
    const mixer = new THREE.AnimationMixer(mesh)
    const clipAction = mixer.clipAction(clip)
    clipAction.play()
    mixers.push(mixer)
    scene.add(mesh)

    {
      const loader = new GLTFLoader()
      const mesh = new THREE.Group()
      loader.load('/model/flamingo/Flamingo.glb', function (gltf) {
        gltf.scene.scale.set(3, 3, 3)
        gltf.scene.position.x = 600

        const mixer = new THREE.AnimationMixer(gltf.scene)
        const clipAction = mixer.clipAction(gltf.animations[0])
        clipAction.play()
        mixers.push(mixer)

        scene.add(gltf.scene)
      })
    }

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(1000)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000)
    camera.position.set(200, 800, 800)
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
