'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { getSizeByScreenRatio } from '@/tools/utils'
import Stats from 'three/examples/jsm/libs/stats.module.js'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function Shadow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current
    if (c) {
      const scene = new THREE.Scene()
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
      })

      const light = new THREE.PointLight(0xffffff, 40000)
      light.position.set(0, 120, 0)
      light.castShadow = true
      light.shadow.camera.near = 1
      light.shadow.camera.far = 160
      scene.add(light)
      scene.add(new THREE.CameraHelper(light.shadow.camera))

      const axesHelper = new THREE.AxesHelper(80)
      scene.add(axesHelper)

      const { width, height } = getSizeByScreenRatio(c.clientWidth)
      c.appendChild(renderer.domElement)
      renderer.setSize(width, height)
      renderer.shadowMap.enabled = true

      const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
      camera.position.set(300, 300, 0)
      camera.lookAt(0, 0, 0)

      const box = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), new THREE.MeshNormalMaterial())
      box.position.set(0, 40, 0)
      box.castShadow = true
      scene.add(box)

      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(300, 300),
        new THREE.MeshPhysicalMaterial({ color: 'white', side: THREE.DoubleSide })
      )
      plane.rotateX(Math.PI / 2)
      plane.receiveShadow = true
      scene.add(plane)

      const stats = new Stats()
      stats.dom.style.position = 'absolute'
      c.appendChild(stats.dom)

      const orbitControls = new OrbitControls(camera, renderer.domElement)

      const x = {
        downloadImage() {
          renderer.domElement.toBlob((blob) => {
            if (blob) {
              downloadBlob(blob, 'browser.png')
            }
          }, 'image/png')
        },
        onDownloadVideo() {
          const stream = renderer.domElement.captureStream(60)
          const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
          orbitControls.autoRotate = true
          orbitControls.autoRotateSpeed = 8
          mediaRecorder.start()
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              downloadBlob(event.data, 'browser.webm')
            }
          }
          setTimeout(() => {
            orbitControls.autoRotate = false
            orbitControls.reset()
            mediaRecorder.stop()
          }, 5000)
        },
      }

      const gui = new GUI()
      gui.add(x, 'downloadImage').name('截屏')
      gui.add(x, 'onDownloadVideo').name('录屏')
      gui.domElement.style.position = 'absolute'
      gui.domElement.style.width = '80px'
      c.appendChild(gui.domElement)

      function r() {
        stats.update()
        orbitControls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(r)
      }
      requestAnimationFrame(r)
    }
  }, [])

  return <div ref={ref} className="relative overflow-hidden rounded-md" />
}
