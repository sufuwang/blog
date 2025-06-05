'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
import SpriteText from 'three-spritetext'
import { Tween, Easing, Group } from '@tweenjs/tween.js'

export default function DigitalRain() {
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer()

  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    const columns: SpriteText[][] = []

    {
      const columnWidth = 50
      const columnNum = Math.floor(width / columnWidth)

      const fontSize = 30
      const lineHeight = fontSize * 1.3

      const textNumOfColumn = Math.ceil((height * 2) / lineHeight)

      const group = new THREE.Group()
      for (let i = 0; i < columnNum; i++) {
        const column: SpriteText[] = []
        for (let j = 0; j < textNumOfColumn; j++) {
          const text = Math.floor(Math.random() * 10) + ''
          const spriteText = new SpriteText(text, 20, 'green')
          spriteText.position.set(i * columnWidth, j * lineHeight + Math.random() * 40, 0)
          spriteText.strokeColor = 'lightgreen'
          spriteText.strokeWidth = 1
          spriteText.material.opacity = Math.random() * 0.5 + 0.5
          group.add(spriteText)
          column.push(spriteText)
        }
        columns.push(column)
      }
      scene.add(group)
    }

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(500)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
    camera.position.set(width / 2, height / 2, 500)
    camera.lookAt(width / 2, height / 2, 0)
    renderer.setSize(width, height)

    document.body.appendChild(renderer.domElement)
    // new OrbitControls(camera, renderer.domElement)

    const group = new Group()
    const animate = () => {
      columns.forEach((column) => {
        column.forEach((item) => {
          if (item.position.y < 0) {
            item.position.y = height
          } else {
            const tween = new Tween(item.position)
              .to({ ...item.position, y: item.position.y - Math.random() * 10 }, 40)
              .easing(Easing.Quadratic.Out)
              .repeat(0)
              .start()
              .onComplete(() => {
                group.remove(tween)
              })
            group.add(tween)
          }
        })
      })
    }

    function r() {
      group.update()
      animate()
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    requestAnimationFrame(r)
  }, [])
}
