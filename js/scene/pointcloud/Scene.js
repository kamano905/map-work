import * as GaussianSplat3D from '../../../lib/gaussian-splat-3d.module.js';
import * as THREE from '../../../lib/three.module.js';
import { PLYLoader } from '../../../lib/PLYLoader.js';
import { OrbitControls } from '../../../lib/OrbitControls.js';
import Stats from '/lib/stats.module.js';

export class Scene {

    constructor() {
    }

    load() {
        let filename = 'assets/data/nagasaki/nagasaki_map.ply';

        // FPSの表示
        const stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);


        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        // 軸の表示
        // const plane = new THREE.AxesHelper(300);
        // scene.add(plane);

        const renderer = new THREE.WebGLRenderer({
            antialias: false
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild( renderer.domElement );

        // const fov = 2 * Math.atan(1 / (2 * Math.sqrt(2))) * 180 / Math.PI;
        // console.log('fov: ' + fov);
        // const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 50000);
        // const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 5, 50000);
        const camera = new THREE.OrthographicCamera(
            -window.innerWidth/2,
            window.innerWidth/2,
            window.innerHeight/2,
            -window.innerHeight/2,
            0.01,
            50000
        );
        const controls = new OrbitControls( camera, renderer.domElement );
        camera.position.copy(new THREE.Vector3().fromArray([0, 0, 1000]));
        camera.lookAt(new THREE.Vector3().fromArray([0, 0, 0]));

        let loader = new PLYLoader();

        let mat = new THREE.PointsMaterial({
            size: 1.0,
            // color: 0xffffff,
            vertexColors: true,
        });
        loader.load(filename, function(geometry) {
            let points = new THREE.Points(geometry, mat);
            console.log(points['geometry']['attributes']['position']['array'].length);
            console.log(points['geometry']['attributes']['position']);
            scene.add(points);
        });

        controls.update();
        function animate() {
            requestAnimationFrame( animate );
            controls.update();
            renderer.render( scene, camera );
        }
        animate();
        // renderer.render(scene, camera);
    }

}
