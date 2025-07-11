'use client'
import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { DecalGeometry, DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons'
import { FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { FloatButton, ColorPicker } from 'antd'

export default function PrintFlower() {
  const loader = new THREE.TextureLoader()
  const texture = loader.load('/material/xiaoxin.png')
  const gltfLoader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
  gltfLoader.setDRACOLoader(dracoLoader)
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  })
  let orbitControls: OrbitControls = null

  const onColorChange = (_, color) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tshirt = scene.getObjectByName('tshirt') as unknown as any
    tshirt?.children[0].material.color.set(color)
  }
  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  const onDownloadImage = () => {
    renderer.domElement.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, 't-shirt.png')
      }
    }, 'image/png')
  }
  const onDownloadVideo = () => {
    const stream = renderer.domElement.captureStream(60)
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
    mediaRecorder.start()
    orbitControls.autoRotate = true
    orbitControls.autoRotateSpeed = 8
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        downloadBlob(event.data, 't-shirt.webm')
      }
    }
    setTimeout(() => {
      orbitControls.autoRotate = false
      orbitControls.reset()
      mediaRecorder.stop()
    }, 5000)
  }

  useEffect(() => {
    {
      gltfLoader.load('/model/tshirt/tshirt.glb', (gltf) => {
        gltf.scene.scale.setScalar(400)
        gltf.scene.name = 'tshirt'
        scene.add(gltf.scene)
      })
    }

    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(500, 400, 300)
    scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)

    // const axesHelper = new THREE.AxesHelper(200)
    // scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
    camera.position.set(0, 0, 400)
    camera.lookAt(0, 0, 0)
    renderer.setSize(width, height)

    renderer.domElement.addEventListener('click', (event) => {
      const x = (event.offsetX / width) * 2 - 1
      const y = -((event.offsetY / height) * 2 - 1)
      const r = new THREE.Raycaster()
      r.setFromCamera(new THREE.Vector2(x, y), camera)
      const is = r.intersectObjects(scene.children)
      if (is.length) {
        const { point, object } = is[0]
        const orientation = new THREE.Euler()
        const size = new THREE.Vector3(30, 30, 30)
        const geometry = new DecalGeometry(object as THREE.Mesh, point, orientation, size)
        const material = new THREE.MeshPhongMaterial({
          polygonOffset: true,
          polygonOffsetFactor: -4,
          map: texture,
          transparent: true,
        })
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
      }
    })

    document.body.appendChild(renderer.domElement)
    orbitControls = new OrbitControls(camera, renderer.domElement)

    function r() {
      orbitControls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    requestAnimationFrame(r)
    onColorChange(null, '#FFF')
  }, [])

  return (
    <div className="absolute left-2 top-2">
      <ColorPicker defaultValue="#FFF" disabledAlpha onChange={onColorChange} />
      <FloatButton.Group shape="square">
        <FloatButton icon={<FileImageOutlined />} onClick={onDownloadImage} />
        <FloatButton icon={<VideoCameraOutlined />} onClick={onDownloadVideo} />
      </FloatButton.Group>
    </div>
  )
}
