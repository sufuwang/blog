'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { getSizeByScreenRatio } from '@/tools/utils'
import * as CANNON from 'cannon-es'

export default function Shadow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current
    if (c) {
      const scene = new THREE.Scene()
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
      })

      const light = new THREE.PointLight(0xffffff, 80000)
      light.position.set(0, 160, 0)
      scene.add(light)

      const axesHelper = new THREE.AxesHelper(80)
      scene.add(axesHelper)

      const { width, height } = getSizeByScreenRatio(c.clientWidth)
      c.appendChild(renderer.domElement)
      renderer.setSize(width, height)

      const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
      camera.position.set(300, 300, 0)
      camera.lookAt(0, 0, 0)

      new OrbitControls(camera, renderer.domElement)

      const world = new CANNON.World()
      world.gravity.set(0, -200, 0)

      /**
       * 平面
       */
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(300, 300),
        new THREE.MeshPhysicalMaterial({ color: 'white', side: THREE.DoubleSide })
      )
      plane.rotateX(-Math.PI / 2)
      scene.add(plane)
      // cannon 模拟
      const planeCannonMaterial = new CANNON.Material()
      const planeCannonBody = new CANNON.Body({
        mass: 0, // 创建一个无质量（mass=0）的物理平面
        material: planeCannonMaterial,
        shape: new CANNON.Plane(),
      })
      planeCannonBody.position.set(0, 0, 0)
      planeCannonBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
      world.addBody(planeCannonBody)

      /**
       * 规则球体
       */
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(16, 16, 16),
        new THREE.MeshNormalMaterial()
      )
      sphere.position.set(0, 100, 0)
      scene.add(sphere)
      // cannon 模拟
      const sphereCannonMaterial = new CANNON.Material()
      const sphereCannonBody = new CANNON.Body({
        mass: 1, // 有质量（mass=1），可参与运动模拟
        shape: new CANNON.Sphere(16),
        material: sphereCannonMaterial,
      })
      sphereCannonBody.position.set(0, 100, 0)
      world.addBody(sphereCannonBody)
      world.addContactMaterial(
        new CANNON.ContactMaterial(planeCannonMaterial, sphereCannonMaterial, {
          friction: 0.2, // 摩擦力
          restitution: 0.66, // 弹性
        })
      )

      /**
       * 不规则球体
       */
      const xSphere = new THREE.Mesh(
        new THREE.SphereGeometry(16, 5),
        new THREE.MeshNormalMaterial()
      )
      xSphere.position.set(0, 100, 40)
      scene.add(xSphere)
      // cannon 模拟
      const vertices: CANNON.Vec3[] = []
      const faces: number[][] = []
      // position 用来描述几何体中每一个顶点的三维位置, 提供物理体顶点
      const ps = xSphere.geometry.attributes.position
      for (let i = 0; i < ps.count; i++) {
        vertices.push(new CANNON.Vec3(ps.getX(i), ps.getY(i), ps.getZ(i)))
      }
      // index 是一个索引数组，告诉 WebGL 如何把顶点组成三角面, 提供三角面结构
      const index = xSphere.geometry.index! as unknown as number[]
      for (let i = 0; i < index.length; i++) {
        faces.push([index[i], index[i + 1], index[i + 2]])
      }
      const xSphereCannonMaterial = new CANNON.Material()
      const xSphereCannonBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.ConvexPolyhedron({ vertices, faces }),
        material: xSphereCannonMaterial,
      })
      xSphereCannonBody.position.set(0, 100, 40)
      world.addBody(xSphereCannonBody)
      world.addContactMaterial(
        new CANNON.ContactMaterial(planeCannonMaterial, xSphereCannonMaterial, {
          friction: 0.2, // 摩擦力
          restitution: 0.66, // 弹性
        })
      )

      function r() {
        world.fixedStep()
        if (sphere) {
          sphere.position.copy(sphereCannonBody.position)
          sphere.position.copy(sphereCannonBody.position)
          sphere.quaternion.copy(sphereCannonBody.quaternion)
        }
        if (xSphere) {
          xSphere.position.copy(xSphereCannonBody.position)
          xSphere.position.copy(xSphereCannonBody.position)
          xSphere.quaternion.copy(xSphereCannonBody.quaternion)
        }

        renderer.render(scene, camera)
        requestAnimationFrame(r)
      }
      requestAnimationFrame(r)
    }
  }, [])

  return <div ref={ref} className="relative overflow-hidden rounded-md" />
}
