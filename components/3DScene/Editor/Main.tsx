import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { EditorStore } from '@/store/3dScene/editor'
import { MeshTypes, useEditorStore } from '@/store/3dScene/editor'
// @ts-ignore
import { DragControls } from 'three/addons/controls/DragControls.js'
// @ts-ignore
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
// @ts-ignore
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
// @ts-ignore
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
// @ts-ignore
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
// @ts-ignore
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js'

const getSize = (dom: HTMLDivElement) => {
  return { width: dom.clientWidth, height: window.innerHeight }
}

export const createMesh = (meshes: EditorStore['meshes']) => {
  return meshes
    .map((mesh) => {
      if (mesh.type === MeshTypes.Box) {
        const {
          width,
          height,
          depth,
          material: { color },
          position,
        } = mesh.props
        const geometry = new THREE.BoxGeometry(width, height, depth)
        const material = new THREE.MeshPhongMaterial({ color })
        const m = new THREE.Mesh(geometry, material)
        m.position.set(position.x, position.y, position.z)
        return m
      } else if (mesh.type === MeshTypes.Cylinder) {
        const {
          radiusTop,
          radiusBottom,
          height,
          material: { color },
          position,
        } = mesh.props
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height)
        const material = new THREE.MeshPhongMaterial({ color })
        const m = new THREE.Mesh(geometry, material)
        m.position.set(position.x, position.y, position.z)
        return m
      }
      return null
    })
    .filter((mesh) => mesh !== null)
}

export default function renderMain(dom: HTMLDivElement, meshes: EditorStore['meshes']) {
  const scene = new THREE.Scene()

  scene.add(...createMesh(meshes))

  const axesHelper = new THREE.AxesHelper(500)
  scene.add(axesHelper)

  const gridHelper = new THREE.GridHelper(1000)
  scene.add(gridHelper)

  const directionalLight = new THREE.DirectionalLight(0xffffff)
  directionalLight.position.set(500, 400, 300)
  scene.add(directionalLight)

  const ambientLight = new THREE.AmbientLight(0xffffff)
  scene.add(ambientLight)

  const { width, height } = getSize(dom)

  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
  camera.position.set(500, 500, 500)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)

  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  const v = new THREE.Vector2(width, height)
  const outlinePass = new OutlinePass(v, scene, camera)
  outlinePass.edgeStrength = 6
  outlinePass.edgeThickness = 6
  outlinePass.pulsePeriod = 1
  composer.addPass(outlinePass)
  const gammaPass = new ShaderPass(GammaCorrectionShader)
  composer.addPass(gammaPass)

  renderer.domElement.addEventListener('click', (e) => {
    const x = (e.offsetX / width) * 2 - 1
    const y = -(e.offsetY / height) * 2 + 1
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
    const intersectObjects = raycaster.intersectObjects(
      scene.children.filter((r) => r.type === 'Mesh')
    )
    outlinePass.selectedObjects = intersectObjects.length
      ? intersectObjects.map((r) => r.object)
      : []
  })

  function render(time) {
    // renderer.render(scene, camera)
    composer.render()
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  dom.append(renderer.domElement)
  const controls = new OrbitControls(camera, renderer.domElement)
  // const dragControls = new DragControls(meshes, camera, renderer.domElement)

  const onResize = (width) => {
    const { width: w, height } = getSize(dom)
    renderer.setSize(width ?? w, height)
    camera.aspect = width ?? w / height
    camera.updateProjectionMatrix()
  }

  window.onresize = onResize

  return {
    scene,
    onResize,
    createDragControls() {
      return new DragControls(meshes, camera, renderer.domElement)
    },
  }
}
