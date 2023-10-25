import * as GaussianSplat3D from '../../../lib/gaussian-splat-3d.module.js';
import * as THREE from '../../../lib/three.module.js';
import Stats from '/lib/stats.module.js';

export class Scene {

    constructor() {
    }

    load() {
        // FPSの表示
        const stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);


        const scene = new THREE.Scene();
        // const plane = new THREE.AxesHelper(300);
        // scene.add(plane);

        const renderer = new THREE.WebGLRenderer({
            antialias: false
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild( renderer.domElement );

        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.copy(new THREE.Vector3().fromArray([0, 0, 1500]));
        camera.lookAt(new THREE.Vector3().fromArray([0, 0, 0]));

        let spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position);

        function update() {
            requestAnimationFrame(update);

            // let t = performance.now() / 100000;
            // let progressRate = t - Math.trunc(t);
            // let phi = 2 * Math.PI * progressRate;
            // let theta = 2 * phi - Math.PI / 2;
            // let r = 1200;
            // let x = r * Math.sin(theta) * Math.cos(phi);
            // let y = r * Math.sin(theta) * Math.sin(phi);
            // let z = r * Math.cos(theta);
            // console.log(x, y, z);
            // viewer.camera.position.copy(
            //     new THREE.Vector3().fromArray([x, y, z])
            // );
            // viewer.camera.lookAt(new THREE.Vector3().fromArray([0, 0, 0]));
            console.log(spherical.theta, spherical.phi);
            spherical.theta += 0.01;
            spherical.phi = Math.sin(spherical.theta) * Math.PI / 2 + Math.PI / 2;

            // spherical.makeSafe(); // 球面の角度を制約
            let target = new THREE.Vector3(0, 0, 0);
            let newCameraPosition = new THREE.Vector3().setFromSpherical(spherical);
            newCameraPosition.add(target);
            viewer.camera.position.copy(newCameraPosition);
            viewer.camera.lookAt(target);

            viewer.update();
            viewer.render();
            stats.update();
        }

        // const plyLoader = new GaussianSplat3D.PlyLoader();
        // plyLoader.loadFromFile('assets/data/sample/sample.ply')
        // .then((splatBuffer) => {
        //     new GaussianSplat3D.SplatLoader(splatBuffer).saveToFile('sample.splat');
        // });

        const viewer = new GaussianSplat3D.Viewer({
            'scene': scene,
            'selfDrivenMode': false,
            'renderer': renderer,
            'camera': camera,
            'useBuiltInControls': false
        });
        viewer.init();
        viewer.loadFile('assets/data/sample/sample.splat')
        .then(() => {
            requestAnimationFrame(update);
        });
        // const viewer = new GaussianSplat3D.Viewer({
        //     'cameraUp': [0, -1, -.17],
        //     'initialCameraPosition': [-5, -1, -1],
        //     'initialCameraLookAt': [1, 1, 0],
        //     'splatAlphaRemovalThreshold': 10
        // });
        // viewer.init();
        // viewer.loadFile('assets/data/sample/sample.ply')
        // .then(() => {
        //     viewer.start();
        // });
    }

}
