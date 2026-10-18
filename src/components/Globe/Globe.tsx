import * as React from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import countries from '@assets/countries.json';
import globeTextureUrl from '@img/globe.jpg';
import vertexShader from '@shaders/vertex.glsl?raw';
import fragmentShader from '@shaders/fragment.glsl?raw';
import atmosphereVertexShader from '@shaders/atmosphereVertex.glsl?raw';
import atmosphereFragmentShader from '@shaders/atmosphereFragment.glsl?raw';
import './Globe.scss';

interface Country {
    alpha3Code: string;
    name: string;
    population: number;
    latlng: number[];
}

interface IGlobeProps {
    onCountrySelect: (country: string) => void;
}

const countryData = countries as Country[];

const Globe = ({ onCountrySelect }: IGlobeProps) => {

    const canvasContainer = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const popupRef = React.useRef<HTMLDivElement>(null);
    const countryNameRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        const container = canvasContainer.current;
        const canvas = canvasRef.current;
        const popup = popupRef.current;
        const countryName = countryNameRef.current;

        if (!container || !canvas || !popup || !countryName) {
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 15;

        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        scene.background = new THREE.Color('#000000');

        const resizeRenderer = () => {
            const { width, height } = container.getBoundingClientRect();
            if (width === 0 || height === 0) return;

            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        const resizeObserver = new ResizeObserver(resizeRenderer);
        resizeObserver.observe(container);
        resizeRenderer();

        const globeTexture = new THREE.TextureLoader().load(
            globeTextureUrl,
            undefined,
            undefined,
            (error) => console.error('Failed to load the globe texture.', error)
        );
        globeTexture.colorSpace = THREE.SRGBColorSpace;

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(5, 50, 50),
            new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    globeTexture: { value: globeTexture }
                }
            })
        );
        sphere.rotation.y = -Math.PI / 2;

        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(5, 50, 50),
            new THREE.ShaderMaterial({
                vertexShader: atmosphereVertexShader,
                fragmentShader: atmosphereFragmentShader,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            })
        );
        atmosphere.scale.setScalar(1.1);
        scene.add(atmosphere);

        const group = new THREE.Group();
        group.add(sphere);
        scene.add(group);

        const markerMaterial = new THREE.MeshBasicMaterial({
            color: '#3BF7FF',
            opacity: 0.4,
            transparent: true
        });
        const markers: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>[] = [];
        const markerTweens: gsap.core.Tween[] = [];

        countryData.forEach((country) => {
            if (
                !Array.isArray(country.latlng)
                || country.latlng.length !== 2
                || !country.latlng.every(Number.isFinite)
            ) {
                console.warn(`Skipping globe marker for ${country.name}: invalid coordinates.`);
                return;
            }

            const scale = country.population / 1_000_000_000;
            const depth = Math.max(0.8 * scale, 0.4 * Math.random());
            const box = new THREE.Mesh(
                new THREE.BoxGeometry(
                    Math.max(0.2, 0.2 * scale),
                    Math.max(0.2, 0.2 * scale),
                    depth
                ),
                markerMaterial.clone()
            );
            const [lat, lng] = country.latlng;
            const latitude = THREE.MathUtils.degToRad(lat);
            const longitude = THREE.MathUtils.degToRad(lng);
            const radius = 5;

            box.position.set(
                radius * Math.cos(latitude) * Math.sin(longitude),
                radius * Math.sin(latitude),
                radius * Math.cos(latitude) * Math.cos(longitude)
            );
            box.lookAt(0, 0, 0);
            box.geometry.translate(0, 0, -depth / 2);
            box.userData.country = country.name;
            box.userData.alpha3Code = country.alpha3Code;
            group.add(box);
            markers.push(box);

            markerTweens.push(gsap.to(box.scale, {
                z: 1.4,
                duration: 2,
                yoyo: true,
                repeat: -1,
                ease: 'linear',
                delay: Math.random()
            }));
        });

        markerMaterial.dispose();

        const starVertices: number[] = [];
        for (let i = 0; i < 10000; i++) {
            starVertices.push(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                -Math.random() * 2000
            );
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
        scene.add(new THREE.Points(starGeometry, starMaterial));

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2(2, 2);
        const targetRotation = { x: 0, y: 0 };
        let pointerDown = false;
        let pointerInside = false;
        let previousPointer = { x: 0, y: 0 };
        let pointerDownPosition = { x: 0, y: 0 };
        let animationFrame = 0;

        const updatePointer = (event: PointerEvent) => {
            const bounds = container.getBoundingClientRect();
            pointerInside = true;
            pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

            if (pointerDown) {
                targetRotation.y += (event.clientX - previousPointer.x) * 0.005;
                targetRotation.x += (event.clientY - previousPointer.y) * 0.005;
                previousPointer = { x: event.clientX, y: event.clientY };
            }

            popup.style.left = `${event.clientX - bounds.left}px`;
            popup.style.top = `${event.clientY - bounds.top}px`;
        };

        const handlePointerLeave = () => {
            pointerInside = false;
            popup.style.display = 'none';
        };

        const handlePointerDown = (event: PointerEvent) => {
            pointerDown = true;
            previousPointer = { x: event.clientX, y: event.clientY };
            pointerDownPosition = { x: event.clientX, y: event.clientY };
            canvas.setPointerCapture(event.pointerId);
        };

        const findVisibleMarker = () => {
            if (!pointerInside) return undefined;

            raycaster.setFromCamera(pointer, camera);
            const markerIntersection = raycaster.intersectObjects(markers)[0];
            const globeIntersection = raycaster.intersectObject(sphere)[0];

            if (!markerIntersection || (
                globeIntersection && markerIntersection.distance >= globeIntersection.distance
            )) {
                return undefined;
            }

            return markerIntersection.object as typeof markers[number];
        };

        const handlePointerUp = (event: PointerEvent) => {
            if (!pointerDown) return;

            const movementX = event.clientX - pointerDownPosition.x;
            const movementY = event.clientY - pointerDownPosition.y;
            const wasClick = movementX ** 2 + movementY ** 2 <= 36;
            pointerDown = false;

            if (!wasClick) return;

            const bounds = container.getBoundingClientRect();
            pointerInside = event.clientX >= bounds.left
                && event.clientX <= bounds.right
                && event.clientY >= bounds.top
                && event.clientY <= bounds.bottom;
            pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

            const clickedMarker = findVisibleMarker();
            if (clickedMarker) {
                onCountrySelect(clickedMarker.userData.country as string);
            }
        };

        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();

            camera.position.z = THREE.MathUtils.clamp(
                camera.position.z * Math.exp(event.deltaY * 0.001),
                7,
                30
            );
        };


        const animate = () => {
            animationFrame = requestAnimationFrame(animate);
            group.rotation.x += (targetRotation.x - group.rotation.x) * 0.08;
            group.rotation.y += (targetRotation.y - group.rotation.y) * 0.08;

            markers.forEach((marker) => {
                marker.material.opacity = 0.4;
            });

            const hoveredMarker = findVisibleMarker();
            if (hoveredMarker) {
                hoveredMarker.material.opacity = 1;
                countryName.textContent = hoveredMarker.userData.country;
                popup.style.display = 'block';
            } else {
                popup.style.display = 'none';
            }

            renderer.render(scene, camera);
        };

        canvas.addEventListener('pointerdown', handlePointerDown);
        container.addEventListener('pointermove', updatePointer);
        container.addEventListener('pointerleave', handlePointerLeave);
        container.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
            canvas.removeEventListener('pointerdown', handlePointerDown);
            container.removeEventListener('pointermove', updatePointer);
            container.removeEventListener('pointerleave', handlePointerLeave);
            container.removeEventListener('wheel', handleWheel);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
            markerTweens.forEach((tween) => tween.kill());
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
                    object.geometry.dispose();
                    const materials = Array.isArray(object.material)
                        ? object.material
                        : [object.material];
                    materials.forEach((material) => material.dispose());
                }
            });
            globeTexture.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            className="h-screen xl:w-1/2"
            id="canvasContainer"
            ref={canvasContainer}
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            <canvas
                ref={canvasRef}
                style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }}
            />
            <div
                ref={popupRef}
                style={{
                    display: 'none',
                    position: 'absolute',
                    pointerEvents: 'none',
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    transform: 'translate(12px, 12px)'
                }}
            >
                <div><span className="tooltip-content" ref={countryNameRef} /></div>
                <span>Click to learn more</span>
            </div>
        </div>
    );
};

export default Globe;
