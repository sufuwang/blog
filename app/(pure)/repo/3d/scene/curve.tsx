import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect } from 'react'

export default function Curve() {
  useEffect(() => {
    const scene = new THREE.Scene()
    {
      const arc = new THREE.EllipseCurve(0, 0, 100, 100, 0, Math.PI / 2)
      const pointsList = arc.getPoints(140)
      const geometry = new THREE.BufferGeometry()
      geometry.setFromPoints(pointsList)
      // const material = new THREE.PointsMaterial({
      //   color: new THREE.Color('orange'),
      //   size: 1,
      // })
      // const points = new THREE.Points(geometry, material)
      // scene.add(points)
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color('orange'),
      })
      const line = new THREE.Line(geometry, material)
      scene.add(line)
    }

    {
      const arr = [
        new THREE.Vector2(-100, 0),
        new THREE.Vector2(-50, 50),
        new THREE.Vector2(0, 0),
        new THREE.Vector2(50, -50),
        new THREE.Vector2(100, 0),
      ]
      const curve = new THREE.SplineCurve(arr)
      const pointsArr = curve.getPoints(140)
      const geometry = new THREE.BufferGeometry()
      geometry.setFromPoints(pointsArr)
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color('orange'),
      })
      const line = new THREE.Line(geometry, material)
      scene.add(line)

      const pointsMaterial = new THREE.PointsMaterial({
        color: new THREE.Color('pink'),
        size: 2,
      })
      const points = new THREE.Points(geometry, pointsMaterial)
      line.add(points)

      const geometry2 = new THREE.BufferGeometry()
      geometry2.setFromPoints(arr)
      const material2 = new THREE.PointsMaterial({
        color: new THREE.Color('green'),
        size: 4,
      })
      const points2 = new THREE.Points(geometry2, material2)
      const line2 = new THREE.Line(
        geometry2,
        new THREE.LineBasicMaterial({ color: new THREE.Color('green') })
      )
      line.add(points2, line2)
    }

    {
      const p1 = new THREE.Vector2(0, 0)
      const p2 = new THREE.Vector2(50, 100)
      const p3 = new THREE.Vector2(100, 0)
      const curve = new THREE.QuadraticBezierCurve(p1, p2, p3)
      const pointsArr = curve.getPoints(20)
      const geometry = new THREE.BufferGeometry()
      geometry.setFromPoints(pointsArr)
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color('orange'),
      })
      const line = new THREE.Line(geometry, material)

      const geometry2 = new THREE.BufferGeometry()
      geometry2.setFromPoints([p1, p2, p3])
      const material2 = new THREE.PointsMaterial({
        color: new THREE.Color('pink'),
        size: 5,
      })
      const points2 = new THREE.Points(geometry2, material2)
      const line2 = new THREE.Line(
        geometry2,
        new THREE.LineBasicMaterial({
          color: new THREE.Color('pink'),
        })
      )
      line.add(points2, line2)

      scene.add(line)
    }

    {
      const p1 = new THREE.Vector3(-100, 0, 100)
      const p2 = new THREE.Vector3(50, 100, 100)
      const p3 = new THREE.Vector3(100, 0, 140)
      const p4 = new THREE.Vector3(100, 0, 100)
      const curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4)
      const pointsArr = curve.getPoints(20)
      const geometry = new THREE.BufferGeometry()
      geometry.setFromPoints(pointsArr)
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color('orange'),
      })
      const line = new THREE.Line(geometry, material)

      const geometry2 = new THREE.BufferGeometry()
      geometry2.setFromPoints([p1, p2, p3, p4])
      const material2 = new THREE.PointsMaterial({
        color: new THREE.Color('pink'),
        size: 5,
      })
      const points2 = new THREE.Points(geometry2, material2)
      const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial())
      line.add(points2, line2)
      scene.add(line)
    }

    {
      const p1 = new THREE.Vector2(0, 0)
      const p2 = new THREE.Vector2(100, 100)
      const line1 = new THREE.LineCurve(p1, p2)

      const arc = new THREE.EllipseCurve(0, 100, 100, 100, 0, Math.PI)

      const p3 = new THREE.Vector2(-100, 100)
      const p4 = new THREE.Vector2(0, 0)
      const line2 = new THREE.LineCurve(p3, p4)

      const curvePath = new THREE.CurvePath()
      curvePath.add(line1)
      curvePath.add(arc)
      curvePath.add(line2)

      const pointsArr = curvePath.getPoints(20)
      const geometry = new THREE.BufferGeometry()
      geometry.setFromPoints(pointsArr as THREE.Vector2[])
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color('pink'),
      })

      const line = new THREE.Line(geometry, material)
      scene.add(line)
    }

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
