'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { Tween, Easing, Group } from '@tweenjs/tween.js'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/Addons.js'

export default function RepoPage() {
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer()

  useEffect(() => {
    const geometry = new THREE.BoxGeometry(60, 60, 60)
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color('orange'),
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 0, 0)
    {
      const ele = document.createElement('div')
      ele.innerHTML = '<p style="background:#fff;padding: 10px;">这是 box1</p>'
      const obj = new CSS2DObject(ele)
      obj.position.y = 60
      mesh.add(obj)
    }
    scene.add(mesh)

    const pointLight = new THREE.PointLight(0xffffff, 500000)
    pointLight.position.set(300, 300, 300)
    scene.add(pointLight)

    // {
    //   const pointLight = new THREE.PointLight(0xffffff, 40000)
    //   pointLight.position.set(-120, -120, -120)
    //   scene.add(pointLight)
    // }

    const axesHelper = new THREE.AxesHelper(300)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
    camera.position.set(400, 400, 400)
    camera.lookAt(0, 0, 0)
    renderer.setSize(width, height)

    {
      // fov：影响可视范围角度、离物体远近
      // aspect：可视范围宽高比，一般设置网页宽高比
      // near：近裁截面距离，一般保持默认值 0.1，当你需要截掉一些特别近的物体的时候，把它加大
      // far：远裁截面距离，如果有的物体被裁截掉看不到了，就需要调大 far 把它们包含进来
      /**
       * constructor PerspectiveCamera(fov?: number, aspect?: number, near?: number, far?: number): THREE.PerspectiveCamera
          @remarks — Together these define the camera's viewing frustum.
          @param fov — Camera frustum vertical field of view. Default 50.
          @param aspect — Camera frustum aspect ratio. Default 1.
          @param near — Camera frustum near plane. Default 0.1.
          @param far — Camera frustum far plane. Default 2000.
       */
      const camera = new THREE.PerspectiveCamera(20, 16 / 9, 100, 300)
      const cameraHelper = new THREE.CameraHelper(camera)
      scene.add(cameraHelper)

      const gui = new GUI()
      function onChange() {
        camera.updateProjectionMatrix()
        cameraHelper.update()
      }
      gui.add(camera, 'fov', [10, 20, 30, 40]).onChange(onChange)
      gui
        .add(camera, 'aspect', {
          '1/1': 1 / 1,
          '2/1': 2 / 1,
          '4/3': 4 / 3,
          '16/9': 16 / 9,
        })
        .onChange(onChange)
      gui.add(camera, 'near', 0, 300).onChange(onChange)
      gui.add(camera, 'far', 300, 800).onChange(onChange)
    }

    const tween = new Tween(mesh.position).to({ x: 200 }, 2000).easing(Easing.Quadratic.InOut)
    const tween2 = new Tween(mesh.rotation).to({ x: Math.PI }, 2000).easing(Easing.Quadratic.InOut)
    const tween3 = new Tween(mesh.position).to({ x: 0 }, 1000).easing(Easing.Quadratic.Out)

    tween.chain(tween2)
    tween2.chain(tween3)
    tween3.chain(tween)
    tween.start()

    const group = new Group()
    group.add(tween, tween2, tween3)

    const css2Renderer = new CSS2DRenderer()
    css2Renderer.setSize(width, height)
    css2Renderer.domElement.style.position = 'absolute'
    css2Renderer.domElement.style.pointerEvents = 'none'

    const div = document.createElement('div')
    div.style.position = 'relative'
    div.appendChild(css2Renderer.domElement)

    document.body.appendChild(div)
    document.body.appendChild(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)

    function r() {
      group.update()
      css2Renderer.render(scene, camera)
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    requestAnimationFrame(r)
  }, [])
}
