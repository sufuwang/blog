'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons'
import { getSizeByScreenRatio } from '@/tools/utils'

export default function Summary() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)

    const axesHelper = new THREE.AxesHelper(20)
    scene.add(axesHelper)

    const light = new THREE.PointLight(0xffffff, 100000)
    light.position.set(200, 200, 200)
    scene.add(light)

    const camera = new THREE.PerspectiveCamera()
    camera.position.set(200, 0, 0)
    camera.lookAt(0, 0, 0)

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const render = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()
  }, [])

  return <div ref={ref} className="overflow-hidden rounded-md" />
}
