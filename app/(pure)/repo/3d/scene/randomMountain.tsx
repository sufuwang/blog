'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { createNoise2D } from 'simplex-noise'

const noise2D = createNoise2D()

export default function RandomMountain() {
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer()

  useEffect(() => {
    const geometry = new THREE.PlaneGeometry(3000, 3000, 300, 300)
    const positions = geometry.attributes.position

    const wave = () => {
      positions.needsUpdate = true
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        const z = noise2D(x / 120, y / 120) * 30 + Math.sin(Date.now() * 0.002 + x * 0.05) * 6
        positions.setZ(i, z)
      }
    }

    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('orange'),
      wireframe: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotateX(Math.PI / 2)
    scene.add(mesh)

    const pointLight = new THREE.PointLight(0xffffff, 40000)
    pointLight.position.set(120, 120, 120)
    scene.add(pointLight)

    {
      const pointLight = new THREE.PointLight(0xffffff, 40000)
      pointLight.position.set(-120, -120, -120)
      scene.add(pointLight)
    }

    // const axesHelper = new THREE.AxesHelper(200)
    // scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight
    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)
    renderer.setSize(width, height)

    document.body.appendChild(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)

    function r() {
      wave()
      mesh.rotateZ(0.0012)
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    requestAnimationFrame(r)
  }, [])
}
