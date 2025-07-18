'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { DecalGeometry } from 'three/examples/jsm/Addons'

const loader = new THREE.TextureLoader()
const texture = loader.load('/material/xiaoxin.png')
texture.colorSpace = THREE.SRGBColorSpace

const createDecal = (mesh, position) => {
  const orientation = new THREE.Euler()
  const size = new THREE.Vector3(50, 50, 50)

  const geometry = new DecalGeometry(mesh, position, orientation, size)
  const material = new THREE.MeshPhongMaterial({
    polygonOffset: true,
    polygonOffsetFactor: -1,
    map: texture,
    transparent: true,
  })
  return new THREE.Mesh(geometry, material)
}

export default function Base() {
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

    scene.add(createDecal(mesh, new THREE.Vector3(0, 0, 50)))

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

    renderer.domElement.addEventListener('click', (event) => {
      const x = (event.offsetX / width) * 2 - 1
      const y = -((event.offsetY / height) * 2 - 1)
      const r = new THREE.Raycaster()
      r.setFromCamera(new THREE.Vector2(x, y), camera)
      const is = r.intersectObjects(scene.children)
      if (is.length) {
        const p = is[0].point
        scene.add(createDecal(mesh, p))
      }
    })

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
