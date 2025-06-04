import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { useEffect } from 'react'
import { SimplexNoise } from 'three/examples/jsm/Addons.js'
import { Tween, Easing, Group } from '@tweenjs/tween.js'
import { throttle } from 'lodash-es'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

export default function Fireworm() {
  useEffect(() => {
    const simplex = new SimplexNoise()
    const scene = new THREE.Scene()

    {
      const listener = new THREE.AudioListener()
      const audio = new THREE.Audio(listener)
      const audioLoader = new THREE.AudioLoader()
      audioLoader.load('/audio/superman.mp3', (buffer) => {
        audio.setBuffer(buffer)
      })

      const gui = new GUI()
      const obj = {
        volume: 1,
        loop: true,
        playbackRate: 1,
        offset: 0,
        detune: 0,
        play() {
          audio.play()
        },
        pause() {
          audio.pause()
        },
      }
      gui.add(obj, 'volume', 0, 1).onChange((value) => {
        audio.setVolume(value)
      })
      gui.add(obj, 'playbackRate', [0.5, 1, 2]).onChange((value) => {
        audio.playbackRate = value
        audio.pause()
        audio.play()
      })
      gui.add(obj, 'loop').onChange((value) => {
        audio.setLoop(value)
        audio.pause()
        audio.play()
      })
      gui.add(obj, 'offset', 0, 150).onChange((value) => {
        audio.offset = value
        audio.pause()
        audio.play()
      })
      gui.add(obj, 'detune', 0, 1000).onChange((value) => {
        audio.detune = value
        audio.pause()
        audio.play()
      })
      gui.add(obj, 'play')
      gui.add(obj, 'pause')
    }
    {
      for (let i = 0; i < 600; i++) {
        const material = new THREE.SpriteMaterial({
          color: 'orange',
        })
        const sprite = new THREE.Sprite(material)
        sprite.scale.set(10, 10, 10)
        sprite.position.set(
          Math.random() * 4000 - 2000,
          Math.random() * 4000 - 2000,
          Math.random() * 4000 - 2000
        )
        scene.add(sprite)
      }
    }

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(200)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(2400, 2400, 2400)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    let time = 0
    const tweenGroup = new Group()
    const updatePosition = throttle(() => {
      scene.traverse((child) => {
        if (child instanceof THREE.Sprite) {
          const x = child.position.x + simplex.noise(child.position.x, time) * 40
          const y = child.position.y + simplex.noise(child.position.y, time) * 40
          const z = child.position.z + simplex.noise(child.position.z, time) * 40
          // child.position.set(x, y, z)
          const tween = new Tween(child.position)
            .to({ x, y, z }, 500)
            .easing(Easing.Quadratic.InOut)
            .repeat(0)
            .start()
            .onComplete(() => {
              tweenGroup.remove(tween)
            })
          tweenGroup.add(tween)
        }
      })
      time++
    }, 500)

    function render() {
      updatePosition()
      tweenGroup.update()
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
