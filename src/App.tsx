import "aframe";
import "./App.css";
import { AssetItem, Assets, Camera, Image } from "@belivvr/aframe-react";
import SkyBox from "./components/SkyBox";
import AframeProvider from "./lib/aframe/AframeProvider";
import Space from "./components/Space";
import SeaBox from "./components/SeaBox";

function App() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <AframeProvider>
                <Assets>
                    <AssetItem
                        id="ground_grey"
                        src="models/ground_grey/ground_grey_1k.gltf"
                    />
                    <AssetItem
                        id="marble_bust_01"
                        src="models/marble_bust_01_2k/marble_bust_01_2k.gltf"
                    />
                    <AssetItem
                        id="vintage_pocket_watch"
                        src="models/vintage_pocket_watch_2k/vintage_pocket_watch_2k.gltf"
                    />
                    <Image id="smoke" src="textures/smoke.png" />
                </Assets>
                <Camera />
                <Space />
                {/* <SkyBox /> */}
                {/* <SeaBox /> */}
            </AframeProvider>
        </div>
    );
}

export default App;
