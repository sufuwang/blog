import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect } from 'react'
import {
  BatchedParticleRenderer,
  ConstantValue,
  IntervalValue,
  ParticleSystem,
  RandomColor,
  Vector4,
  Vector3,
  GridEmitter,
  TextureSequencer,
  ApplySequences,
} from 'three.quarks'

export default function ThreeQuarksRegroup() {
  useEffect(() => {
    let particleSystem: ParticleSystem
    const scene = new THREE.Scene()
    const batchRenderer = new BatchedParticleRenderer()

    {
      const loader = new THREE.TextureLoader()
      const texture = loader.load('/material/point.png')

      particleSystem = new ParticleSystem({
        duration: 10,
        looping: true,
        startLife: new ConstantValue(9),
        startSpeed: new ConstantValue(0),
        startSize: new IntervalValue(0.1, 0.2),
        startColor: new RandomColor(new Vector4(0.1, 0.1, 0.1, 1), new Vector4(1, 1, 1, 1)),
        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
          {
            time: 0,
            count: new ConstantValue(2000),
            probability: 1,
            interval: 0,
            cycle: 0,
          },
        ],
        shape: new GridEmitter({
          width: 20,
          height: 20,
          column: 50,
          row: 50,
        }),
        material: new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        }),
      })

      loader.load('/static/images/three_quarks.png', (texture) => {
        const seq = new TextureSequencer(0.1, 0.1, new Vector3(-10, 0, 0))
        seq.fromImage(texture.image, 0.2)

        const applySeq = new ApplySequences(0.0001)
        applySeq.appendSequencer(new IntervalValue(0, 1), seq)

        particleSystem.addBehavior(applySeq)
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
    camera.position.set(0, 0, 20)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)

    const clock = new THREE.Clock()
    function render() {
      batchRenderer.update(clock.getDelta())
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()

    document.body.append(renderer.domElement)
  }, [])
}
