'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { createNoise2D } from 'simplex-noise'
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export default function SnowyForest() {
  useEffect(() => {
    const scene = new THREE.Scene()
    const snow = new THREE.Group()
    {
      const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100)
      const noise2D = createNoise2D()
      const positions = geometry.attributes.position
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        const z = noise2D(x / 800, y / 800) * 50
        positions.setZ(i, z)
      }
      const heightArr: Array<number> = []
      for (let i = 0; i < positions.count; i++) {
        heightArr.push(positions.getZ(i))
      }
      heightArr.sort()
      const minHeight = heightArr[0]
      const maxHeight = heightArr[heightArr.length - 1]
      const height = maxHeight - minHeight
      const colorsArr: Array<number> = []
      const color1 = new THREE.Color('#eee')
      const color2 = new THREE.Color('white')
      for (let i = 0; i < positions.count; i++) {
        const percent = (positions.getZ(i) - minHeight) / height
        const c = color1.clone().lerp(color2, percent)
        colorsArr.push(c.r, c.g, c.b)
      }
      const colors = new Float32Array(colorsArr)
      geometry.attributes.color = new THREE.BufferAttribute(colors, 3)
      const material = new THREE.MeshLambertMaterial({
        vertexColors: true,
      })
      const mountainside = new THREE.Mesh(geometry, material)
      mountainside.rotateX(-Math.PI / 2)
      mountainside.receiveShadow = true
      mountainside.castShadow = true
      scene.add(mountainside)
      const loader = new GLTFLoader()
      loader.load('/model/tree/tree.gltf', (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        gltf.scene.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true
            if (obj.name === 'leaves001') {
              obj.material.color.set('green')
            } else {
              obj.material.color.set('brown')
            }
          }
        })
        let i = 0
        while (i < positions.count) {
          const newTree = gltf.scene.clone()
          newTree.position.x = positions.getX(i)
          newTree.position.y = positions.getY(i)
          newTree.position.z = positions.getZ(i)
          mountainside.add(newTree)
          newTree.rotateX(Math.PI / 2)
          i += Math.floor(300 * Math.random())
        }
      })
    }
    {
      const loader = new THREE.TextureLoader()
      const texture = loader.load('/material/snow.png')
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
      })
      for (let i = 0; i < 6000; i++) {
        const sprite = new THREE.Sprite(spriteMaterial)
        sprite.scale.set(5, 5, 5)
        sprite.position.set(
          -1500 + 3000 * Math.random(),
          1000 * Math.random(),
          -1500 + 3000 * Math.random()
        )
        snow.add(sprite)
      }
      scene.add(snow)
    }

    const directionLight = new THREE.DirectionalLight(0xffffff, 5)
    directionLight.position.set(1000, 1000, 1000)
    directionLight.castShadow = true
    directionLight.shadow.camera.left = -2000
    directionLight.shadow.camera.right = 2000
    directionLight.shadow.camera.top = 2000
    directionLight.shadow.camera.bottom = -2000
    directionLight.shadow.camera.near = 100
    directionLight.shadow.camera.far = 10000
    scene.add(directionLight)

    // const cameraHelper = new THREE.CameraHelper(directionLight.shadow.camera)
    // scene.add(cameraHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 100, 10000)
    camera.position.set(300, 300, 500)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)
    renderer.setClearColor(new THREE.Color('darkblue'))
    renderer.shadowMap.enabled = true

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.autoRotate = true
    orbitControls.autoRotateSpeed = 6
    orbitControls.enableDamping = true
    orbitControls.enableZoom = false

    const clock = new THREE.Clock()
    function render() {
      const delta = clock.getDelta()
      snow.children.forEach((sprite) => {
        sprite.position.y -= delta * 30
        if (sprite.position.y < 0) {
          sprite.position.y = 1000
        }
      })
      orbitControls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()
    document.body.append(renderer.domElement)
  }, [])
}
