'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'

export default function Material() {
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer()

  useEffect(() => {
    // const boxGeometry = new THREE.BoxGeometry(100, 100, 100)
    // const geometry = new THREE.EdgesGeometry(boxGeometry)
    // const material = new THREE.LineDashedMaterial({
    //   color: new THREE.Color('orange'),
    //   dashSize: 10,
    //   gapSize: 10,
    //   transparent: true,
    //   opacity: 0.4,
    // })
    // const line = new THREE.Line(geometry, material)
    // line.computeLineDistances()
    // scene.add(line)

    {
      const loader = new THREE.TextureLoader()
      const texture = loader.load('/material/zhuan.jpg')
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(3, 3)
      texture.colorSpace = THREE.SRGBColorSpace

      const geometry = new THREE.BoxGeometry(400, 400, 400)

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        aoMap: texture,
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
    }

    const pointLight = new THREE.PointLight(0xffffff, 10000)
    pointLight.position.set(80, 80, 80)
    scene.add(pointLight)

    const axesHelper = new THREE.AxesHelper(600)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
    camera.position.set(90, 230, 1175)
    camera.lookAt(0, 0, 0)

    renderer.setSize(width, height)

    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
  }, [])
}
