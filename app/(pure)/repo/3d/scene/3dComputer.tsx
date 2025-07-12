import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect, useRef } from 'react'
import { CSS3DObject, CSS3DRenderer, GLTFLoader } from 'three/examples/jsm/Addons'
import Image from 'next/image'

export default function Computer3D() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const loader = new GLTFLoader()

    {
      loader.load('/model/computer-desk/scene.gltf', (gltf) => {
        gltf.scene.scale.set(80, 80, 80)
        gltf.scene.traverse((obj) => {
          obj.receiveShadow = true
        })
        scene.add(gltf.scene)
      })
    }
    {
      loader.load('/model/computer-monitor/scene.gltf', (gltf) => {
        gltf.scene.scale.set(100, 100, 100)
        gltf.scene.rotateY(-Math.PI / 2)
        gltf.scene.position.set(0, 4, 0)
        gltf.scene.traverse((obj: THREE.Mesh) => {
          obj.castShadow = true
          if (obj.type === 'Mesh' && obj.name === 'Object_5') {
            // const axesHelper = new THREE.AxesHelper(500)
            // obj.add(axesHelper)

            const css3dObj = new CSS3DObject(ref.current!)
            css3dObj.scale.set(0.1, 0.1, 0.1)
            css3dObj.rotateX(-Math.PI / 2)
            css3dObj.rotateZ(Math.PI / 2)
            css3dObj.position.y = 2
            css3dObj.position.x = -0.16
            obj.add(css3dObj)
          }
        })
        scene.add(gltf.scene)
      })
    }

    const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
    directionalLight.position.set(0, 1400, 0)
    directionalLight.lookAt(0, 0, 0)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.left = -200
    directionalLight.shadow.camera.right = 200
    directionalLight.shadow.camera.top = 100
    directionalLight.shadow.camera.bottom = -100
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 1500
    scene.add(directionalLight)

    // const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    // scene.add(directionalLightCameraHelper)

    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
    camera.position.set(0, 0, 800)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    renderer.setSize(width, height)
    renderer.setClearColor('lightblue')
    renderer.shadowMap.enabled = true

    const css3Renderer = new CSS3DRenderer()
    css3Renderer.setSize(width, height)
    css3Renderer.domElement.style.position = 'absolute'
    css3Renderer.domElement.style.left = '0px'
    css3Renderer.domElement.style.top = '0px'
    css3Renderer.domElement.style.pointerEvents = 'none'

    const div = document.createElement('div')
    div.style.position = 'relative'
    div.appendChild(css3Renderer.domElement)
    document.body.appendChild(div)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true

    function render(time = 0) {
      css3Renderer.render(scene, camera)
      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()

    document.body.append(renderer.domElement)

    window.onresize = function () {
      const width = window.innerWidth
      const height = window.innerHeight

      renderer.setSize(width, height)

      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{ backfaceVisibility: 'hidden', display: 'none' }}
      className="flex h-[60px] w-[110px] justify-center"
    >
      <Image src="/static/images/avatar.png" width="60" height="100" alt="" className="m-0" />
    </div>
  )
}
