import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useEffect } from 'react'

export default function VectorDotProduct() {
  useEffect(() => {
    const scene = new THREE.Scene()
    const group = new THREE.Group()

    const width = window.innerWidth
    const height = window.innerHeight

    const origin = new THREE.Vector3(0, 0, 0)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(500, 500, 500)
    camera.lookAt(0, 0, 0)

    {
      for (let i = 0; i < 4; i++) {
        const box = new THREE.BoxGeometry(500, 300, 20)
        const material = new THREE.MeshBasicMaterial({
          color: 'gray',
        })
        const mesh = new THREE.Mesh(box, material)
        mesh.rotateY((Math.PI / 2) * i)
        group.add(mesh)
      }

      const vectorA = new THREE.Vector3(0, 0, 250)
      group.children[0].position.copy(vectorA)
      scene.add(new THREE.ArrowHelper(vectorA, origin, 500, 'red'))

      const vectorB = new THREE.Vector3(250, 0, 0)
      group.children[1].position.copy(vectorB)
      scene.add(new THREE.ArrowHelper(vectorB, origin, 500, 'red'))

      const vectorC = new THREE.Vector3(0, 0, -250)
      group.children[2].position.copy(vectorC)
      scene.add(new THREE.ArrowHelper(vectorC, origin, 500, 'red'))

      const vectorD = new THREE.Vector3(-250, 0, 0)
      group.children[3].position.copy(vectorD)
      scene.add(new THREE.ArrowHelper(vectorD, origin, 500, 'red'))

      scene.add(group)
    }

    const directionLight = new THREE.DirectionalLight(0xffffff, 2)
    directionLight.position.set(500, 400, 300)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    renderer.setSize(width, height)

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.autoRotate = true

    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)

      group.children.forEach((mesh) => {
        const pos = mesh.position
        const vector = new THREE.Vector3(pos.x, pos.y, pos.z)
        const dotProduct = vector.dot(camera.getWorldDirection(new THREE.Vector3()))
        mesh.visible = dotProduct > 0
      })

      orbitControls.update()
    }

    render()

    document.body.append(renderer.domElement)
  }, [])

  return <div></div>
}
