import { useEffect } from 'react'
import * as THREE from 'three'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls'

interface Props {
  cameraPosition?: [number, number, number]
}

export default function useThreeJsScene(props: Props = {}) {
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  useEffect(() => {
    const pointLight = new THREE.PointLight(0xffffff, 40000)
    pointLight.position.set(120, 120, 120)
    scene.add(pointLight)

    const axesHelper = new THREE.AxesHelper(80)
    scene.add(axesHelper)

    const width = window.innerWidth
    const height = window.innerHeight
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
    camera.position.set(...(props.cameraPosition ?? [200, 200, 200]))
    camera.lookAt(0, 0, 0)

    new OrbitControls(camera, renderer.domElement)

    function r() {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    requestAnimationFrame(r)
  }, [])

  return {
    scene,
    renderer,
  }
}
