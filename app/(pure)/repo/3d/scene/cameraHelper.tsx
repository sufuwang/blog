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

    document.body.appendChild(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)

    function r() {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    requestAnimationFrame(r)
  }, [])
}
