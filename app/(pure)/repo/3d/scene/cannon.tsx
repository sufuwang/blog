import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'

export default function Cannon() {
  useEffect(() => {
    const scene = new THREE.Scene()

    const world = new CANNON.World()
    // world.gravity.set(0, -9.82, 0)
    world.gravity.set(0, -200, 0)

    {
      const box = new THREE.BoxGeometry(50, 50, 50)
      const material = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(box, material)
      mesh.position.set(0, 300, 0)
      mesh.name = 'box'
      scene.add(mesh)
    }
    const boxMaterial = new CANNON.Material()
    const boxBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(25, 25, 25)),
      material: boxMaterial,
    })
    boxBody.position.set(0, 300, 0)
    world.addBody(boxBody)

    {
      const x = new THREE.SphereGeometry(30)
      const y = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(x, y)
      mesh.position.set(200, 300, 0)
      mesh.name = 'sphere'
      scene.add(mesh)
    }
    const sphereMaterial = new CANNON.Material()
    const sphereBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(30),
      material: sphereMaterial,
    })
    sphereBody.position.set(200, 300, 0)
    world.addBody(sphereBody)

    const vertices: CANNON.Vec3[] = []
    const faces: number[][] = []
    {
      const x = new THREE.SphereGeometry(30, 3)
      const y = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(x, y)
      mesh.position.set(-200, 300, 0)
      mesh.name = 'xSphere'
      scene.add(mesh)

      const ps = mesh.geometry.attributes.position
      for (let i = 0; i < ps.count; i++) {
        vertices.push(new CANNON.Vec3(ps.getX(i), ps.getY(i), ps.getZ(i)))
      }
      const index = mesh.geometry.index! as unknown as number[]
      for (let i = 0; i < index.length; i++) {
        faces.push([index[i], index[i + 1], index[i + 2]])
      }
    }
    const xSphereMaterial = new CANNON.Material()
    const xSphereBody = new CANNON.Body({
      mass: 1,
      // shape: new CANNON.Sphere(30),
      shape: new CANNON.ConvexPolyhedron({ vertices, faces }),
      material: xSphereMaterial,
    })
    xSphereBody.position.set(-200, 300, 0)
    world.addBody(xSphereBody)

    {
      const plane = new THREE.PlaneGeometry(1000, 1000)
      const material = new THREE.MeshStandardMaterial({
        color: 0x808080,
        side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(plane, material)
      mesh.rotateX(-Math.PI / 2)
      scene.add(mesh)
    }
    {
      const shape = new CANNON.Plane()
      const planeMaterial = new CANNON.Material()
      const planeBody = new CANNON.Body({
        mass: 0,
        material: planeMaterial,
        shape,
      })
      planeBody.position.set(0, 0, 0)
      planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
      world.addBody(planeBody)

      world.addContactMaterial(
        new CANNON.ContactMaterial(planeMaterial, boxMaterial, {
          friction: 0.2, // 摩擦力
          restitution: 0.6, // 弹性
        })
      )
      world.addContactMaterial(
        new CANNON.ContactMaterial(planeMaterial, sphereMaterial, {
          friction: 0.2, // 摩擦力
          restitution: 0.6, // 弹性
        })
      )
      world.addContactMaterial(
        new CANNON.ContactMaterial(planeMaterial, xSphereMaterial, {
          friction: 0.2, // 摩擦力
          restitution: 0.6, // 弹性
        })
      )
    }

    const directionLight = new THREE.DirectionalLight(0xffffff)
    directionLight.position.set(500, 600, 800)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const helper = new THREE.AxesHelper(1000)
    scene.add(helper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(500, 600, 800)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    renderer.setSize(width, height)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true

    function render() {
      world.fixedStep()

      const box = scene.getObjectByName('box')
      if (box) {
        box.position.copy(boxBody.position)
        box.position.copy(boxBody.position)
        box.quaternion.copy(boxBody.quaternion)
      }
      const sphere = scene.getObjectByName('sphere')
      if (sphere) {
        sphere.position.copy(sphereBody.position)
        sphere.position.copy(sphereBody.position)
        sphere.quaternion.copy(sphereBody.quaternion)
      }
      const xSphere = scene.getObjectByName('xSphere')
      if (xSphere) {
        xSphere.position.copy(xSphereBody.position)
        xSphere.position.copy(xSphereBody.position)
        xSphere.quaternion.copy(xSphereBody.quaternion)
      }

      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()

    document.body.append(renderer.domElement)
  }, [])
}
