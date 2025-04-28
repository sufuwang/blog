import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

export default function House() {
  const getTexture = (name = 'zhuan.jpg') => {
    const loader = new THREE.TextureLoader()
    const texture = loader.load(`/material/${name}`)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.x = 2
    return texture
  }

  useEffect(() => {
    const scene = new THREE.Scene()
    const house = new THREE.Group()

    {
      const geometry = new THREE.BoxGeometry(4000, 300, 3000)
      const texture = getTexture('floor.png')
      // texture.repeat.x = 0.0005
      // texture.repeat.y = 0.0005
      const material = new THREE.MeshLambertMaterial({
        // color: new THREE.Color('grey'),
        map: texture,
        aoMap: texture,
      })
      const foundation = new THREE.Mesh(geometry, material)
      foundation.translateY(10)
      house.add(foundation)
    }
    {
      const shape = new THREE.Shape()
      shape.moveTo(0, 0)
      shape.lineTo(0, 2000)
      shape.lineTo(-1500, 3000)
      shape.lineTo(-3000, 2000)
      shape.lineTo(-3000, 0)
      const windowPath = new THREE.Path()
      windowPath.moveTo(-600, 400)
      windowPath.lineTo(-600, 1600)
      windowPath.lineTo(-2400, 1600)
      windowPath.lineTo(-2400, 400)
      shape.holes.push(windowPath)
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 100,
      })
      const texture = getTexture()
      texture.repeat.x = 0.0005
      texture.repeat.y = 0.0005
      const material = new THREE.MeshLambertMaterial({
        // color: new THREE.Color('lightgrey'),
        map: texture,
        aoMap: texture,
      })
      const sideWall = new THREE.Mesh(geometry, material)
      const sideWall2 = sideWall.clone()
      sideWall.rotateY(Math.PI / 2)
      sideWall.translateZ(-2000)
      sideWall.translateX(1500)
      sideWall.translateY(150)
      sideWall2.rotateY(Math.PI / 2)
      sideWall2.translateZ(1900)
      sideWall2.translateX(1500)
      sideWall2.translateY(150)
      house.add(sideWall, sideWall2)
    }
    {
      const geometry = new THREE.BoxGeometry(4000, 2000, 100)
      const texture = getTexture()
      const material = new THREE.MeshLambertMaterial({
        // color: new THREE.Color('lightgrey'),
        map: texture,
        aoMap: texture,
      })
      const behindWall = new THREE.Mesh(geometry, material)
      behindWall.translateY(1150)
      behindWall.translateZ(-1450)
      house.add(behindWall)
    }
    {
      const shape = new THREE.Shape()
      shape.moveTo(0, 0)
      shape.lineTo(4000, 0)
      shape.lineTo(4000, 2000)
      shape.lineTo(0, 2000)
      const door = new THREE.Path()
      door.moveTo(1000, 0)
      door.lineTo(2000, 0)
      door.lineTo(2000, 1500)
      door.lineTo(1000, 1500)
      shape.holes.push(door)
      const win = new THREE.Path()
      win.moveTo(2500, 500)
      win.lineTo(3500, 500)
      win.lineTo(3500, 1500)
      win.lineTo(2500, 1500)
      shape.holes.push(win)
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 100,
      })
      const texture = getTexture()
      texture.repeat.x = 0.0005
      texture.repeat.y = 0.0005
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color('lightgrey'),
        map: texture,
        aoMap: texture,
      })
      const frontWall = new THREE.Mesh(geometry, material)
      frontWall.translateX(-2000)
      frontWall.translateZ(1400)
      frontWall.translateY(150)
      house.add(frontWall)
    }
    {
      const geometry = new THREE.BoxGeometry(4200, 2000, 100)
      const texture = getTexture('wapian.png')
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color('white'),
        map: texture,
        aoMap: texture,
      })
      const roof = new THREE.Mesh(geometry, material)
      roof.rotation.x = (55 / 180) * Math.PI
      roof.position.y = 2600
      roof.position.z = -800
      house.add(roof)
      const roof2 = roof.clone()
      roof2.rotateX((70 / 180) * Math.PI)
      roof2.position.z = -roof.position.z
      house.add(roof2)
    }
    {
      const shape = new THREE.Shape()
      shape.moveTo(0, 0)
      shape.lineTo(200, 0)
      shape.lineTo(200, -100)
      shape.lineTo(400, -100)
      shape.lineTo(400, -200)
      shape.lineTo(600, -200)
      shape.lineTo(600, -300)
      shape.lineTo(0, -300)
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 1000,
      })
      const texture = getTexture('floor.png')
      texture.repeat.x = 0.0005
      texture.repeat.y = 0.0005
      const material = new THREE.MeshLambertMaterial({
        // color: new THREE.Color('white'),
        map: texture,
        aoMap: texture,
      })
      const doorstep = new THREE.Mesh(geometry, material)
      doorstep.rotateY(-Math.PI / 2)
      doorstep.position.z = 1500
      doorstep.position.y = 150
      house.add(doorstep)
    }
    {
      const geometry = new THREE.PlaneGeometry(100000, 100000)
      const texture = getTexture('grass.png')
      texture.repeat.x = 20
      texture.repeat.y = 20
      const material = new THREE.MeshLambertMaterial({
        // color: new THREE.Color('green'),
        side: THREE.DoubleSide,
        map: texture,
        aoMap: texture,
      })
      const grass = new THREE.Mesh(geometry, material)
      grass.rotateX(-Math.PI / 2)
      grass.position.y = -160
      house.add(grass)
    }

    scene.add(house)
    // scene.fog = new THREE.Fog('skyblue', 8000, 10000)
    scene.fog = new THREE.FogExp2('skyblue', 0.0001)

    const directionLight = new THREE.DirectionalLight(0xffffff)
    directionLight.position.set(3000, 3000, 3000)
    scene.add(directionLight)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    // const axesHelper = new THREE.AxesHelper(20000)
    // scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(90, width / height, 1, 10000)
    camera.position.set(3000, 3000, 3000)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true,
    })
    renderer.setSize(width, height)
    renderer.setClearColor('skyblue')

    let angle = 0
    let yAngle = 0
    camera.position.y = 0
    function render() {
      angle += 0.005
      camera.position.x = 5000 * Math.sin(angle)
      camera.position.z = 5000 * Math.cos(angle)
      if (angle > Math.PI * 2) {
        angle = 0
        yAngle += 0.1
        camera.position.y = 5000 * Math.sin(yAngle)
      }
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    document.body.append(renderer.domElement)
    new OrbitControls(camera, renderer.domElement)
  }, [])
}
