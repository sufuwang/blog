import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect } from 'react'
import {
  BatchedParticleRenderer,
  ConstantValue,
  IntervalValue,
  ParticleSystem,
  ConeEmitter,
  RandomColor,
  Vector4,
} from 'three.quarks'
import { EffectComposer, GLTFLoader, RenderPass } from 'three/examples/jsm/Addons'
// @ts-ignore
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

export default function ThreeQuarksAngryBird() {
  useEffect(() => {
    let particleSystem: ParticleSystem
    const scene = new THREE.Scene()
    const batchRenderer = new BatchedParticleRenderer()

    {
      const loader = new GLTFLoader()
      loader.load('/model/angryBird/scene.glb', (gltf) => {
        const box = new THREE.Box3()
        box.expandByObject(gltf.scene)
        gltf.scene.position.z = -(box.max.z - box.min.z) / 2 - 80

        // gltf.scene.rotateY(Math.PI / 8)
        gltf.scene.scale.set(400, 400, 400)
        gltf.scene.name = 'angry_bird'
        scene.add(gltf.scene)
      })
    }

    {
      const loader = new THREE.TextureLoader()
      const texture = loader.load('/static/images/heart.png')

      particleSystem = new ParticleSystem({
        duration: 20,
        looping: false,
        startLife: new IntervalValue(0, 50),
        startSpeed: new IntervalValue(0, 200),
        startSize: new IntervalValue(0, 20),
        startColor: new RandomColor(new Vector4(1, 0, 0, 1), new Vector4(0.1, 0, 0, 1)),
        emissionOverTime: new ConstantValue(100),
        shape: new ConeEmitter(),
        material: new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        }),
      })
      batchRenderer.addSystem(particleSystem)
      scene.add(particleSystem.emitter, batchRenderer)
    }

    const directionLight = new THREE.DirectionalLight(0xffffff)
    directionLight.position.set(500, 600, 800)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(500)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(800, 300, 800)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    renderer.domElement.addEventListener('click', (event) => {
      const x = (event.offsetX / width) * 2 - 1
      const y = -((event.offsetY / height) * 2 - 1)

      const ray = new THREE.Raycaster()
      ray.setFromCamera(new THREE.Vector2(x, y), camera)

      const [obj] = ray.intersectObjects([scene.getObjectByName('angry_bird')!])
      if (obj) {
        particleSystem.stop()
        particleSystem.time = 0
        particleSystem.play()
      }
    })

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    // controls.autoRotate = true
    // controls.autoRotateSpeed = -2.0

    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height))
    composer.addPass(bloomPass)

    const clock = new THREE.Clock()
    function render(delta = 0) {
      // controls.update()
      composer.render()
      batchRenderer.update(clock.getDelta())
      // renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()

    document.body.append(renderer.domElement)
  }, [])
}
