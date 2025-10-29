'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTheme } from 'next-themes'

type Props = {
  nodeCount?: number
}

export default function ThreeGraphBG({ nodeCount = 110 }: Props) {
  const { resolvedTheme } = useTheme()
  if (!resolvedTheme) return null

  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true
  )

  useEffect(() => {
    setIsDark(resolvedTheme === 'dark')
  }, [resolvedTheme])

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rafRef = useRef<number | null>(null)
  const groupRef = useRef<THREE.Group | null>(null)
  const linesRef = useRef<THREE.LineSegments | null>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const wrap = wrapRef.current!
    const w = wrap.clientWidth
    const h = wrap.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
    camera.position.set(0, 0, 95)
    cameraRef.current = camera

    const fogColor = new THREE.Color(isDark ? 0x060607 : 0xf7fafc)
    scene.fog = new THREE.Fog(fogColor, 120, 240)
    scene.background = null

    scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.45 : 0.7))
    const key = new THREE.DirectionalLight(0xffffff, 0.8)
    key.position.set(4, 5, 6)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x8b5cf6, 0.6)
    rim.position.set(-5, -3, -4)
    scene.add(rim)

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer
    wrap.appendChild(renderer.domElement)

    const group = new THREE.Group()
    groupRef.current = group
    scene.add(group)

    const palette = [0xc4b5fd, 0x6ee7b7, 0xa78bfa, 0x34d399, 0x8b5cf6]

    const sphereGeo = new THREE.SphereGeometry(1, 12, 12)
    const mat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x000000,
      emissiveIntensity: 0.3,
      shininess: 60,
      transparent: true,
      opacity: 0.9
    })
    const inst = new THREE.InstancedMesh(sphereGeo, mat, nodeCount)
    inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    const color = new THREE.Color()
    for (let i = 0; i < nodeCount; i++) {
      color.setHex(palette[(Math.random() * palette.length) | 0])
      inst.setColorAt(i, color)
    }
    group.add(inst)

    const pos = new Array<THREE.Vector3>(nodeCount)
    const vel = new Array<THREE.Vector3>(nodeCount)
    const zf = new Array<number>(nodeCount)
    const rad = new Array<number>(nodeCount)
    const tmpMat = new THREE.Matrix4()

    for (let i = 0; i < nodeCount; i++) {
      zf[i] = Math.random()
      rad[i] = (0.2 + zf[i] * 0.6) * (isDark ? 1.05 : 0.95)
      pos[i] = new THREE.Vector3((Math.random() - 0.5) * 180, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 180)
      vel[i] = new THREE.Vector3(
        (Math.random() - 0.5) * (0.08 + zf[i] * 0.12),
        (Math.random() - 0.5) * (0.08 + zf[i] * 0.12),
        (Math.random() - 0.5) * (0.06 + zf[i] * 0.1)
      )
    }

    const pairs: Array<[number, number]> = []
    const maxDist = 26
    const lineGeom = new THREE.BufferGeometry()
    lineGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3))
    const lineMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x6b7280,
      transparent: true,
      opacity: isDark ? 0.22 : 0.18
    })
    const lineSeg = new THREE.LineSegments(lineGeom, lineMat)
    linesRef.current = lineSeg
    group.add(lineSeg)

    const ensureLineCapacity = () => {
      const need = pairs.length * 2 * 3
      const attr = lineGeom.getAttribute('position') as THREE.BufferAttribute
      if (!attr || attr.array.length !== need) {
        const arr = new Float32Array(need)
        lineGeom.setAttribute('position', new THREE.BufferAttribute(arr, 3))
        lineGeom.setDrawRange(0, pairs.length * 2)
      }
    }

    const computePairs = (count: number) => {
      pairs.length = 0
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const a = pos[i]
          const b = pos[j]
          const d = a.distanceTo(b)
          if (d < maxDist && Math.random() > 0.65) pairs.push([i, j])
        }
      }
      ensureLineCapacity()
    }

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      mouse.current.x = x
      mouse.current.y = y
    }
    window.addEventListener('mousemove', onMove)

    const onResize = () => {
      const W = wrap.clientWidth
      const H = wrap.clientHeight
      renderer.setSize(W, H)
      camera.aspect = W / H
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    let t = 0
    const bounds = new THREE.Box3(new THREE.Vector3(-95, -65, -110), new THREE.Vector3(95, 65, 110))
    let visibleCount = 0
    let spawnTimer = 0

    const animate = () => {
      t += 0.016

      spawnTimer += 1
      if (visibleCount < nodeCount) {
        const add = spawnTimer > 1 ? 12 : 4
        visibleCount = Math.min(nodeCount, visibleCount + add)
        spawnTimer = 0
        computePairs(visibleCount)
      } else {
        if ((performance.now() | 0) % 2000 < 16) computePairs(visibleCount)
      }

      group.rotation.y += ((mouse.current.x * 0.35) - group.rotation.y) * 0.04
      group.rotation.x += ((mouse.current.y * 0.25) - group.rotation.x) * 0.04

      for (let i = 0; i < visibleCount; i++) {
        const p = pos[i]
        p.x += vel[i].x + Math.sin(t * 0.6 + p.y * 0.02) * 0.02
        p.y += vel[i].y + Math.cos(t * 0.5 + p.x * 0.02) * 0.02
        p.z += vel[i].z + Math.sin(t * 0.4 + p.z * 0.015) * 0.015
        if (p.x < bounds.min.x) p.x = bounds.max.x
        if (p.x > bounds.max.x) p.x = bounds.min.x
        if (p.y < bounds.min.y) p.y = bounds.max.y
        if (p.y > bounds.max.y) p.y = bounds.min.y
        if (p.z < bounds.min.z) p.z = bounds.max.z
        if (p.z > bounds.max.z) p.z = bounds.min.z
        const s = rad[i] * (1 + Math.sin(t * 0.8 + p.x * 0.03) * 0.06 * (0.5 + zf[i]))
        tmpMat.makeScale(s, s, s)
        tmpMat.setPosition(p.x, p.y, p.z)
        inst.setMatrixAt(i, tmpMat)
      }
      inst.count = visibleCount
      inst.instanceMatrix.needsUpdate = true

      if (pairs.length) {
        const arr = lineGeom.getAttribute('position') as THREE.BufferAttribute
        let k = 0
        for (let i = 0; i < pairs.length; i++) {
          const [a, b] = pairs[i]
          const pa = pos[a]
          const pb = pos[b]
          arr.array[k++] = pa.x
          arr.array[k++] = pa.y
          arr.array[k++] = pa.z
          arr.array[k++] = pb.x
          arr.array[k++] = pb.y
          arr.array[k++] = pb.z
        }
        arr.needsUpdate = true
      }

      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(animate)
    }

    inst.count = 0
    animate()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      wrap.removeChild(renderer.domElement)
      lineGeom.dispose()
      lineMat.dispose()
      sphereGeo.dispose()
      inst.dispose()
      renderer.dispose()
    }
  }, [isDark, nodeCount])

  return (
    <div className="absolute inset-0 -z-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-emerald-400/30 blur-[80px]" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-violet-500/30 blur-[100px]" />
      </div>
      <div ref={wrapRef} className="absolute inset-0" />
    </div>
  )
}
