import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { useEffect } from 'react'

type T = THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial, THREE.Object3DEventMap> & {
  _id: string
}

const Color = {}
const generateBox = (colorStr, x, y, z) => {
  const geometry = new THREE.BoxGeometry(100, 100, 100)
  const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(colorStr),
  })
  const box = new THREE.Mesh(geometry, material) as T
  box.position.set(x, y, z)

  const id = parseInt((Math.random() * 10000).toString()).toString()
  Color[id] = colorStr
  box._id = id

  return box
}

export default function InfiniteTube() {
  useEffect(() => {
    const scene = new THREE.Scene()

    const width = window.innerWidth
    const height = window.innerHeight
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    {
      const group = new THREE.Group()
      const box = generateBox('blue', 0, 0, 0)
      const box2 = generateBox('green', 0, 0, 300)
      const box3 = generateBox('red', 300, 0, 0)
      group.add(box, box2, box3)
      scene.add(group)

      renderer.domElement.addEventListener('click', (e) => {
        const x = (e.offsetX / width) * 2 - 1
        const y = -((e.offsetY / height) * 2 - 1)

        const rayCaster = new THREE.Raycaster()
        rayCaster.setFromCamera(new THREE.Vector2(x, y), camera)

        const intersections = rayCaster.intersectObjects(group.children) as unknown as {
          object: T
        }[]
        intersections.forEach((item) => {
          const orange = new THREE.Color('orange')
          if (item.object.material.color.equals(orange)) {
            item.object.material.color.set(Color[item.object._id])
          } else {
            item.object.material.color.set('orange')
          }
        })

        {
          const { x, y, z } = camera.position
          if (
            intersections.length &&
            Math.round(x) === 400 &&
            Math.round(y) === 400 &&
            Math.round(z) === 400
          ) {
            const arrowHelper = new THREE.ArrowHelper(
              rayCaster.ray.direction,
              rayCaster.ray.origin,
              3000
            )
            scene.add(arrowHelper)
          }
        }
      })
    }

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const axesHelper = new THREE.AxesHelper(400)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 5000)
    camera.position.set(400, 400, 400)
    camera.lookAt(0, 0, 0)

    function render() {
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
