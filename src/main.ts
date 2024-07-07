import * as THREE from "three"
import vertexShader from "./shaders/vertex.glsl?raw"
import fragmentShader from "./shaders/fragment.glsl?raw"
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl?raw"
import atmosphereVertexShader from "./shaders/atmosphere.glsl?raw"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import "./style.css"
import gsap from "gsap"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    // color: 0x00ff00,
    // map: new THREE.TextureLoader().load("/globe.webp"),
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load("/globe.webp"),
      },
    },
  }),
)

// real atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  }),
)
scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
})

const starVertices = Array(10002)
  .fill(null)
  .map((_, i) =>
    i % 3 === 2 // Z coordinate
      ? -Math.random() * 2000
      : // Y and X coordinate
        (Math.random() - 0.5) * 1000,
  )

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3),
)

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

atmosphere.scale.set(1.1, 1.1, 1.1)

camera.position.z = 20

const mouse = {
  x: 0,
  y: 0,
} as {
  x: number
  y: number
}
addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1
  mouse.y = (e.clientY / innerHeight) * 2 - 1
})

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  sphere.rotation.y += 0.001
  gsap.to(group.rotation, {
    x: -mouse.y * 0.7,
    y: mouse.x * 0.8,
    duration: 2,
  })
}

animate()
