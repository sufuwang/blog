'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'

export default function GuiControl() {
  const ref = useRef<HTMLDivElement>(null)

  const createBox = (size = 80) => {
    const geometry = new THREE.BoxGeometry(size, size, size)
    const material = new THREE.MeshBasicMaterial({
      color: 'rgb(180,180,180)',
      wireframe: true,
    })
    return new THREE.Mesh(geometry, material)
  }

  useEffect(() => {
    const c = ref.current
    if (c) {
      const scene = new THREE.Scene()
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
      })

      const x = window.innerWidth / window.innerHeight
      const width = c.clientWidth
      const height = width / x
      c.appendChild(renderer.domElement)
      renderer.setSize(width, height)

      let box = createBox()
      scene.add(box)

      const gui = new GUI()
      gui.title('GUI 控制')
      const boxGui = gui.addFolder('box')
      boxGui.addColor(box.material, 'color')
      boxGui
        .add({ size: 80 }, 'size')
        .name('滑块')
        .min(50)
        .max(150)
        .step(1)
        .onChange((size) => {
          scene.remove(box)
          box = createBox(size)
          scene.add(box)
        })
      boxGui.close()

      setTimeout(() => {
        boxGui.open()
      }, 1000)

      gui.domElement.style.position = 'absolute'
      c.appendChild(gui.domElement)

      const pointLight = new THREE.PointLight(0xffffff, 40000)
      pointLight.position.set(120, 120, 120)
      scene.add(pointLight)

      const axesHelper = new THREE.AxesHelper(80)
      scene.add(axesHelper)

      const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
      camera.position.set(200, 0, 0)
      camera.lookAt(0, 0, 0)

      new OrbitControls(camera, renderer.domElement)
  
      function r() {
        renderer.render(scene, camera)
        requestAnimationFrame(r)
      }
      requestAnimationFrame(r)
    }
  }, [])

  return <div ref={ref} className="relative" />
}
