import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, useBounds, OrbitControls, ContactShadows, useGLTF } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{ position: [0, -10, 80], fov: 50 }} dpr={[1, 2]}>
      <spotLight position={[-100, -100, -100]} intensity={0.2} angle={0.3} penumbra={1} />

      <hemisphereLight color="white" groundColor="#ff0f00" position={[-7, 25, 13]} intensity={1} />

      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />

      <Suspense fallback={null}>
        <Bounds fit clip margin={1.2}>
          <SelectToZoom>
            <Model name="FoodBag" position={[1, -11, -20]} rotation={[0, 0, 0]} />
          </SelectToZoom>
        </Bounds>

        <ContactShadows rotation-x={Math.PI / 2} position={[0, -35, 0]} opacity={0.2} width={200} height={200} blur={1} far={50} />
      </Suspense>
    </Canvas>
  )
}

function Model({ name, ...props }) {
  const { nodes } = useGLTF('/VeganBag.glb')
  return <mesh geometry={nodes[name].geometry} material={nodes[name].material} {...props} dispose={null} />
}

// This component wraps children in a group with a click handler
// Clicking any object will refresh and fit bounds
function SelectToZoom({ children }) {
  const api = useBounds()
  return (
    <group onClick={(e) => (e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit())} onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}>
      {children}
    </group>
  )
}
