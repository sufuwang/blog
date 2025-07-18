import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { useEffect } from 'react'
import { Tween, Easing } from '@tweenjs/tween.js'

export default function EntranceAnimation() {
  useEffect(() => {
    const scene = new THREE.Scene()

    {
      const planeGeometry = new THREE.PlaneGeometry(1000, 1000)
      const planeMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color('skyblue'),
      })
      const plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotateX(-Math.PI / 2)
      plane.position.y = -50

      const boxGeometry = new THREE.BoxGeometry(100, 100, 100)
      const boxMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color('orange'),
      })
      const box = new THREE.Mesh(boxGeometry, boxMaterial)
      const box2 = box.clone()
      box2.position.x = 200
      scene.add(plane, box, box2)
    }

    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1000, 200, 900),
      new THREE.Vector3(-400, 800, 1000),
      new THREE.Vector3(0, 0, 0),
    ])
    const geometry = new THREE.TubeGeometry(path, 100, 50, 30)
    const material = new THREE.MeshBasicMaterial({
      color: 'blue',
      wireframe: true,
    })
    material.visible = false
    const pointsMaterial = new THREE.PointsMaterial({
      color: 'orange',
      size: 3,
    })
    const points = new THREE.Points(geometry, pointsMaterial)
    const tube = new THREE.Mesh(geometry, material)
    tube.add(points)
    tube.position.set(0, 500, 800)
    const tubePoints = path.getSpacedPoints(1000).map((item) => {
      return new THREE.Vector3(item.x, item.y + 500, item.z + 800)
    })
    scene.add(tube)

    const tween = new Tween({
      x: -1.3,
      y: 502.7,
      z: 803.3,
      rotation: 0,
    })
      .to(
        {
          x: -1.3,
          y: 502.7,
          z: 803.3,
          rotation: 180,
        },
        2000
      )
      .repeat(0)
      .easing(Easing.Quadratic.InOut)
      .onUpdate((obj) => {
        camera.position.copy(new THREE.Vector3(obj.x, obj.y, obj.z))
        camera.lookAt(0, 0, 0)
        scene.rotation.y = (obj.rotation / 180) * Math.PI
      })

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(200)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000)
    camera.position.set(200, 800, 800)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    let i = 0
    let started = false
    function render(time = 0) {
      if (i < tubePoints.length - 1) {
        camera.position.copy(tubePoints[i])
        camera.lookAt(tubePoints[i + 1])
        i += 2
      } else {
        if (!started) {
          scene.remove(tube)
          tween.start()
          started = true
        }
      }

      tween.update(time)

      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
