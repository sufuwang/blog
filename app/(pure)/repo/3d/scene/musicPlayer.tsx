import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect } from 'react'
import _ from 'lodash-es'
import { Easing, Group as TGroup, Tween } from '@tweenjs/tween.js'
import { SimplexNoise } from 'three/examples/jsm/Addons.js'

type Key = 'player' | 'stop' | 'note'
type Mesh<T = THREE.Mesh> = T & { target: T; name: Key }
type Group<D, T = THREE.Group> = T & { data: D }

const simplexNoise = new SimplexNoise()

const createCanvas = (key: Key) => {
  const dpr = window.devicePixelRatio
  const canvas = document.createElement('canvas')
  const w = (canvas.width = 100 * dpr)
  const h = (canvas.height = 100 * dpr)
  const c = canvas.getContext('2d')!
  if (key === 'player') {
    c.translate(w / 2, h / 2)
    c.arc(0, 0, 40 * dpr, 0, Math.PI * 2)
    c.fillStyle = 'orange'
    c.fill()
    c.beginPath()
    c.moveTo(-10 * dpr, -20 * dpr)
    c.lineTo(-10 * dpr, 20 * dpr)
    c.lineTo(20 * dpr, 0)
    c.fillStyle = 'white'
    c.closePath()
    c.fill()
  } else if (key === 'stop') {
    c.translate(w / 2, h / 2)
    c.arc(0, 0, 40 * dpr, 0, Math.PI * 2)
    c.fillStyle = 'orange'
    c.fill()
    c.beginPath()
    c.moveTo(-10 * dpr, -20 * dpr)
    c.lineTo(-10 * dpr, 20 * dpr)
    c.moveTo(10 * dpr, -20 * dpr)
    c.lineTo(10 * dpr, 20 * dpr)
    c.lineWidth = 10
    c.lineCap = 'round'
    c.strokeStyle = 'white'
    c.stroke()
    c.closePath()
    c.fill()
  } else if (key === 'note') {
    c.translate(w / 2, h / 2)
    c.moveTo(-20 * dpr, 40 * dpr)
    c.lineTo(-20 * dpr, -10 * dpr)
    c.lineTo(20 * dpr, -10 * dpr)
    c.lineTo(30 * dpr, 30 * dpr)
    c.lineWidth = 10
    c.lineJoin = 'round'
    c.strokeStyle = 'yellow'
    c.stroke()
    c.beginPath()
    c.ellipse(45, 60, 15, 20, Math.PI / 2, 0, Math.PI * 2)
    c.fillStyle = 'yellow'
    c.fill()
    c.beginPath()
    c.ellipse(-55, 80, 15, 20, Math.PI / 2, 0, Math.PI * 2)
    c.fill()
  }
  return canvas
}
const createButton = (key: Key) => {
  const geometry = new THREE.BoxGeometry(100, 80, 100)
  const material = new THREE.MeshPhysicalMaterial({
    color: 'white',
    roughness: 0.3,
  })
  const button = new THREE.Mesh(geometry, material) as unknown as Mesh
  {
    const geometry = new THREE.PlaneGeometry(100, 100)
    const material = new THREE.MeshPhysicalMaterial({
      color: 'white',
      roughness: 0.3,
      map: new THREE.CanvasTexture(createCanvas(key)),
      transparent: true,
    })
    const mesh = new THREE.Mesh(geometry, material) as unknown as Mesh
    mesh.rotateX(-Math.PI / 2)
    mesh.position.y = 42
    button.add(mesh)
    mesh.target = button
  }
  button.name = key
  button.target = button
  return button
}
const createAudio = () => {
  const listener = new THREE.AudioListener()
  const audio = new THREE.Audio(listener)
  const loader = new THREE.AudioLoader()
  loader.load('/audio/superman.mp3', (buffer) => {
    audio.setBuffer(buffer)
    audio.autoplay = false
  })
  return audio
}
const createNotes = () => {
  const group = new THREE.Group()
  for (let i = 0; i < 100; i++) {
    const texture = new THREE.CanvasTexture(createCanvas('note'))
    const material = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(100, 100, 100)
    sprite.position.set(
      -2000 + Math.random() * 2000,
      Math.random() * 2000,
      -1000 + Math.random() * 2400
    )
    group.add(sprite)
  }
  return group
}
let time = 0
const notesTweenGroup = new TGroup()
const createTweenGroupNotes = _.throttle((notes: ReturnType<typeof createNotes>) => {
  notes.children.forEach((note) => {
    const tween = new Tween(note.position)
      .to(
        {
          x: note.position.x + simplexNoise.noise(note.position.x, time) * 50,
          y: note.position.y + simplexNoise.noise(note.position.y, time) * 50,
          z: note.position.z + simplexNoise.noise(note.position.z, time) * 50,
        },
        300
      )
      .easing(Easing.Quadratic.In)
      .repeat(0)
      .start()
      .onComplete(() => {
        notesTweenGroup.remove(tween)
      })
    notesTweenGroup.add(tween)
  })
  time++
  return notesTweenGroup
}, 300)
const createCylinders = () => {
  const group = new THREE.Group()
  const yellow = new THREE.Color('yellow')
  const red = new THREE.Color('red')
  for (let i = 0; i < 21; i++) {
    const shape = new THREE.Shape()
    shape.absarc(0, 0, i * 50, 0, Math.PI * 2)
    const path = new THREE.Path()
    path.absarc(0, 0, i * 50 - 20, 0, Math.PI * 2)
    shape.holes.push(path)
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 300, curveSegments: 50 })
    const material = new THREE.MeshPhysicalMaterial({
      color: red.clone().lerp(yellow, i / 21),
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotateX(-Math.PI / 2)
    group.add(mesh)
  }
  group.position.x = -1200
  return group
}
const createUpdaterCylinders = (
  audio: THREE.Audio,
  children: ReturnType<typeof createCylinders>['children']
) => {
  const analyser = new THREE.AudioAnalyser(audio)
  return () => {
    const data = analyser.getFrequencyData()
    const totalArr = _.map(_.chunk(data, 49), (arr) => _.sum(arr))
    children.forEach((child, index) => {
      child.scale.z = totalArr[index] / 4000
    })
  }
}
const createLyricItem = (text) => {
  const dpr = window.devicePixelRatio
  const canvas = document.createElement('canvas')
  const w = (canvas.width = text.length * 30 * dpr)
  const h = (canvas.height = 100 * dpr)
  const c = canvas.getContext('2d')!
  c.translate(w / 2, h / 2)
  c.fillStyle = '#FFF'
  c.font = 'normal 24px 微软雅黑'
  c.textBaseline = 'middle'
  c.textAlign = 'center'
  c.fillText(text, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  const geometry = new THREE.PlaneGeometry(text.length * 300, 500)
  const material = new THREE.MeshPhysicalMaterial({
    map: texture,
    transparent: true,
    roughness: 0.3,
  })
  const plane = new THREE.Mesh(geometry, material)
  return plane
}
const createLyric = async () => {
  const res = await fetch('/audio/superman.lrc')
  const text = await res.text()
  const data = text
    .replace(/\n$/, '')
    .split('\n')
    .map((row, i) => {
      const index = row.indexOf(']')
      const time = row.slice(1, index).split(':')
      const minute = +time[0]
      const [second, mSecond] = time[1].split('.').map((r) => +r)
      return [[minute * 60 * 1000 + second * 1000 + mSecond, i * 200], row.slice(index + 1)]
    })
  const group = new THREE.Group() as Group<typeof data>
  data.forEach((row) => {
    const l = createLyricItem(row[1])
    l.position.z = +row[0][1]
    l.rotateX(-Math.PI / 4)
    group.add(l)
  })
  group.data = data
  group.name = 'lyric'
  group.position.x = 1200
  return group
}
const createUpdaterLyric = (
  lyricMesh: UnwrapPromise<ReturnType<typeof createLyric>>,
  audio: ReturnType<typeof createAudio>
) => {
  let i = 0
  const tweenGroup = new TGroup()
  return (currentTime) => {
    const data = lyricMesh.data
    if (audio.isPlaying) {
      if (i < data.length && currentTime >= +data[i][0][0] && currentTime < +data[i + 1][0][0]) {
        const tween = new Tween({ z: lyricMesh.position.z })
          .to({ z: -data[i + 1][0][1] }, 300)
          .easing(Easing.Quadratic.In)
          .start()
          .onUpdate(({ z }) => {
            lyricMesh.position.z = z
          })
          .onComplete(() => {
            tweenGroup.remove(tween)
          })
        tweenGroup.add(tween)
        i++
      }
    }
    return tweenGroup
  }
}

export default function MusicPlayer() {
  useEffect(() => {
    const scene = new THREE.Scene()
    const buttons = new THREE.Group()
    const audio = createAudio()

    {
      const button = createButton('player')
      button.position.x = 2600
      button.position.z = -1600
      buttons.add(button)
    }
    {
      const button = createButton('stop')
      button.position.x = 2800
      button.position.z = -1600
      buttons.add(button)
    }
    scene.add(buttons)

    {
      createLyric().then((group) => {
        scene.add(group)
      })
    }

    const notes = createNotes()
    scene.add(notes)

    const cylinders = createCylinders()
    console.info('cylinders: ', cylinders.position)
    scene.add(cylinders)

    const directionLight = new THREE.DirectionalLight(0xffffff, 2)
    directionLight.position.set(500, 400, 300)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const width = window.innerWidth
    const height = window.innerHeight

    const helper = new THREE.AxesHelper(500)
    scene.add(helper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(0, 600, 5400)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    renderer.setSize(width, height)

    renderer.domElement.addEventListener('click', (event) => {
      const x = (event.offsetX / width) * 2 - 1
      const y = -((event.offsetY / height) * 2 - 1)

      const rayCaster = new THREE.Raycaster()
      rayCaster.setFromCamera(new THREE.Vector2(x, y), camera)

      const intersectObjects = rayCaster.intersectObjects(buttons.children)
      if (intersectObjects.length) {
        buttons.children.forEach((button) => {
          button.scale.y = 1
          button.position.y = 0
        })
        const { target } = intersectObjects[0].object as unknown as Mesh
        target.scale.y = 0.6
        target.position.y = (-80 * (1 - 0.6)) / 2
        if (target.name === 'player') {
          audio.play()
        } else if (target.name === 'stop') {
          audio.pause()
        }
      }
    })

    const clock = new THREE.Clock()
    let cur = 0
    const updaterCylinders = createUpdaterCylinders(audio, cylinders.children)
    let updaterLyric: null | ReturnType<typeof createUpdaterLyric> = null
    function render() {
      if (!updaterLyric) {
        const t = scene.children.find((row) => row.name === 'lyric')! as unknown as UnwrapPromise<
          ReturnType<typeof createLyric>
        >
        if (t) {
          updaterLyric = createUpdaterLyric(t, audio)
        }
      }
      const diff = clock.getDelta()
      if (audio.isPlaying) {
        cur += diff
      }
      const tweenGroup = updaterLyric?.(Math.floor(cur * 1000))
      tweenGroup?.update()
      notesTweenGroup.update()
      createTweenGroupNotes(notes)
      updaterCylinders()
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
