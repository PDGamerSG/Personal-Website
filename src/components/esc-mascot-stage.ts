import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

export interface MascotStage {
  setOpen(open: boolean): void
  setVisible(visible: boolean): void
  dispose(): void
}

interface StageCallbacks {
  onReady(): void
  onError(): void
}

function disposeObject(root: THREE.Object3D) {
  const materials = new Set<THREE.Material>()
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    object.geometry.dispose()
    const list = Array.isArray(object.material) ? object.material : [object.material]
    list.forEach((material) => materials.add(material))
  })
  for (const material of materials) material.dispose()
}

/** Owns the GPU resources and listeners for one mounted mascot. */
export function createMascotStage(element: HTMLElement, callbacks: StageCallbacks): MascotStage {
  let disposed = false
  let failed = false
  let visible = false
  let loaded = false
  let frame = 0
  let lastTime = 0
  let targetOpen = false
  let openTime = 0
  let idleRemaining = 4
  let mixer: THREE.AnimationMixer | undefined
  let opening: THREE.AnimationAction | undefined
  let idle: THREE.AnimationAction | undefined
  let environmentMap: THREE.WebGLRenderTarget | undefined
  let observer: ResizeObserver | undefined
  let model: THREE.Group | undefined
  const listenerAbort = new AbortController()
  const { signal } = listenerAbort
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 60)
  const pointer = new THREE.Vector2()
  const attention = new THREE.Vector2()
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  const eyeOffset = new THREE.Quaternion()
  const eyes: { node: THREE.Object3D; base: THREE.Quaternion }[] = []
  const direction = new THREE.Vector3(5.8, 4.8, 8.9).normalize()
  const right = new THREE.Vector3().crossVectors(camera.up, direction).normalize()
  const up = new THREE.Vector3().crossVectors(direction, right).normalize()
  const projectedBounds = new THREE.Box3()
  let renderer: THREE.WebGLRenderer | undefined

  function stop() {
    cancelAnimationFrame(frame)
    frame = 0
  }

  function fail() {
    if (failed || disposed) return
    failed = true
    stop()
    callbacks.onError()
    dispose()
  }

  function requestFrame() {
    if (frame || disposed || failed || !loaded || !visible || document.hidden) return
    lastTime = performance.now()
    frame = requestAnimationFrame(render)
  }

  function render(time: number) {
    frame = 0
    if (disposed || failed || !loaded || !visible || document.hidden || !renderer || !mixer || !opening || !idle) return
    const delta = Math.min((time - lastTime) / 1000, 0.05)
    lastTime = time
    const target = targetOpen ? opening.getClip().duration : 0
    openTime += Math.sign(target - openTime) * Math.min(delta, Math.abs(target - openTime))
    opening.time = openTime
    for (const eye of eyes) eye.node.quaternion.copy(eye.base)
    idle.paused = idleRemaining <= 0
    idleRemaining = Math.max(0, idleRemaining - delta)
    mixer.update(delta)
    attention.lerp(pointer, 1 - Math.exp(-10 * delta))
    // The export retains Blender axes beneath the glTF root: local Z is up.
    eyeOffset.setFromEuler(new THREE.Euler(-attention.y * 0.04, 0, -attention.x * 0.07))
    for (const eye of eyes) {
      eye.base.copy(eye.node.quaternion)
      eye.node.quaternion.multiply(eyeOffset)
    }
    renderer.render(scene, camera)
    // Rest after the greeting. No permanent animation loop or offscreen work.
    if (idleRemaining > 0 || Math.abs(target - openTime) > 0.0001 || attention.distanceTo(pointer) > 0.001) {
      frame = requestAnimationFrame(render)
    }
  }

  function resize() {
    if (!renderer || disposed) return
    const width = element.clientWidth
    const height = element.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height, false)
    if (!projectedBounds.isEmpty()) {
      const middle = projectedBounds.getCenter(new THREE.Vector3())
      const size = projectedBounds.getSize(new THREE.Vector3())
      const center = new THREE.Vector3().addScaledVector(right, middle.x).addScaledVector(up, middle.y).addScaledVector(direction, middle.z)
      const halfHeight = Math.max(size.y / 2, size.x / (2 * width / height)) * 1.075
      camera.left = -halfHeight * width / height
      camera.right = halfHeight * width / height
      camera.top = halfHeight
      camera.bottom = -halfHeight
      camera.position.copy(center).addScaledVector(direction, 12)
      camera.lookAt(center)
      camera.updateProjectionMatrix()
    }
    requestFrame()
  }

  function collectPosePoints() {
    if (!model) return
    model.updateMatrixWorld(true)
    const point = new THREE.Vector3()
    const projected = new THREE.Vector3()
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      const positions = object.geometry.getAttribute('position')
      for (let i = 0; i < positions.count; i++) {
        point.fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld)
        projected.set(point.dot(right), point.dot(up), point.dot(direction))
        projectedBounds.expandByPoint(projected)
      }
    })
  }

  function dispose() {
    if (disposed) return
    disposed = true
    stop()
    listenerAbort.abort()
    observer?.disconnect()
    mixer?.stopAllAction()
    if (model) mixer?.uncacheRoot(model)
    disposeObject(scene)
    environmentMap?.dispose()
    renderer?.dispose()
    renderer?.domElement.remove()
    scene.clear()
  }

  const controller: MascotStage = {
    setOpen(open) {
      targetOpen = open
      requestFrame()
    },
    setVisible(next) {
      visible = next
      if (visible) requestFrame()
      else stop()
    },
    dispose,
  }

  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.toneMappingExposure = 1
    renderer.domElement.setAttribute('aria-hidden', 'true')
    element.append(renderer.domElement)

    const room = new RoomEnvironment()
    const pmrem = new THREE.PMREMGenerator(renderer)
    environmentMap = pmrem.fromScene(room, 0.04)
    scene.environment = environmentMap.texture
    scene.environmentIntensity = 0.4
    room.dispose()
    pmrem.dispose()
    scene.add(new THREE.HemisphereLight(0xb8d0ff, 0x26222b, 0.9))
    for (const [color, intensity, position] of [
      [0xffe2bc, 3.2, [-4.5, 8, 5]],
      [0x709bff, 1.8, [4, 4, -5]],
      [0xd2dcff, 0.55, [4, 2, 5]],
    ] as const) {
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(position[0], position[1], position[2])
      scene.add(light)
    }

    element.addEventListener('pointermove', (event) => {
      if (!finePointer.matches || event.pointerType === 'touch') return
      const rect = element.getBoundingClientRect()
      pointer.set(
        THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1),
        THREE.MathUtils.clamp(1 - (event.clientY - rect.top) / rect.height * 2, -1, 1),
      )
      requestFrame()
    }, { signal, passive: true })
    element.addEventListener('pointerleave', () => { pointer.set(0, 0); requestFrame() }, { signal })
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop()
      else requestFrame()
    }, { signal })
    renderer.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault()
      fail()
    }, { signal })
    observer = new ResizeObserver(resize)
    observer.observe(element)

    void new GLTFLoader().loadAsync('/mascot/esc.glb').then((gltf) => {
      if (disposed || failed) {
        disposeObject(gltf.scene)
        return
      }
      model = gltf.scene
      scene.add(model)
      const idleClip = THREE.AnimationClip.findByName(gltf.animations, 'Idle')
      const openClip = THREE.AnimationClip.findByName(gltf.animations, 'WorkshopOpen')
      if (!idleClip || !openClip) throw new Error('ESC animation clips are missing')
      mixer = new THREE.AnimationMixer(model)
      idle = mixer.clipAction(idleClip).play()
      opening = mixer.clipAction(openClip)
      opening.setLoop(THREE.LoopOnce, 1)
      opening.clampWhenFinished = true
      opening.play().paused = true
      mixer.update(0)
      collectPosePoints()
      opening.time = openClip.duration
      mixer.update(0)
      collectPosePoints()
      opening.time = openTime = targetOpen ? openClip.duration : 0
      mixer.update(0)
      for (const name of ['Eye_L_Pivot', 'Eye_R_Pivot']) {
        const node = model.getObjectByName(name)
        if (node) eyes.push({ node, base: node.quaternion.clone() })
      }
      loaded = true
      resize()
      renderer!.render(scene, camera)
      callbacks.onReady()
      requestFrame()
    }).catch(fail)
  } catch {
    fail()
    dispose()
  }
  return controller
}
