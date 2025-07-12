import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect } from 'react'
import {
  BatchedParticleRenderer,
  ConstantValue,
  IntervalValue,
  ParticleSystem,
  PointEmitter,
  RandomColor,
  Vector4,
} from 'three.quarks'

export default function ThreeQuarksRedHeart() {
  useEffect(() => {
    const scene = new THREE.Scene()
    const batchRenderer = new BatchedParticleRenderer()

    {
      const loader = new THREE.TextureLoader()
      const texture = loader.load('/static/images/heart.png')

      const particleSystem = new ParticleSystem({
        duration: 20,
        looping: true,
        startLife: new IntervalValue(0, 50),
        startSpeed: new IntervalValue(0, 200),
        startSize: new IntervalValue(0, 40),
        startColor: new RandomColor(new Vector4(1, 0, 0, 1), new Vector4(0.1, 0, 0, 1)),
        emissionOverTime: new ConstantValue(100),
        shape: new PointEmitter(),
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

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(500, 600, 800)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true

    const clock = new THREE.Clock()
    function render(delta = 0) {
      controls.update()
      batchRenderer.update(clock.getDelta())
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()

    document.body.append(renderer.domElement)
  }, [])
}
