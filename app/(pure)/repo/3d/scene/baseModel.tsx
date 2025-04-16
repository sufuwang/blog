'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

export default function RepoPage() {
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer()

  useEffect(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      0, 0, 0, 50, 0, 0, 0, 50, 0, 0, 0, 50, 100, 0, 0, 0, 100, 0, 0, 0, 100,
    ])
    const attribute = new THREE.BufferAttribute(vertices, 3)
    geometry.attributes.position = attribute
    const material = new THREE.PointsMaterial({
      color: new THREE.Color('orange'),
      size: 10,
    })
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    {
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color('red'),
      })
      const line = new THREE.Line(geometry, material)
      scene.add(line)
    }
    {
      const geometry = new THREE.BufferGeometry()
      geometry.attributes.position = new THREE.BufferAttribute(
        new Float32Array([0, 0, 0, 100, 0, 0, 0, 100, 0, 100, 100, 0]),
        3
      )
      const indexes = new Uint16Array([0, 1, 2, 2, 1, 3])
      geometry.index = new THREE.BufferAttribute(indexes, 1)

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color('orange'),
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
    }
    {
      const geometry = new THREE.PlaneGeometry(100, 100, 2, 3)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color('orange'),
        wireframe: true,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(80, 0, 80)
      mesh.rotation.x = Math.PI / 2
      scene.add(mesh)
    }
    {
      const geometry = new THREE.CylinderGeometry(50, 50, 80, 10)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color('orange'),
        wireframe: true,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(0, 0, -100)
      scene.add(mesh)
    }

    const pointLight = new THREE.PointLight(0xffffff, 40000)
    pointLight.position.set(120, 120, 120)
    scene.add(pointLight)

    {
      const pointLight = new THREE.PointLight(0xffffff, 40000)
      pointLight.position.set(-120, -120, -120)
      scene.add(pointLight)
    }

    const axesHelper = new THREE.AxesHelper(200)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)
    renderer.setSize(width, height)

    document.body.appendChild(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)

    function r() {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    requestAnimationFrame(r)
  }, [])
}
