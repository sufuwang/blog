'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
import { Tween, Group } from '@tweenjs/tween.js'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// @ts-ignore
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
// @ts-ignore
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
// @ts-ignore
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
import { Reflector } from 'three/examples/jsm/Addons'

const Michelle = [
  {
    name: 'michelle_1',
    position: { x: -200, z: -200 },
    color: 'yellow',
  },
  {
    name: 'michelle_2',
    position: { x: 0, z: 400 },
    color: 'red',
  },
  {
    name: 'michelle_3',
    position: { x: 400, z: 0 },
    color: 'lightgreen',
  },
] as const

type LoadMichelle = (argus: (typeof Michelle)[number]) => void
type Object3D<T = THREE.Object3D<THREE.Object3DEventMap>> = T & { target: T }

export default function DancerBattle() {
  const mixers: {
    [Key in (typeof Michelle)[number]['name']]?: {
      mixer: THREE.AnimationMixer
      action: THREE.AnimationAction
    }
  } = {}
  const tweenGroup = new Group()
  const scene = new THREE.Scene()
  const loader = new GLTFLoader()

  const loadMichelle: LoadMichelle = ({ name, position, color }) => {
    loader.load('/model/michelle/Michelle.glb', (gltf) => {
      gltf.scene.scale.set(300, 300, 300)
      gltf.scene.position.x = position?.x ?? 0
      gltf.scene.position.y = 0
      gltf.scene.position.z = position?.z ?? 0
      gltf.scene.rotateY(Math.PI / 4)
      gltf.scene.traverse((obj) => {
        obj.castShadow = true
        obj.target = gltf.scene
        if (color && obj.isMesh) {
          obj.material = obj.material.clone()
          obj.material.color.set(color)
        }
      })
      gltf.scene.name = name
      scene.add(gltf.scene)

      const mixer = new THREE.AnimationMixer(gltf.scene)
      const action = mixer.clipAction(gltf.animations[0])
      // clipAction.play()
      mixers[name] = {
        mixer,
        action,
      }
    })
  }

  useEffect(() => {
    {
      loader.load('/model/stage/stage.glb', (gltf) => {
        gltf.scene.scale.set(50, 50, 50)
        gltf.scene.traverse((obj) => {
          obj.receiveShadow = true
        })
        gltf.scene.name = 'stage'
        scene.add(gltf.scene)

        const geometry = new THREE.PlaneGeometry(6000, 1600)
        const mesh = new Reflector(geometry)
        mesh.position.set(-700, 700, -700)
        mesh.rotateY(Math.PI / 4)
        scene.add(mesh)
      })
      Michelle.forEach((michelle) => loadMichelle(michelle))
    }

    const directionLight = new THREE.DirectionalLight(0xffffff, 2)
    directionLight.position.set(500, 1200, 300)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const setSpotLight = ({ x = 0, z = 0, showHelper = false, close = false }) => {
      const lightTween: Tween[] = []

      const s = scene.getObjectByName('spotLight') as THREE.SpotLight
      if (s) {
        const tween = new Tween({ i: s.intensity })
          .to({ i: 1 }, 400)
          .repeat(0)
          .onUpdate(({ i }) => {
            s.intensity = i
          })
          .onComplete(() => {
            s.dispose()
            s.remove()
            scene.remove(s)
            tweenGroup.remove(tween)
          })
        lightTween.push(tween)
        tweenGroup.add(tween)
      }
      const sh = scene.getObjectByName('spotLightHelper') as THREE.SpotLightHelper
      if (sh) {
        sh.dispose()
        sh.remove()
        scene.remove(sh)
      }

      if (close) {
        lightTween[0]?.start()
        return
      }

      const spotLight = new THREE.SpotLight('white', 1)
      spotLight.name = 'spotLight'
      spotLight.castShadow = true
      spotLight.shadow.camera.far = 10000
      spotLight.angle = Math.PI / 6
      spotLight.position.set(x, 700, z)
      spotLight.target.position.set(x, 0, z)
      spotLight.lookAt(x, 0, z)
      scene.add(spotLight, spotLight.target)

      const tween = new Tween({ i: 1 })
        .to({ i: 8000000 }, 200)
        .repeat(0)
        .onUpdate(({ i }) => {
          spotLight.intensity = i
        })
        .onComplete(() => {
          tweenGroup.remove(tween)
        })
      lightTween.push(tween)
      tweenGroup.add(tween)

      if (lightTween.length > 1) {
        lightTween[0].chain(lightTween[1])
      }
      lightTween[0].start()

      if (showHelper) {
        const x = new THREE.SpotLightHelper(spotLight)
        x.name = 'spotLightHelper'
        scene.add(x)
      }
    }

    const width = window.innerWidth
    const height = window.innerHeight

    const helper = new THREE.AxesHelper(500)
    scene.add(helper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(800, 800, 800)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true

    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    // const glitchPass = new GlitchPass()
    // composer.addPass(glitchPass)

    const v = new THREE.Vector2(width, height)
    const outlinePass = new OutlinePass(v, scene, camera)
    outlinePass.edgeStrength = 10
    outlinePass.edgeThickness = 10
    outlinePass.pulsePeriod = 1
    composer.addPass(outlinePass)

    const listener = new THREE.AudioListener()
    const audio = new THREE.Audio(listener)
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load('/audio/superman.mp3', (buffer) => {
      audio.setBuffer(buffer)
    })

    renderer.domElement.addEventListener('click', (event) => {
      audio.stop()

      const x = (event.offsetX / width) * 2 - 1
      const y = -((event.offsetY / height) * 2 - 1)

      const rayCaster = new THREE.Raycaster()
      rayCaster.setFromCamera(new THREE.Vector2(x, y), camera)

      const michelle = scene.children.filter((r) => r.name.startsWith('michelle_'))
      const intersectObjects = rayCaster.intersectObjects(michelle)

      const t = intersectObjects.find((item) => (item.object as unknown as Object3D).target)
      Object.values(mixers).forEach(({ action }) => action.stop())
      if (t) {
        audio.play()
        const tt = (t.object as unknown as Object3D).target
        const {
          position: { x, z },
        } = Michelle.find((m) => m.name === tt.name)!
        setSpotLight({ x, z, showHelper: false })
        outlinePass.selectedObjects = tt ? [tt] : []
        mixers[tt.name].action.play()
      } else {
        setSpotLight({ close: true })
        outlinePass.selectedObjects = []
      }
    })

    const clock = new THREE.Clock()
    function render() {
      const delta = clock.getDelta()
      Object.values(mixers).forEach(({ mixer }) => mixer.update(delta))

      tweenGroup.update()
      composer.render()
      // renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
