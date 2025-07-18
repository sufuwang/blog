import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
// @ts-ignore
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
// @ts-ignore
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
// @ts-ignore
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
// @ts-ignore
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js'
// @ts-ignore
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js'
// @ts-ignore
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js'
// @ts-ignore
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
// @ts-ignore
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js'

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

export default function Raycaster() {
  useEffect(() => {
    const scene = new THREE.Scene()

    const width = window.innerWidth
    const height = window.innerHeight
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    const camera = new THREE.PerspectiveCamera(100, width / height, 1, 5000)
    camera.position.set(400, 400, 400)
    camera.lookAt(0, 0, 0)

    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const v = new THREE.Vector2(window.innerWidth, window.innerWidth)

    const outlinePass = new OutlinePass(v, scene, camera)
    outlinePass.visibleEdgeColor.set('orange')
    outlinePass.edgeStrength = 10
    outlinePass.edgeThickness = 10
    outlinePass.pulsePeriod = 1
    composer.addPass(outlinePass)

    const bloomPass = new UnrealBloomPass(v)
    bloomPass.strength = 0.5
    composer.addPass(bloomPass)

    const afterimagePass = new AfterimagePass()
    composer.addPass(afterimagePass)

    const filmPass = new FilmPass(0.5, false)
    composer.addPass(filmPass)

    const pixelRatio = renderer.getPixelRatio()
    const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio)
    composer.addPass(smaaPass)

    // const gammaPass = new ShaderPass(GammaCorrectionShader)
    // composer.addPass(gammaPass)

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

        if (intersections.length) {
          outlinePass.selectedObjects = [intersections[0].object]
          if (!composer.passes.includes(bloomPass)) {
            composer.addPass(bloomPass)
          }
        } else {
          outlinePass.selectedObjects = []
          composer.removePass(bloomPass)
        }

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

    function render() {
      // renderer.render(scene, camera)
      composer.render()
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
