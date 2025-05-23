'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'

export default function RepoPage() {
  useEffect(() => {
    const scene = new THREE.Scene()

    const loader = new THREE.TextureLoader()
    const texture = loader.load('/material/snow.png')
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
    })
    const group = new THREE.Group()
    for (let i = 0; i < 20000; i++) {
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.set(1000 * Math.random(), 1000 * Math.random(), 1000 * Math.random())
      group.add(sprite)
    }
    scene.add(group)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    const clock = new THREE.Clock()
    function render() {
      const delta = clock.getDelta()
      group.children.forEach((sprite) => {
        sprite.position.y -= delta * 20
        if (sprite.position.y < 0) {
          sprite.position.y = 1000
        }
      })
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
