
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';

// SCENE SETUP (KEEP YOUR ORIGINAL SETTINGS)
const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z += 32;

const scene = new THREE.Scene();
let bee;
let bounceAnimation;
const loader = new GLTFLoader();

// CUSTOMIZER VARIABLES
let currentMaterial;
const colorSwatches = [
    '#D8CAB8', '#808000', '#2C3E50', 
    '#ffff00', '#5D9CA4', '#B22222',
    '#DAA520', '#333333', '#964B00','#D8B2A6'
];
const lightPresets = {
    default: {
        sun: { color: 0xfff4e6, intensity: 1.5 },
        fill: { color: 0xffffff, intensity: 0.75 },
        rim: { color: 0xffffff, intensity: 0.5 },
        ambient: { color: 0xffffff, intensity: 0.3 }
    },
    warm: {
        sun: { color: 0xffd700, intensity: 1.8 },
        fill: { color: 0xfff4e6, intensity: 0.6 },
        rim: { color: 0xffa500, intensity: 0.4 },
        ambient: { color: 0xfff4e6, intensity: 0.4 }
    },
    cool: {
        sun: { color: 0x00ffff, intensity: 1.2 },
        fill: { color: 0xadd8e6, intensity: 0.8 },
        rim: { color: 0x0000ff, intensity: 0.3 },
        ambient: { color: 0xffffff, intensity: 0.2 }
    },
    dramatic: {
        sun: { color: 0x00fffff, intensity: 3.0 },
        fill: { color: 0x4b0082, intensity: 0.5 },
        rim: { color: 0x00ff00, intensity: 0.6 },
        ambient: { color: 0x000fff, intensity: 2.1 }
    }
};

// YOUR ORIGINAL MODEL LOADING WITH MATERIAL SETUP
loader.load('/model.glb',
    function (gltf) {
        bee = gltf.scene;
        scene.add(bee);
        
        // Prepare materials for customization
        bee.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.needsUpdate = true;
                currentMaterial = child.material;
            }
        });

        bee.position.set(0, -1, 0);
        bee.rotation.set(0.5, -0.5, -0.5);
        if (isInBannerSection()) {
            startBouncing();
        }
        
        initCustomizer(); // Initialize customizer after model loads
    },
    function (xhr) {},
    function (error) {}
);

// CUSTOMIZER FUNCTIONS
function initCustomizer() {
    // Create color swatches
    const colorPicker = document.getElementById('colorPicker');
    colorSwatches.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.addEventListener('click', () => changeColor(color));
        colorPicker.appendChild(swatch);
    });

    // Light preset handler
    document.getElementById('lightPreset').addEventListener('change', (e) => {
        applyLightPreset(e.target.value);
    });
}

function changeColor(color) {
    if (!currentMaterial) return;
    
    gsap.to(currentMaterial.color, {
        duration: 0.5,
        r: new THREE.Color(color).r,
        g: new THREE.Color(color).g,
        b: new THREE.Color(color).b
    });
}

function applyLightPreset(presetName) {
    const preset = lightPresets[presetName];
    
    gsap.to(sunLight, {
        duration: 1,
        color: new THREE.Color(preset.sun.color),
        intensity: preset.sun.intensity
    });
    
    gsap.to(fillLight, {
        duration: 1,
        color: new THREE.Color(preset.fill.color),
        intensity: preset.fill.intensity
    });
    
    gsap.to(rimLight, {
        duration: 1,
        color: new THREE.Color(preset.rim.color),
        intensity: preset.rim.intensity
    });
    
    gsap.to(ambientLight, {
        duration: 1,
        color: new THREE.Color(preset.ambient.color),
        intensity: preset.ambient.intensity
    });
}

// YOUR ORIGINAL LIGHTING SETUP (UNMODIFIED)
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enabled = false; // Only enable in "contact"

const sunLight = new THREE.DirectionalLight(0xfff4e6, 1.5);
sunLight.position.set(5, 15, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 40;
sunLight.shadow.camera.left = -20;
sunLight.shadow.camera.right = 20;
sunLight.shadow.camera.top = 20;
sunLight.shadow.camera.bottom = -20;
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.75);
fillLight.position.set(-5, 5, 5);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
rimLight.position.set(0, 5, -10);
scene.add(rimLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// YOUR ORIGINAL ANIMATION AND SCROLL LOGIC (UNMODIFIED)
function isInBannerSection() {
    const banner = document.getElementById('banner');
    return banner ? banner.getBoundingClientRect().top <= window.innerHeight / 3 : false;
}

function startBouncing() {
    if (!bee || bounceAnimation) return;
    bounceAnimation = gsap.to(bee.position, {
        y: 0.2,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });
}

function stopBouncing() {
    if (bounceAnimation) {
        bounceAnimation.kill();
        bounceAnimation = null;
    }
}

const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    if (controls.enabled) controls.update();

    renderer.render(scene, camera);

    
};
reRender3D();

const arrPositionModel = [
    {
        id: 'banner',
        position: { x: 0, y: 0, z: -1 },
        rotation: { x: 0, y: -1.5, z: 0 },
    },
    {
        id: "intro",
        position: { x: -2, y: 0, z: -5 },
        rotation: { x: 0.5, y: -0.5, z: 0 },
    },
    {
        id: "description",
        position: { x: 2, y: -1, z: -5 },
        rotation: { x: 0, y: 0.5, z: 0 },
    },
    {
        id: "contact",
        position: { x: 0, y: -1, z: 0 },
        rotation: { x: 0.3, y: -0.5, z: 0 },
    },
];

// MODIFIED modelMove TO HANDLE CUSTOMIZER VISIBILITY
const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;
    const customizerUI = document.querySelector('.customizer-ui');
    
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
            currentSection = section.id;
        }
    });
    
    const position_active = arrPositionModel.findIndex(val => val.id === currentSection);
    if (position_active < 0) return;

    const new_coordinates = arrPositionModel[position_active];
    
    // Toggle customizer UI
    if (currentSection === 'contact') {
        customizerUI.classList.add('active');
        controls.enabled = true; // Enable orbit controls
    } else {
        customizerUI.classList.remove('active');
        controls.enabled = false; // Disable orbit controls
    }
    

    // YOUR ORIGINAL ANIMATION LOGIC (UNMODIFIED)
    if (currentSection === 'banner') {
        gsap.to(camera.position, {
            z: 32,
            duration: 1.5,
            ease: "power1.out"
        });

        if (bee.position.y !== new_coordinates.position.y) {
            gsap.to(bee.position, {
                ...new_coordinates.position,
                duration: 1.5,
                ease: "power1.out",
                onComplete: startBouncing
            });
        } else {
            startBouncing();
        }
    } else {
        stopBouncing();
        gsap.to(camera.position, {
            z: 22,
            duration: 1.5,
            ease: "power1.out"
        });
        
        gsap.to(bee.position, {
            ...new_coordinates.position,
            duration: 1.5,
            yoyo: true,
            ease: "power1.out",
        });
        gsap.to(bee.position, {
            y: 0.4,
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }

    gsap.to(bee.rotation, {
        ...new_coordinates.rotation,
        duration: 1.5,
        ease: "power1.out"
    });
};

// YOUR ORIGINAL EVENT LISTENERS (UNMODIFIED)
let isScrolling;
window.addEventListener('scroll', () => {
    window.cancelAnimationFrame(isScrolling);
    isScrolling = window.requestAnimationFrame(() => {
        if (bee) modelMove();
    });
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});