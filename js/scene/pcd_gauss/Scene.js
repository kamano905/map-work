import * as GaussianSplat3D from '../../../lib/gaussian-splat-3d.module.js';
import * as THREE from '../../../lib/three.module.js';
import Stats from '/lib/stats.module.js';
import { PLYLoader } from '../../../lib/PLYLoader.js';


export class Scene {

    constructor() {
    }

    load() {
        let filename = 'assets/data/nagasaki/point_cloud.ply';

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

        const fov = 2 * Math.atan(1 / (2 * Math.sqrt(2))) * 180 / Math.PI;
        console.log('fov: ' + fov);
        const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 5000);
        camera.position.copy(new THREE.Vector3().fromArray([0, 0, 2000]));
        camera.lookAt(new THREE.Vector3().fromArray([0, 0, 0]));

        let spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position);
        console.log(camera.getFilmHeight(), camera.getFilmWidth(), camera.getFocalLength());

        function update() {
            requestAnimationFrame(update);

            let t = performance.now() / 10000;
            let progressRate = t - Math.trunc(t);
            // console.log(x, y, z);
            // viewer.camera.position.copy(
            //     new THREE.Vector3().fromArray([x, y, z])
            // );
            // viewer.camera.lookAt(new THREE.Vector3().fromArray([0, 0, 0]));

            // リサージュ曲線
            spherical.theta = (1 + Math.sin(3 * t) / 4) * Math.PI; // 3/4pi <= theta <= 5/4pi
            spherical.phi = (0.5 + Math.sin(2 * t) / 4) * Math.PI; // 1/2pi <= phi <= 3/2pi
            const cameraUp = [0, -1, 0];

            // 円
            // spherical.theta = Math.PI / 2;
            // spherical.phi = progressRate * 2 * Math.PI;
            // const cameraUp = [0, 0, -1];

            let target = new THREE.Vector3(0, 0, 0);
            let newCameraPosition = new THREE.Vector3().setFromSpherical(spherical);
            console.log(newCameraPosition.toArray());
            newCameraPosition.add(target);
            // viewer.camera.position.copy(newCameraPosition);
            // viewer.camera.lookAt(target);
            // viewer.camera.up.copy(new THREE.Vector3().fromArray(cameraUp));

            viewer.update();
            viewer.render();
            stats.update();
        }

        // const plyLoader = new GaussianSplat3D.PlyLoader();
        // plyLoader.loadFromFile('assets/data/sample/sample.ply')
        // .then((splatBuffer) => {
        //     new GaussianSplat3D.SplatLoader(splatBuffer).saveToFile('sample.splat');
        // });

        let loader = new PLYLoader();

        let mat = new THREE.PointsMaterial({
            size: 1.0,
            // color: 0xffffff,
            vertexColors: true,
        });

        loader.load('assets/data/nagasaki/nagasaki.ply', function(geometry) {
            let points = new THREE.Points(geometry, mat);
            console.log(points['geometry']['attributes']['position']['array'].length);
            console.log(points['geometry']['attributes']['position']);
            scene.add(points);
        });

        // renderer.render( scene, camera );

        const viewer = new GaussianSplat3D.Viewer({
            'scene': scene,
            'camera': camera,
        });
        viewer.init();
        viewer.loadFile(filename)
        .then(() => {
            // requestAnimationFrame(update);
            viewer.start();
        });
    }

}
