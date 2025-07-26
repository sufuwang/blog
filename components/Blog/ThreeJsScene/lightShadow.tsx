'use client'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { getSizeByScreenRatio } from '@/tools/utils'
import { OrbitControls } from 'three/examples/jsm/Addons'

export default function LightShadow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!
    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    renderer.setClearColor('lightblue')
    renderer.shadowMap.enabled = true

    const axesHelper = new THREE.AxesHelper(60)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(400, 300, 0)
    camera.lookAt(0, 0, 0)

    const light = new THREE.PointLight(0xffffff, 40000)
    light.position.set(60, 260, 60)
    light.shadow.camera.far = 360
    light.shadow.camera.near = 1
    light.castShadow = true

    const helper = new THREE.PointLightHelper(light, 10)
    scene.add(light, helper)

    const cameraHelper = new THREE.CameraHelper(light.shadow.camera)
    scene.add(cameraHelper)

    const boxGeo = new THREE.BoxGeometry(60, 60, 60)
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: 'rgb(180,180,180)',
    })
    const box = new THREE.Mesh(boxGeo, boxMaterial)
    box.castShadow = true
    scene.add(box)

    const planeGeo = new THREE.PlaneGeometry(180, 180)
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 'white',
      side: THREE.DoubleSide,
    })
    const plane = new THREE.Mesh(planeGeo, planeMaterial)
    plane.receiveShadow = true
    plane.rotateX(Math.PI / 2)
    plane.position.set(0, -60, 0)
    scene.add(plane)

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-lg" />
}
