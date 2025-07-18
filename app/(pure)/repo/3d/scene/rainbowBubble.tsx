import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { Reflector, RGBELoader } from 'three/examples/jsm/Addons.js'

export default function RainbowBubble() {
  useEffect(() => {
    const scene = new THREE.Scene()
    // const loader = new GLTFLoader()
    const gui = new GUI()
    const textureWidth = window.innerWidth * window.devicePixelRatio
    const textureHeight = window.innerHeight * window.devicePixelRatio

    // {
    //   const textureLoader = new THREE.CubeTextureLoader()
    //   const texture = textureLoader
    //     .setPath('/material/city/')
    //     .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
    //   scene.background = texture

    //   const geometry = new THREE.SphereGeometry(300)
    //   const material = new THREE.MeshPhysicalMaterial({
    //     color: '#fff',
    //     metalness: 0,
    //     roughness: 0,
    //     transmission: 1,
    //     envMap: texture,
    //     iridescence: 1,
    //     iridescenceIOR: 1.8,
    //     reflectivity: 1,
    //   })

    //   gui.addColor(material, 'color')
    //   gui.add(material, 'iridescence', 0, 1)
    //   gui.add(material, 'iridescenceIOR', 1, 2.33)
    //   gui.add(material, 'reflectivity', 0, 1)

    //   const mesh = new THREE.Mesh(geometry, material)
    //   scene.add(mesh)
    // }

    {
      const rgbeLoader = new RGBELoader()
      rgbeLoader.load('/material/city/san_giuseppe_bridge_2k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture

        {
          const geometry = new THREE.PlaneGeometry(1000, 1000)
          // const material = new THREE.MeshStandardMaterial({
          //   color: 'white',
          //   metalness: 1,
          //   roughness: 0,
          //   // envMap: texture,
          //   side: THREE.DoubleSide,
          //   // envMap: cubeRenderTargetA.texture,
          // })
          // const mesh = new THREE.Mesh(geometry, material)
          // mesh.position.set(0, 0, 400)
          // mesh.rotateY(Math.PI * 0.1)
          // mesh.name = 'plane'
          const mesh = new Reflector(geometry, { textureWidth, textureHeight })
          mesh.position.set(0, 0, 400)
          mesh.rotateY(Math.PI * 1.1)
          mesh.name = 'plane'
          scene.add(mesh)
        }
        {
          const geometry = new THREE.PlaneGeometry(1000, 1000)
          // const material = new THREE.MeshStandardMaterial({
          //   color: 'white',
          //   metalness: 1,
          //   roughness: 0,
          //   // envMap: texture,
          //   side: THREE.DoubleSide,
          //   // envMap: cubeRenderTargetB.texture,
          // })
          // const mesh = new THREE.Mesh(geometry, material)
          // mesh.position.set(-400, 0, 0)
          // mesh.rotateY(Math.PI * 0.4)
          // mesh.name = 'plane2'
          const mesh = new Reflector(geometry, { textureWidth, textureHeight })
          mesh.position.set(-400, 0, 0)
          mesh.rotateY(Math.PI * 0.4)
          mesh.name = 'plane2'
          scene.add(mesh)
        }
        {
          const geometry = new THREE.SphereGeometry(100)
          const material = new THREE.MeshStandardMaterial({
            color: 'green',
          })
          const mesh = new THREE.Mesh(geometry, material)
          mesh.name = 'sphere'
          scene.add(mesh)
        }

        const geometry = new THREE.SphereGeometry(300)
        const material = new THREE.MeshPhysicalMaterial({
          color: '#fff',
          metalness: 0,
          roughness: 0,
          transmission: 1,
          envMap: texture,
          iridescence: 1,
          iridescenceIOR: 1.8,
          reflectivity: 1,
        })
        gui.addColor(material, 'color')
        gui.add(material, 'iridescence', 0, 1)
        gui.add(material, 'iridescenceIOR', 1, 2.33)
        gui.add(material, 'reflectivity', 0, 1)
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(0, 1600, 0)
        scene.add(mesh)
      })
    }

    const directionLight = new THREE.DirectionalLight(0xffffff, 2)
    directionLight.position.set(500, 400, 300)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const width = window.innerWidth
    const height = window.innerHeight

    const helper = new THREE.AxesHelper(500)
    scene.add(helper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(1200, 1200, 1200)
    camera.lookAt(0, 0, 0)

    const axesHelper = new THREE.AxesHelper(20)
    scene.add(axesHelper)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    renderer.setSize(width, height)

    // const cubeRenderTargetA = new THREE.WebGLCubeRenderTarget(512)
    // const cubeCameraA = new THREE.CubeCamera(1, 1000, cubeRenderTargetA)
    // const cubeRenderTargetB = new THREE.WebGLCubeRenderTarget(512)
    // const cubeCameraB = new THREE.CubeCamera(1, 1000, cubeRenderTargetB)

    const render = () => {
      // const plane = scene.getObjectByName('plane')
      // if (plane) {
      //   cubeCameraA.position.copy(plane.position)
      // }
      // const plane2 = scene.getObjectByName('plane2')
      // if (plane2) {
      //   cubeCameraB.position.copy(plane2.position)
      // }
      // cubeCameraA.update(renderer, scene)
      // cubeCameraB.update(renderer, scene)

      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
