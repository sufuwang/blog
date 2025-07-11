import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons'

const Mesh = () => {
  const meshRef = useRef<THREE.Mesh>()

  const onClick = (event: { object: THREE.Mesh }) => {
    const { color } = event.object.material as unknown as { color: THREE.Color }
    color.set(color.getHexString() === '0000ff' ? 'orange' : 'blue')
  }

  useFrame((state, delta) => {
    meshRef.current!.rotation.x += delta * 0.5
    meshRef.current!.rotation.y += delta * 0.5
    meshRef.current!.rotation.z += delta * 0.5
  })
  return (
    <mesh ref={meshRef} position={[0, 300, 0]} onClick={onClick}>
      <dodecahedronGeometry args={[10]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
const Cow = () => {
  const cow = useLoader(GLTFLoader, '/model/cow/Cow.gltf')
  cow.scene.scale.setScalar(30)
  cow.scene.rotateY(Math.PI / 2)
  return <primitive object={cow.scene} />
}

export default function R3F() {
  return (
    <Canvas className="!h-screen !w-screen" camera={{ position: [0, 0, 500] }}>
      <OrbitControls />
      <ambientLight />
      <directionalLight position={[500, 400, 300]} />
      <axesHelper args={[500]} />
      <Mesh />
      <Suspense fallback={null}>
        <Cow />
      </Suspense>
    </Canvas>
  )
}
