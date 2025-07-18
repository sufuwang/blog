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
  Vector3,
  ApplyForce,
  RenderMode,
  ApplyCollision,
  SpeedOverLife,
  PiecewiseBezier,
  Bezier,
} from 'three.quarks'
import { EffectComposer, RenderPass } from 'three/examples/jsm/Addons'
// @ts-ignore
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

export default function ThreeQuarksScintilla() {
  useEffect(() => {
    let particleSystem: ParticleSystem
    const scene = new THREE.Scene()
    const batchRenderer = new BatchedParticleRenderer()

    {
      // const loader = new GLTFLoader()
      // loader.load('/model/angryBird/scene.glb', (gltf) => {
      //   const box = new THREE.Box3()
      //   box.expandByObject(gltf.scene)
      //   gltf.scene.position.z = -(box.max.z - box.min.z) / 2 - 80
      //   // gltf.scene.rotateY(Math.PI / 8)
      //   gltf.scene.scale.set(400, 400, 400)
      //   gltf.scene.name = 'angry_bird'
      //   scene.add(gltf.scene)
      // })
    }

    {
      const loader = new THREE.TextureLoader()
      const texture = loader.load('/material/point.png')

      particleSystem = new ParticleSystem({
        duration: 16,
        looping: true,
        startLife: new IntervalValue(0, 10),
        startSpeed: new IntervalValue(0, 1000),
        startSize: new IntervalValue(0, 10),
        startColor: new RandomColor(new Vector4(1, 0.7, 0, 1), new Vector4(1, 1, 1, 1)),
        emissionOverTime: new ConstantValue(1000),
        shape: new ConeEmitter({
          radius: 0,
          arc: Math.PI * 2,
        }),
        material: new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        }),
        renderMode: RenderMode.Trail,
        rendererEmitterSettings: {
          startLength: new ConstantValue(4),
        },
      })

      particleSystem.addBehavior(new ApplyForce(new Vector3(0, 0, -1), new ConstantValue(1000)))
      particleSystem.addBehavior(
        new ApplyCollision(
          {
            resolve(pos, normal) {
              if (pos.z < 0) {
                normal.set(0, 0, 1)
              }
              return pos.z < 0
            },
          },
          0.5
        )
      )
      particleSystem.addBehavior(
        new SpeedOverLife(new PiecewiseBezier([[new Bezier(4, 2, 1, 0), 0]]))
      )

      batchRenderer.addSystem(particleSystem)
      batchRenderer.rotateX(-Math.PI / 2)
      scene.add(particleSystem.emitter, batchRenderer)
    }

    const directionLight = new THREE.DirectionalLight(0xffffff)
    directionLight.position.set(500, 600, 800)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    // const axesHelper = new THREE.AxesHelper(500)
    // scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(2000, 800, 2000)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.autoRotate = true
    // controls.autoRotateSpeed = -2.0

    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height))
    composer.addPass(bloomPass)

    const clock = new THREE.Clock()
    function render(delta = 0) {
      controls.update()
      composer.render()
      batchRenderer.update(clock.getDelta())
      // renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()

    document.body.append(renderer.domElement)
  }, [])
}
