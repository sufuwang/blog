'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { getSizeByScreenRatio } from '@/tools/utils'
import { OrbitControls, RGBELoader, GLTFLoader, DRACOLoader } from 'three/examples/jsm/Addons'
// @ts-ignore
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

export default function LoadResource() {
  const items: TabsProps['items'] = [
    {
      label: '贴图加载器',
      children: <TextureLoader />,
    },
    {
      label: '立方体贴图加载器',
      children: <CubeTextureLoader />,
    },
    {
      label: 'HDR 环境贴图',
      children: <TRGBELoader />,
    },
    {
      label: 'GLTF 模型加载器',
      children: <TGLTFLoader />,
    },
    {
      label: '音频加载器',
      children: <AudioLoader />,
    },
  ].map((row) => ({ ...row, key: row.label }))

  return <Tabs defaultActiveKey="贴图加载器	" items={items} />
}

const TextureLoader = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!
    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    renderer.setClearColor('lightblue')

    const axesHelper = new THREE.AxesHelper(60)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)

    const light = new THREE.AmbientLight(0xffffff, 100000)
    scene.add(light)

    const loader = new THREE.TextureLoader()
    const texture = loader.load('/static/images/heart.png')

    const boxGeo = new THREE.BoxGeometry(60, 60, 60)
    const material = new THREE.MeshStandardMaterial({
      color: 'rgb(180,180,180)',
      map: texture,
    })
    scene.add(new THREE.Mesh(boxGeo, material))

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const CubeTextureLoader = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!
    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)

    const axesHelper = new THREE.AxesHelper(60)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)

    const light = new THREE.AmbientLight(0xffffff, 100000)
    scene.add(light)

    const textureLoader = new THREE.CubeTextureLoader()
    const texture = textureLoader
      .setPath('/material/forest/')
      .load(['nx.png', 'ny.png', 'nz.png', 'px.png', 'py.png', 'pz.png'])
    scene.background = texture

    const boxGeo = new THREE.BoxGeometry(60, 60, 60)
    const material = new THREE.MeshPhysicalMaterial({
      color: 'rgb(180,180,180)',
    })
    scene.add(new THREE.Mesh(boxGeo, material))

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const TRGBELoader = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!
    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)

    const axesHelper = new THREE.AxesHelper(60)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)

    const light = new THREE.AmbientLight(0xffffff, 100000)
    scene.add(light)

    const rgbeLoader = new RGBELoader()
    rgbeLoader.load('/material/city/san_giuseppe_bridge_2k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.background = texture
    })

    const boxGeo = new THREE.BoxGeometry(60, 60, 60)
    const material = new THREE.MeshPhysicalMaterial({
      color: 'rgb(180,180,180)',
    })
    scene.add(new THREE.Mesh(boxGeo, material))

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const TGLTFLoader = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!
    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)

    const axesHelper = new THREE.AxesHelper(60)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)

    const light = new THREE.AmbientLight(0xffffff, 100000)
    scene.add(light)

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    loader.setDRACOLoader(dracoLoader)
    loader.load('/model/angryBird/scene.glb', (gltf) => {
      gltf.scene.scale.set(180, 180, 180)
      scene.add(gltf.scene)
    })

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const AudioLoader = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!
    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)

    const axesHelper = new THREE.AxesHelper(60)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)

    const light = new THREE.AmbientLight(0xffffff, 100000)
    scene.add(light)

    const listener = new THREE.AudioListener()
    const audio = new THREE.Audio(listener)
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load('/audio/superman.mp3', (buffer) => {
      audio.setBuffer(buffer)
    })

    audio.play()

    const gui = new GUI()
    gui.domElement.style.position = 'absolute'
    const obj = {
      play() {
        audio.pause()
        audio.play()
      },
      pause() {
        audio.pause()
      },
    }
    gui.add(obj, 'play')
    gui.add(obj, 'pause')

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(gui.domElement)
    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
