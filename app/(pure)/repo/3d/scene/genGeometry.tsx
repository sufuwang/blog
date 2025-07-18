import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect } from 'react'

export default function GenGeometry() {
  useEffect(() => {
    const scene = new THREE.Scene()
    {
      const pointsArr = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(50, 50),
        new THREE.Vector2(20, 80),
        new THREE.Vector2(0, 150),
      ]
      const geometry = new THREE.LatheGeometry(pointsArr, 20)
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color('green'),
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geometry, material)

      const geometry2 = new THREE.BufferGeometry()
      geometry2.setFromPoints(pointsArr)
      const material2 = new THREE.PointsMaterial({
        color: new THREE.Color('blue'),
        size: 4,
      })
      const points2 = new THREE.Points(geometry2, material2)
      const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial())
      scene.add(mesh, points2, line2)
    }
    {
      const p1 = new THREE.Vector3(-100, 0, 0)
      const p2 = new THREE.Vector3(50, 100, 0)
      const p3 = new THREE.Vector3(100, 0, 100)
      const p4 = new THREE.Vector3(100, 0, 0)
      const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4)
      const geometry = new THREE.TubeGeometry(curve, 100, 20, 20)
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color('orange'),
        side: THREE.DoubleSide,
        wireframe: true,
      })
      const mesh = new THREE.Mesh(geometry, material)

      const geometry2 = new THREE.BufferGeometry()
      geometry2.setFromPoints([p1, p2, p3, p4])
      const material2 = new THREE.PointsMaterial({
        color: new THREE.Color('blue'),
        size: 10,
      })
      const points2 = new THREE.Points(geometry2, material2)
      const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial())
      scene.add(mesh, points2, line2)
    }
    {
      // const pointsArr = [
      //   new THREE.Vector2(100, 150),
      //   new THREE.Vector2(50, 160),
      //   new THREE.Vector2(0, 150),
      //   new THREE.Vector2(0, 170),
      //   new THREE.Vector2(50, 200),
      // ]
      // const shape = new THREE.Shape(pointsArr)

      const shape = new THREE.Shape()
      shape.moveTo(150, 0)
      shape.lineTo(150, 20)
      shape.lineTo(170, 20)
      shape.lineTo(170, 0)

      const path = new THREE.Path()
      path.arc(160, 10, 4, 0, Math.PI * 4, false)
      shape.holes.push(path)

      // const geometry = new THREE.ShapeGeometry(shape)
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: 4 })
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color('lightgreen'),
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
    }

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(200)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000)
    camera.position.set(0, 100, 200)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
