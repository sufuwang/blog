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
    const geometry = new THREE.BoxGeometry(100, 100, 100)
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color('orange'),
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 0, 0)
    scene.add(mesh)

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

    const gui = new GUI()

    const meshFolder = gui.addFolder('mesh')
    meshFolder.addColor(mesh.material, 'color')
    meshFolder.add(mesh.position, 'x').step(10)
    meshFolder.add(mesh.position, 'y').step(10)
    meshFolder.add(mesh.position, 'z').step(10)

    const lightFolder = gui.addFolder('light')
    lightFolder.add(pointLight.position, 'x').step(10)
    lightFolder.add(pointLight.position, 'y').step(10)
    lightFolder.add(pointLight.position, 'z').step(10)
    lightFolder.add(pointLight, 'intensity').step(1000)

    const otherFolder = gui.addFolder('other')
    const obj = {
      input: '天王盖地虎',
      checkbox: false,
      slider: 0,
      selectA: '111',
      selectB: 'Bbb',
      logic: function () {
        alert('执行一段逻辑!')
      },
    }
    otherFolder
      .add(obj, 'input')
      .name('输入框')
      .onChange((value) => {
        console.log(value)
      })
    otherFolder.add(obj, 'checkbox').name('勾选框')
    otherFolder.add(obj, 'slider').name('滑块').min(-10).max(10).step(0.5)
    otherFolder.add(obj, 'selectA', ['111', '222', '333']).name('下拉框 A')
    otherFolder.add(obj, 'selectB', { Aaa: 0, Bbb: 0.1, Ccc: 5 }).name('下拉框 B')
    otherFolder.add(obj, 'logic').name('按钮')

    function r() {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    requestAnimationFrame(r)
  }, [])
}
