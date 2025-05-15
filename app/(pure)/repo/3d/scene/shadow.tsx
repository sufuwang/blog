'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

export default function Material() {
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer()
  const gui = new GUI()

  useEffect(() => {
    {
      const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
      const planeMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color('skyblue'),
        side: THREE.DoubleSide,
      })
      const plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotateX(-Math.PI / 2)
      plane.position.y = -50
      // 表示这个地面可以接收阴影
      plane.receiveShadow = true

      const boxGeometry = new THREE.BoxGeometry(200, 600, 200)
      const boxMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color('orange'),
      })
      const box = new THREE.Mesh(boxGeometry, boxMaterial)
      box.position.y = 200
      // 表示这个物体可以投射阴影
      box.castShadow = true

      const box2 = box.clone()
      box2.position.x = 500

      scene.add(plane, box, box2)
    }

    const axesHelper = new THREE.AxesHelper(500)
    scene.add(axesHelper)

    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(1000, 1000, 1000)
    // 光源开启阴影
    directionalLight.castShadow = true
    directionalLight.shadow.camera.left = -500
    directionalLight.shadow.camera.right = 500
    directionalLight.shadow.camera.top = 500
    directionalLight.shadow.camera.bottom = -500
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 3000
    scene.add(directionalLight)

    gui.add(directionalLight.position, 'x', 0, 10000)
    gui.add(directionalLight.position, 'y', 0, 10000)
    gui.add(directionalLight.position, 'z', 0, 10000)

    const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    scene.add(cameraHelper)

    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
    camera.position.set(2200, 2200, 2200)
    camera.lookAt(0, 0, 0)

    renderer.setSize(width, height)
    // 渲染器开启阴影
    renderer.shadowMap.enabled = true

    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
