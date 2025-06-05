import * as THREE from 'three'
// @ts-ignore
import { useEffect } from 'react'
import { DragControls, TransformControls } from 'three/examples/jsm/Addons'

interface Event {
  object: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial, THREE.Object3DEventMap>
}

export default function Curve() {
  useEffect(() => {
    const scene = new THREE.Scene()

    {
      const planeGeometry = new THREE.PlaneGeometry(2400, 2400)
      const planeMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color('skyblue'),
      })
      const plane = new THREE.Mesh(planeGeometry, planeMaterial)
      plane.rotateX(-Math.PI / 2)
      plane.position.y = -60
      scene.add(plane)

      const boxGeometry = new THREE.BoxGeometry(100, 100, 100)
      const boxMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color('orange'),
      })
      const box = new THREE.Mesh(boxGeometry, boxMaterial)
      box.name = 'box'
      scene.add(box)

      const box2 = box.clone()
      box2.position.x = 800
      box2.material = box.material.clone()
      box2.name = 'box2'
      scene.add(box2)

      const box3 = box.clone()
      box3.position.x = -800
      box3.material = box.material.clone()
      box3.name = 'box3'
      scene.add(box3)

      const box4 = box.clone()
      box4.position.z = 800
      box4.material = box.material.clone()
      box4.name = 'box4'
      scene.add(box4)
    }

    const directionLight = new THREE.DirectionalLight(0xffffff, 2)
    directionLight.position.set(500, 400, 300)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const width = window.innerWidth
    const height = window.innerHeight

    const helper = new THREE.AxesHelper(1000)
    scene.add(helper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(-1200, 1200, 1200)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    // const flyControls = new FlyControls(camera, renderer.domElement)
    // const flyControls = new FirstPersonControls(camera, renderer.domElement)
    // flyControls.movementSpeed = 400
    // flyControls.rollSpeed = Math.PI / 10

    // const clock = new THREE.Clock()
    function render() {
      // flyControls.update(clock.getDelta())
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)

    {
      // const orbitControls = new OrbitControls(camera, renderer.domElement)
      // orbitControls.enableDamping = true
      // new MapControls(camera, renderer.domElement)
    }
    {
      const dragControls = new DragControls(
        [scene.getObjectByName('box')!],
        camera,
        renderer.domElement
      )
      dragControls.addEventListener('dragstart', function (event) {
        ;(event as unknown as Event).object.material.color.set('lightgreen')
        ;(event as unknown as Event).object.material.wireframe = false
      })
      dragControls.addEventListener('dragend', function (event) {
        ;(event as unknown as Event).object.material.color.set('orange')
      })
      dragControls.addEventListener('hoveron', function (event) {
        ;(event as unknown as Event).object.material.wireframe = true
      })
      dragControls.addEventListener('hoveroff', function (event) {
        ;(event as unknown as Event).object.material.wireframe = false
      })
    }
    {
      const transformControls = new TransformControls(camera, renderer.domElement)
      transformControls.attach(scene.getObjectByName('box2')!)
      scene.add(transformControls.getHelper())
    }
    {
      const transformControls = new TransformControls(camera, renderer.domElement)
      transformControls.attach(scene.getObjectByName('box3')!)
      transformControls.setMode('scale')
      scene.add(transformControls.getHelper())
    }
    {
      const transformControls = new TransformControls(camera, renderer.domElement)
      transformControls.attach(scene.getObjectByName('box4')!)
      transformControls.setMode('rotate')
      scene.add(transformControls.getHelper())
    }
  }, [])
}
