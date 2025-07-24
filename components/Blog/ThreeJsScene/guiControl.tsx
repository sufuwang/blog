'use client'
import useThreeJsScene from '@/hooks/useThreeJsScene'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

export default function GuiControl() {
  const ref = useRef<HTMLDivElement>(null)
  const { scene, renderer } = useThreeJsScene({ cameraPosition: [200, 0, 0] })

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
    }
  }, [])

  return <div ref={ref} className="relative" />
}
