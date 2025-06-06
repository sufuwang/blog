'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
import SpriteText from 'three-spritetext'
import { Tween, Easing, Group } from '@tweenjs/tween.js'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'

interface Row {
  name: string
  value: number
  angle?: number
  color?: string
}
const Colors = ['red', 'pink', 'blue', 'purple', 'orange', 'lightblue', 'green', 'lightgreen']
const Data: Array<Row> = [
  {
    name: '春节销售额',
    value: 1000,
    color: Colors[0],
  },
  {
    name: '夏节销售额',
    value: 3000,
    color: Colors[1],
  },
  {
    name: '秋节销售额',
    value: 800,
    color: Colors[2],
  },
  {
    name: '冬节销售额',
    value: 500,
    color: Colors[3],
  },
]
const total = Data.reduce((total, row) => total + row.value, 0)
Data.forEach((row) => {
  row.angle = (row.value / total) * 360
})

type Mesh = THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshPhongMaterial, THREE.Object3DEventMap> & {
  rad: number
  shape: THREE.Shape
}

export default function BarChart() {
  const scene = new THREE.Scene()

  useEffect(() => {
    {
      let startAngle = 0
      const R = 300
      Data.forEach(({ angle, color, name, value }) => {
        const rad = THREE.MathUtils.degToRad(angle!)

        const path = new THREE.CurvePath<THREE.Vector2>()

        const x1 = R * Math.cos(startAngle)
        const y1 = R * Math.sin(startAngle)
        const x2 = R * Math.cos(startAngle + rad)
        const y2 = R * Math.sin(startAngle + rad)

        const v1 = new THREE.Vector2(0, 0)
        const v2 = new THREE.Vector2(x1, y1)
        const v3 = new THREE.Vector2(x2, y2)

        const l1 = new THREE.LineCurve(v1, v2)
        const l2 = new THREE.LineCurve(v1, v3)
        const curve = new THREE.EllipseCurve(0, 0, R, R, startAngle, startAngle + rad)

        path.add(l1)
        path.add(curve)
        path.add(l2)

        const points = path.getPoints(100)
        const shape = new THREE.Shape(points)

        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 60 })
        const material = new THREE.MeshPhongMaterial({ color })
        const mesh = new THREE.Mesh(geometry, material) as Mesh
        mesh.rad = (2 * startAngle + rad) / 2
        mesh.shape = shape
        scene.add(mesh)

        const sprite = new SpriteText(`${name}\n${value}`, 16)
        sprite.position.x = R * Math.cos(startAngle + rad / 2)
        sprite.position.y = R * Math.sin(startAngle + rad / 2)
        sprite.strokeColor = 'lightgreen'
        sprite.strokeWidth = 1
        sprite.position.z = 140
        mesh.add(sprite)

        startAngle += rad
      })

      scene.rotateX(-Math.PI / 2)
    }

    const directionLight = new THREE.DirectionalLight(0xffffff, 2)
    directionLight.position.set(500, 400, 300)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const width = window.innerWidth
    const height = window.innerHeight

    // const helper = new THREE.AxesHelper(1000)
    // scene.add(helper);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(500, 500, 500)
    camera.lookAt(0, 0, 0)

    const group = new Group()
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    renderer.setSize(width, height)
    renderer.domElement.addEventListener('click', (event) => {
      const x = (event.offsetX / width) * 2 - 1
      const y = -((event.offsetY / height) * 2 - 1)
      const ray = new THREE.Raycaster()
      ray.setFromCamera(new THREE.Vector2(x, y), camera)
      const meshes = scene.children.filter((child) => child instanceof THREE.Mesh) as Mesh[]
      const intersections = ray
        .intersectObjects(meshes)
        .filter(({ object }) => (object as unknown as Mesh).isMesh)

      if (intersections.length) {
        const [{ object }] = intersections as unknown as [{ object: Mesh }]
        const mesh = meshes.find((m) => m.position.x !== 0)

        const tweenB1 = new Tween(object.position)
          .to(
            {
              ...object.position,
              x: 100 * Math.cos(object.rad),
              y: 100 * Math.sin(object.rad),
            },
            200
          )
          .repeat(0)
          .easing(Easing.Quadratic.InOut)
          .onComplete(() => {
            group.remove(tweenB1)
          })
        const tweenB2 = new Tween({ depth: 60 })
          .to({ depth: 120 }, 200)
          .repeat(0)
          .easing(Easing.Quadratic.InOut)
          .onUpdate((props) => {
            object.geometry = new THREE.ExtrudeGeometry(object.shape, props)
          })
          .onComplete(() => {
            group.remove(tweenB2)
          })

        if (mesh) {
          const tweenA1 = new Tween(mesh.position)
            .to({ ...mesh.position, x: 0, y: 0 }, 200)
            .repeat(0)
            .easing(Easing.Quadratic.Out)
            .onComplete(() => {
              group.remove(tweenA1)
            })
          const tweenA2 = new Tween({ depth: 120 })
            .to({ depth: 60 }, 200)
            .repeat(0)
            .easing(Easing.Quadratic.Out)
            .onUpdate((props) => {
              mesh.geometry = new THREE.ExtrudeGeometry(mesh.shape, props)
            })
            .onComplete(() => {
              group.remove(tweenA2)
            })
          tweenA1.chain(tweenA2)
          tweenA2.chain(tweenB1)
          tweenB1.chain(tweenB2)
          tweenA1.start()
          group.add(tweenA1, tweenA2, tweenB1, tweenB2)
        } else {
          tweenB1.chain(tweenB2)
          tweenB1.start()
          group.add(tweenB1, tweenB2)
        }
      }
    })

    function render() {
      group.update()
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
