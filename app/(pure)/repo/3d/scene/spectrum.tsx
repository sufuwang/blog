import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { useEffect } from 'react'
import lodash from 'lodash-es'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

export default function Fireworm() {
  useEffect(() => {
    const scene = new THREE.Scene()

    const listener = new THREE.AudioListener()
    const audio = new THREE.Audio(listener)
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load('/audio/superman.mp3', (buffer) => {
      audio.setBuffer(buffer)
    })
    const analyser = new THREE.AudioAnalyser(audio)

    const gui = new GUI()
    const obj = {
      volume: 1,
      loop: true,
      playbackRate: 1,
      offset: 0,
      detune: 0,
      play() {
        audio.pause()
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

    const group = new THREE.Group()
    {
      for (let i = 0; i < 21; i++) {
        const geometry = new THREE.BoxGeometry(100, 300, 100)
        const material = new THREE.MeshPhongMaterial({
          // color: 'orange',
          vertexColors: true,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = (i - 10) * 180
        group.add(mesh)
      }
      scene.add(group)
    }

    const directionLight = new THREE.DirectionalLight(0xffffff, 2)
    directionLight.position.set(500, 400, 300)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    // const axesHelper = new THREE.AxesHelper(200)
    // scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(0, 100, 2700)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    renderer.setSize(width, height)

    const calc = () => {
      const data = lodash.map(lodash.chunk(analyser.getFrequencyData(), 50), (arr) =>
        lodash.sum(arr)
      )
      for (let i = 0; i < group.children.length; i++) {
        const box = group.children[i] as THREE.Mesh<
          THREE.BoxGeometry,
          THREE.MeshPhongMaterial,
          THREE.Object3DEventMap
        >
        const height = data[i] / 10
        box.geometry.dispose()
        box.geometry = new THREE.BoxGeometry(100, height, 100)
        box.position.y = height / 2

        const positions = box.geometry.attributes.position
        const colorsArr: number[] = []
        const color1 = new THREE.Color('yellow')
        const color2 = new THREE.Color('red')
        for (let i = 0; i < positions.count; i++) {
          const percent = positions.getY(i) / 300
          const c = color1.clone().lerp(color2, percent)
          colorsArr.push(c.r, c.g, c.b)
        }
        const colors = new Float32Array(colorsArr)
        box.geometry.attributes.color = new THREE.BufferAttribute(colors, 3)
      }
    }

    const stats = new Stats()
    document.body.appendChild(stats.dom)

    const render = () => {
      calc()
      stats.update()
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
