'use client'
import { useEffect, useState } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const getMesh = (elements: Array<number>, parameters?: THREE.MeshBasicMaterialParameters) => {
  const geometry = new THREE.BufferGeometry()

  const vertices = new Float32Array(elements)

  const attribute = new THREE.BufferAttribute(vertices, 3)
  geometry.attributes.position = attribute

  const indexes = new Uint16Array([0, 1, 2, 2, 1, 3])
  geometry.index = new THREE.BufferAttribute(indexes, 1)

  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('green'),
    ...parameters,
  })

  return new THREE.Mesh(geometry, material)
}

export default function Geometry() {
  useEffect(() => {
    const scene = new THREE.Scene()

    const pointLight = new THREE.PointLight(0xffffff, 10000)
    pointLight.position.set(80, 80, 80)
    scene.add(pointLight)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(90, width / height, 10, 1000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    new OrbitControls(camera, renderer.domElement)

    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)

    const resetMesh = (wireframe = false) => {
      scene.add(
        getMesh(
          [
            0, 0, 0, 100, 0, 0, 0, 100, 0,

            // 0, 100, 0, 100, 0, 0, 100, 100, 0,
            100, 100, 0,
          ],
          {
            color: new THREE.Color('#' + parseInt((Math.random() * 1000000).toString())),
            wireframe,
          }
        )
      )
      scene.add(
        getMesh(
          [
            0, 0, 0, 0, 100, 0, 0, 0, 100,

            // 0, 0, 100, 0, 100, 0, 0, 100, 100,
            0, 100, 100,
          ],
          {
            color: new THREE.Color('#' + parseInt((Math.random() * 1000000).toString())),
            wireframe,
          }
        )
      )
      scene.add(
        getMesh(
          [
            0, 0, 0, 0, 0, 100, 100, 0, 0,

            // 0, 0, 100, 0, 100, 0, 0, 100, 100,
            100, 0, 100,
          ],
          {
            color: new THREE.Color('#' + parseInt((Math.random() * 1000000).toString())),
            wireframe,
          }
        )
      )
      const axesHelper = new THREE.AxesHelper(200)
      scene.add(axesHelper)
    }

    resetMesh()

    const gui = new GUI()
    gui
      .add({ checkbox: false }, 'checkbox')
      .name('wireframe')
      .onChange((wireframe) => {
        scene.clear()
        resetMesh(wireframe)
      })
  }, [])
}
