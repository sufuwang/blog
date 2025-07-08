import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { EditorStore } from '@/store/3dScene/editor'
import { MeshTypes } from '@/store/3dScene/editor'
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
import { TransformControls } from 'three/examples/jsm/Addons'

interface Controls {
  OrbitControls: typeof OrbitControls
  DragControls: DragControls
  TransformControls: TransformControls
}

let outlinePass
const controls: Partial<Controls> = {}

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
        const material = new THREE.MeshPhysicalMaterial({ color })
        const m = new THREE.Mesh(geometry, material) as unknown as Scene.Mesh
        m.position.set(position.x, position.y, position.z)
        m._id = mesh.id
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
        const material = new THREE.MeshPhysicalMaterial({ color })
        const m = new THREE.Mesh(geometry, material) as unknown as Scene.Mesh
        m.position.set(position.x, position.y, position.z)
        m._id = mesh.id
        return m
      }
      return null
    })
    .filter((mesh) => mesh !== null)
}
export const focusMesh = (scene: Scene.Mesh, id: string) => {
  const t = scene.children.find((row: Scene.Mesh) => row._id === id)
  if (t) {
    outlinePass.selectedObjects = [t]
  }
}
export const transformMesh = (scene: Scene.Mesh, id: string) => {
  const t = scene.children.find((t: Scene.Mesh) => t._id === id)
  if (t) {
    controls.TransformControls!.attach(t)
  }
}
export const disableOrbitControls = (f: boolean) => {
  controls.OrbitControls.enabled = f
}

export default function renderMain(
  dom: HTMLDivElement,
  meshes: EditorStore['meshes'],
  {
    onClickMesh,
    onChangeTransformControls,
  }: {
    onClickMesh: (mesh: THREE.Intersection) => void
    onChangeTransformControls: (mesh: Scene.Mesh) => void
  }
) {
  const scene = new THREE.Scene() as unknown as Scene.Mesh

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
  outlinePass = new OutlinePass(v, scene, camera)
  outlinePass.blendMode = THREE.AdditiveBlending
  outlinePass.debug = true
  outlinePass.edgeStrength = 6
  outlinePass.edgeThickness = 6
  outlinePass.pulsePeriod = 1
  composer.addPass(outlinePass)
  const gammaPass = new ShaderPass(GammaCorrectionShader)
  composer.addPass(gammaPass)

  controls.OrbitControls = new OrbitControls(camera, renderer.domElement)
  // controls.DragControls = new DragControls(meshes, camera, renderer.domElement)
  controls.TransformControls = new TransformControls(camera, renderer.domElement)
  const transformHelper = controls.TransformControls.getHelper()
  scene.add(transformHelper)

  controls.TransformControls.addEventListener('change', (...ds) => {
    const obj = controls.TransformControls!.object as Scene.Mesh
    if (obj) {
      onChangeTransformControls?.(obj)
    }
  })

  renderer.domElement.addEventListener('click', (e) => {
    const x = (e.offsetX / width) * 2 - 1
    const y = -(e.offsetY / height) * 2 + 1
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
    const [r] = raycaster.intersectObjects(scene.children.filter((r) => r.type === 'Mesh'))
    if (r) {
      onClickMesh?.(r)
    }
  })

  function render(time) {
    // renderer.render(scene, camera)
    composer.render()
    controls.TransformControls!.update(time)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  dom.append(renderer.domElement)

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
