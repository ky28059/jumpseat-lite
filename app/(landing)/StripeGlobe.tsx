'use client'

import { useEffect, useRef } from 'react';
import { DoubleSide, ImageLoader, InstancedMesh, Mesh, Object3D, Vector3 } from 'three';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useBreakpoint } from '@/hooks/useBreakpoint';


export default function StripeGlobe() {
    return (
        <Canvas
            className="!absolute inset-0 translate-x-1/3 -translate-y-1/4 sm:translate-y-0"
            gl={{ antialias: false }}
            camera={{ position: [0, 0, 33] }}
        >
            <GlobeMesh />
            <DotMesh />
            <OrbitControls
                autoRotate
                autoRotateSpeed={0.5}
                enablePan={false}
                enableZoom={false}
            />
        </Canvas>
    )
}

function GlobeMesh() {
    const meshRef = useRef<Mesh>(null);

    const { camera } = useThree();
    const isLg = useBreakpoint('lg');

    // Zoom in/out depending on screen size
    useEffect(() => {
        camera.zoom = isLg ? 1.0 : 0.5;
        camera.updateProjectionMatrix();
    }, [isLg]);

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[19.5, 50, 50]} />
            <meshStandardMaterial
                color={0x0b2636}
                transparent
                opacity={0.25}
            />
        </mesh>
    )
}

function DotMesh() {
    const dotSphereRadius = 20;
    const dotDensity = 2.5;

    const instancedMeshRef = useRef<InstancedMesh>(null);

    const image = useLoader(ImageLoader, '/world_alpha_mini.jpg');

    useEffect(() => {
        if (!instancedMeshRef.current) return;

        // Write loaded image bitmap to canvas and get latitude / longitude data
        const activeLatLon: { [key: number]: number[] } = {};

        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = image.width;
        imageCanvas.height = image.height;

        const context = imageCanvas.getContext('2d')!;
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height).data;
        for (let i = 0, lon = -180, lat = 90; i < imageData.length; i += 4, lon++) {
            if (!activeLatLon[lat]) activeLatLon[lat] = [];

            const red = imageData[i];
            const green = imageData[i + 1];
            const blue = imageData[i + 2];

            if (red > 100 && green > 100 && blue > 100)
                activeLatLon[lat].push(lon);

            if (lon === 180) {
                lon = -180;
                lat--;
            }
        }

        function coordinateIsVisible(lon: number, lat: number) {
            if (!activeLatLon[lat]?.length) return false;

            const closest = activeLatLon[lat].reduce((prev, curr) => {
                return Math.abs(curr - lon) < Math.abs(prev - lon) ? curr : prev;
            });

            return Math.abs(lon - closest) < 0.5;
        }

        // Calculate instanced mesh transforms
        let vector = new Vector3();
        let temp = new Object3D();

        for (let lat = 90, i = 0; lat > -90; lat--) {
            const radius = Math.cos(Math.abs(lat) * (Math.PI / 180)) * dotSphereRadius;
            const circumference = radius * Math.PI * 2;
            const dotsForLat = circumference * dotDensity;

            for (let x = 0; x < dotsForLat; x++) {
                const long = -180 + x * 360 / dotsForLat;
                if (!coordinateIsVisible(long, lat)) continue;

                vector = calcPosFromLatLonRad(long, lat);

                temp.position.set(0, 0, 0);
                temp.lookAt(vector);
                temp.position.set(vector.x, vector.y, vector.z);
                temp.updateMatrix();

                instancedMeshRef.current.setMatrixAt(i++, temp.matrix);
            }
        }

        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }, [instancedMeshRef.current]);

    function calcPosFromLatLonRad(lon: number, lat: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -(dotSphereRadius * Math.sin(phi) * Math.cos(theta));
        const z = (dotSphereRadius * Math.sin(phi) * Math.sin(theta));
        const y = (dotSphereRadius * Math.cos(phi));

        return new Vector3(x, y, z);
    }

    return (
        <instancedMesh
            // material={material}
            ref={instancedMeshRef}
            args={[undefined, undefined, 11448]}
        >
            <circleGeometry args={[0.1, 5]} />
            <meshBasicMaterial
                color="#ffffff"
                side={DoubleSide}
            />
        </instancedMesh>
    );
}
