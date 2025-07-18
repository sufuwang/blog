import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/Addons'
import { Group, Tween } from '@tweenjs/tween.js'
import { throttle } from 'lodash-es'
import {
  ApplyCollision,
  ApplyForce,
  BatchedParticleRenderer,
  ConstantValue,
  IntervalValue,
  ParticleSystem,
  PointEmitter,
  RandomColor,
  Vector3,
  Vector4,
} from 'three.quarks'
import SpriteText from 'three-spritetext'

type MeshWithHelper<H = THREE.BoxHelper> = THREE.Object3D<THREE.Object3DEventMap> & {
  box: THREE.Box3
  helper: H
}

const z = -2200
const Roads = [
  [-360, 6, z],
  [-130, 6, z],
  [120, 6, z],
  [350, 6, z],
] as const

export default function GameAvoidCar() {
  const ref = useRef<HTMLDivElement>(null)
  const runningCars: MeshWithHelper[] = []

  useEffect(() => {
    const scene = new THREE.Scene()
    const group = new Group()
    const loader = new GLTFLoader()
    let mixer: THREE.AnimationMixer | null = null
    let isPrepared = false
    const showHelper = false

    {
      const loader = new THREE.TextureLoader()
      const texture = loader.load('/static/images/road.png')
      texture.colorSpace = THREE.SRGBColorSpace
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.y = 10
      const geometry = new THREE.PlaneGeometry(1000, 9000)
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        aoMap: texture,
      })
      const road = new THREE.Mesh(geometry, material)
      road.rotateX(-Math.PI / 2)
      scene.add(road)
    }
    {
      loader.load('/model/person/Soldier.glb', (gltf) => {
        const _scene = gltf.scene as unknown as MeshWithHelper<THREE.Box3Helper>
        _scene.scale.set(60, 60, 60)
        _scene.name = 'person'
        _scene.position.set(0, 0, 600)
        _scene.visible = false

        mixer = new THREE.AnimationMixer(_scene)
        const action = mixer.clipAction(gltf.animations[1])
        action.play()

        const box = new THREE.Box3()
        box.setFromObject(_scene)
        box.expandByVector(new THREE.Vector3(-30, 0, 0))
        const boxHelper = new THREE.Box3Helper(box)
        boxHelper.name = 'personHelper'
        boxHelper.visible = false

        _scene.box = box
        _scene.helper = boxHelper
        scene.add(boxHelper)
        scene.add(_scene, boxHelper)
      })
    }
    {
      loader.load('/model/car/cartoon_car_01.glb', (gltf) => {
        gltf.scene.scale.set(100, 100, 100)
        gltf.scene.name = 'car_01'
        gltf.scene.visible = false
        scene.add(gltf.scene)
      })
    }
    {
      loader.load('/model/car/cartoon_car_02.glb', (gltf) => {
        gltf.scene.scale.set(100, 100, 100)
        gltf.scene.name = 'car_02'
        gltf.scene.visible = false
        scene.add(gltf.scene)
      })
    }
    {
      const text = new SpriteText('Ready', 200, 'white')
      text.strokeColor = 'lightgreen'
      text.strokeWidth = 1
      text.position.y = 200
      text.position.z = 100
      text.name = 'text'
      scene.add(text)

      setTimeout(() => {
        text.text = '3'
        setTimeout(() => {
          text.text = '2'
          setTimeout(() => {
            text.text = '1'
            setTimeout(() => {
              text.text = 'Go'
              setTimeout(() => {
                text.text = ''
                isPrepared = true
              }, 500)
            }, 1000)
          }, 1000)
        }, 1000)
      }, 1000)
    }

    const batchedRenderer = new BatchedParticleRenderer()
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('/material/point.png')
    const particleSystem = new ParticleSystem({
      duration: 10,
      looping: true,
      startLife: new IntervalValue(5, 9),
      startSpeed: new IntervalValue(30, 50),
      startSize: new IntervalValue(5, 10),
      startColor: new RandomColor(new Vector4(1, 0, 0, 1), new Vector4(1, 0, 0, 0.1)),
      emissionOverTime: new IntervalValue(300, 500),
      shape: new PointEmitter(),
      material: new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    })
    particleSystem.emitter.visible = false
    particleSystem.addBehavior(new ApplyForce(new Vector3(0, -1, 0), new ConstantValue(70)))
    batchedRenderer.addSystem(particleSystem)
    scene.add(particleSystem.emitter, batchedRenderer)

    const intervalId = setInterval(() => {
      if (!isPrepared) {
        return
      }
      const cars = [scene.getObjectByName('car_01'), scene.getObjectByName('car_02')]
      if (!cars[0] || !cars[1]) {
        return
      }
      const roadPos = Roads[Math.floor(Math.random() * 4)]
      const car = cars[Math.floor(Math.random() * 2)]!.clone() as MeshWithHelper
      car.position.set(roadPos[0], roadPos[1], roadPos[2])
      car.visible = true

      const boxHelper = new THREE.BoxHelper(car)
      car.helper = boxHelper
      car.helper.visible = showHelper

      const tween = new Tween(car.position)
        .to({ z: 1800 }, 4000)
        .onComplete(() => {
          group.remove(tween)
          scene.remove(car, boxHelper)
          runningCars.splice(runningCars.indexOf(car), 1)
        })
        .start()
      group.add(tween)
      scene.add(car, boxHelper)
      runningCars.push(car)
    }, 300)

    window.addEventListener(
      'keydown',
      throttle((event) => {
        const man = scene.getObjectByName('person') as MeshWithHelper
        if (man) {
          let deltaPos = 0
          let deltaRot = 0
          if (event.code === 'ArrowLeft') {
            deltaRot = Math.PI / 2
            deltaPos -= 20
          } else if (event.code === 'ArrowRight') {
            deltaRot = -Math.PI / 2
            deltaPos = 20
          } else if (event.code === 'ArrowUp') {
            deltaRot = 0
            deltaPos = 0
          } else if (event.code === 'ArrowDown') {
            deltaRot = Math.PI
            deltaPos = 0
          }

          const tweenPos = new Tween(man.position)
            .to({ x: man.position.x + deltaPos }, 100)
            .onComplete(() => {
              group.remove(tweenPos)
            })
            .start()
          const tweenRot = new Tween(man.rotation)
            .to({ y: deltaRot }, 200)
            .onComplete(() => {
              group.remove(tweenRot)
            })
            .start()
          group.add(tweenPos, tweenRot)
        }
      }, 30)
    )

    const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
    directionalLight.position.set(0, 1400, 0)
    directionalLight.lookAt(0, 0, 0)
    scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)

    // const axesHelper = new THREE.AxesHelper(500)
    // scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
    camera.position.set(0, 900, 900)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    renderer.setSize(width, height)

    new OrbitControls(camera, renderer.domElement)

    let man: MeshWithHelper<THREE.Box3Helper>
    let stopRender: boolean = false
    const clock = new THREE.Clock()
    function render(time = 0) {
      const delta = clock.getDelta()

      if (isPrepared) {
        if (!stopRender) {
          if (!man) {
            man = scene.getObjectByName('person') as MeshWithHelper<THREE.Box3Helper>
            man.visible = true
            man.helper.visible = showHelper
          }
          if (man) {
            man.box.setFromObject(man)
            man.box.expandByVector(
              [Math.PI / 2, -Math.PI / 2].includes(man.rotation.y)
                ? new THREE.Vector3(0, 0, -30)
                : new THREE.Vector3(-30, 0, 0)
            )
            man.helper.box.copy(man.box)
          }
          runningCars.find((car) => {
            car.helper.update(car)
            const carBox = new THREE.Box3()
            carBox.setFromObject(car)
            stopRender = man.box.intersectsBox(carBox)
            return stopRender
          })
          if (stopRender) {
            const pos = man.box.getCenter(new THREE.Vector3())
            particleSystem.addBehavior(
              new ApplyCollision(
                {
                  resolve(_pos, normal) {
                    const f = _pos.y < -pos.y
                    if (f) {
                      normal.set(0, 1, 0)
                    }
                    return f
                  },
                },
                0.1
              )
            )
            particleSystem.emitter.position.copy(pos)
            particleSystem.emitter.visible = true
            const text = scene.getObjectByName('text') as SpriteText
            text.text = 'Game Over'
            text.strokeColor = 'rgba(0,0,0,0)'
            text.color = 'red'
          }
          mixer?.update(delta)
          group.update(time)
        } else {
          clearInterval(intervalId)
        }
      }

      batchedRenderer.update(delta)
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()

    document.body.append(renderer.domElement)

    window.onresize = function () {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [])
}
