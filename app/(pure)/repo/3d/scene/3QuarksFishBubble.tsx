import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect } from 'react'
import {
  AxisAngleGenerator,
  BatchedParticleRenderer,
  Bezier,
  ConstantValue,
  FrameOverLife,
  GridEmitter,
  IntervalValue,
  Noise,
  ParticleSystem,
  PiecewiseBezier,
  PointEmitter,
  RandomColor,
  RenderMode,
  Rotation3DOverLife,
  Vector3,
  Vector4,
} from 'three.quarks'
import { GLTFLoader } from 'three/examples/jsm/Addons'
import { Group, Tween } from '@tweenjs/tween.js'

export default function ThreeQuarksFishBubble() {
  useEffect(() => {
    const scene = new THREE.Scene()
    const batchRenderer = new BatchedParticleRenderer()
    let mixer: THREE.AnimationMixer | null = null
    let particleSystem: ParticleSystem | null = null
    const group = new Group()

    {
      const loader = new GLTFLoader()
      loader.load('/model/fish/scene.glb', (gltf) => {
        gltf.scene.scale.set(100, 100, 100)
        gltf.scene.position.set(0, -300, 0)

        const fish = gltf.scene.getObjectByName('ClownFishArmature_23')!
        fish.parent!.remove(
          ...[
            gltf.scene.getObjectByName('BrownFishArmature_13')!,
            gltf.scene.getObjectByName('TunaArmature_33')!,
            gltf.scene.getObjectByName('DoryArmature_47')!,
          ]
        )

        mixer = new THREE.AnimationMixer(gltf.scene)
        mixer.clipAction(gltf.animations[0]).play()
        scene.add(gltf.scene)

        const box = new THREE.Box3()
        box.setFromObject(fish)
        const size = box.getSize(new THREE.Vector3())

        const tweenA = new Tween(fish.position)
          .to({ z: -8 }, 3000)
          .repeat(0)
          .onUpdate((pos) => {
            const x = scene.getObjectByName('fishBubbleEmitter')!
            x.position.z = pos.z * 100 - (size.x * 100) / 2
          })
        const tweenB = new Tween(fish.rotation)
          .to({ y: Math.PI }, 1400)
          .repeat(0)
          .onStart(() => {
            const x = scene.getObjectByName('fishBubbleEmitter')!
            x.visible = false
          })
          .onComplete(() => {
            const x = scene.getObjectByName('fishBubbleEmitter')!
            x.visible = true
          })
        const tweenC = new Tween(fish.position)
          .to({ z: 8 }, 8000)
          .repeat(0)
          .onUpdate((pos) => {
            const x = scene.getObjectByName('fishBubbleEmitter')!
            x.position.z = pos.z * 100 + (size.x * 100) / 2
          })
        const tweenD = new Tween(fish.rotation)
          .to({ y: 0 }, 1400)
          .repeat(0)
          .onStart(() => {
            const x = scene.getObjectByName('fishBubbleEmitter')!
            x.visible = false
          })
          .onComplete(() => {
            const x = scene.getObjectByName('fishBubbleEmitter')!
            x.visible = true
          })
        const tweenE = new Tween(fish.position)
          .to({ z: 1 }, 3000)
          .repeat(0)
          .onUpdate((pos) => {
            const x = scene.getObjectByName('fishBubbleEmitter')!
            x.position.z = pos.z * 100 - (size.x * 100) / 2
          })
        tweenA.chain(tweenB)
        tweenB.chain(tweenC)
        tweenC.chain(tweenD)
        tweenD.chain(tweenE)
        tweenE.chain(tweenA)
        tweenA.start()

        group.add(tweenA, tweenB, tweenC, tweenD, tweenE)
      })
    }
    {
      const loader = new THREE.TextureLoader()
      const texture = loader.load('/material/bubble.png')

      particleSystem = new ParticleSystem({
        duration: 20,
        looping: false,
        startLife: new IntervalValue(0, 50),
        startSpeed: new IntervalValue(80, 200),
        startSize: new IntervalValue(20, 50),
        startColor: new RandomColor(new Vector4(1, 1, 1, 1), new Vector4(1, 1, 1, 0.4)),
        // startRotation: new IntervalValue(0, Math.PI / 2),
        emissionOverTime: new IntervalValue(1, 3),
        shape: new GridEmitter({
          row: 1,
          column: 1,
        }),
        material: new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        }),
        uTileCount: 10,
        vTileCount: 10,
        startTileIndex: new ConstantValue(36),
      })

      batchRenderer.addSystem(particleSystem)
      particleSystem.emitter.name = 'fishBubbleEmitter'
      particleSystem.emitter.rotateX(-Math.PI / 2)
      particleSystem.emitter.position.set(0, -20, -40)
      scene.add(particleSystem.emitter, batchRenderer)

      particleSystem.addBehavior(
        new FrameOverLife(new PiecewiseBezier([[new Bezier(36, 39, 42, 44), 0]]))
      )
    }

    const directionLight = new THREE.DirectionalLight(0xffffff)
    directionLight.position.set(500, 600, 800)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    // const axesHelper = new THREE.AxesHelper(1000)
    // scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(1200, 0, 0)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    // new OrbitControls(camera, renderer.domElement)

    const clock = new THREE.Clock()
    function render(time = 0) {
      const delta = clock.getDelta()
      mixer?.update(delta)
      group.update(time)
      batchRenderer.update(delta)
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()

    document.body.append(renderer.domElement)
  }, [])
}
