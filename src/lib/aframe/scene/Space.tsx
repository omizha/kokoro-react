import { Light, Sphere, GLTFModel, Sky } from "@belivvr/aframe-react";
import { useEffect } from "react";
import Clouds from "./Clouds";

export default function Space() {
    useEffect(() => {
        const sceneEl = document.querySelector("a-scene");
        const sceneThree = sceneEl.object3D;

        console.log("sceneThree", sceneThree);
    }, []);

    return (
        <>
            <Sky src={"textures/crab_nebula.png"} />
            <Light type="ambient" />
            <Light
                type="directional"
                position={{ x: 0, y: 1.6, z: 1.6 }}
                color={"#f94848"}
            />
            <Light
                type="point"
                position={{ x: 6, y: 3, z: -10 }}
                intensity={3}
                distance={10}
            />
            <Light
                type="point"
                position={{ x: -6, y: 3, z: -10 }}
                intensity={3}
                distance={10}
            />
            <GLTFModel
                src="#ground_grey"
                position={{ x: -5, y: -2, z: -10 }}
                scale={{ x: 6, y: 6, z: 6 }}
            />
            <GLTFModel
                src="#ground_grey"
                position={{ x: -1, y: -0.5, z: -9 }}
                scale={{ x: 3, y: 3, z: 3 }}
            />
            <GLTFModel
                src="#ground_grey"
                position={{ x: 4, y: -2, z: -8 }}
                scale={{ x: 6, y: 6, z: 6 }}
            />
            <GLTFModel
                src="#marble_bust_01"
                position={{ x: -1, y: 2, z: -9 }}
                scale={{ x: 10, y: 10, z: 10 }}
                material={{
                    transparent: true,
                    opacity: 0.2,
                }}
            />
            <GLTFModel
                src="#vintage_pocket_watch"
                position={{ x: 4, y: 4, z: -12 }}
                scale={{ x: 46, y: 46, z: 46 }}
            />
            <GLTFModel
                src="#saturn_1_120536"
                position={{ x: 0, y: 30, z: -70 }}
                rotation={{ x: 30, y: 0, z: 30 }}
                scale={{ x: 0.05, y: 0.05, z: 0.05 }}
            />
            <Clouds />
        </>
    );
}
