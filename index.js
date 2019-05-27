import * as THREE from 'three';
import './lib/OrbitControls';
import './lib/OBJLoader';

/**
 * ModelRenderer class
 */
class ModelRenderer {
  /**
   * ModelRenderer constructor
   *
   * @param {Object} options - options
   */
  constructor(options) {
    this.defaults = {
      container: null,
      model: null,
    };

    this.defaults = {
      ...this.defaults,
      ...options,
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
    };

    if (!this.defaults.container) {
      throw new Error('No container selector is specified');
    }

    this.mouseX = 0;
    this.mouseY = 0;
  }

  /**
   * Model render screen initializer
   */
  init() {
    this.container = document.querySelector(this.defaults.container);

    const aspect = this.container.offsetWidth / this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 1, 10000000);
    this.camera.position.z = 250;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color(0xFFFFFF));
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.renderer.shadowMap.enabled = true;

    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    this.animate();
  }

  /**
   * requestAnimationFrame handler
   *
   * @private
   */
  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Window resize handler
   *
   * @private
   */
  onWindowResize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Mouse movement handler
   *
   * @private
   * @param {MouseEvent} e - mouse event
   */
  onDocumentMouseMove(e) {
    this.mouseX = (e.clientX - this.defaults.windowHalfX) / 2;
    this.mouseY = (e.clientY - this.defaults.windowHalfY) / 2;
  }

  /**
   * Load .obj model file
   *
   * @async
   * @param {string} [url] - url to obj file. Default value
   * is set in the constructor options
   */
  loadModel(url = this.defaults.model) {
    return new Promise((resolve, reject) => {
      if (!url) {
        return reject(new Error('No model url is specified'));
      }

      return new THREE.OBJLoader()
        .load(url, object => resolve(object), null, err => reject(err));
    });
  }

  /**
   * Display model on canvas
   *
   * @param {any} object = obj file data
   */
  displayModel(object) {
    object.children.forEach((mesh) => {
      mesh.material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xADADAD),
        emissive: new THREE.Color(0x737373),
        shading: THREE.FlatShading,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        fog: false,
        side: THREE.DoubleSide,
      });
    });

    this.scene = new THREE.Scene();

    this.scene.add(this.camera);
    this.scene.fog = new THREE.FogExp2(0xE7E8EB, 0.015);

    this.scene.add(object);

    const box = new THREE.Box3().setFromObject(object);
    box.getCenter(object.position);
    object.localToWorld(box);
    object.position.multiplyScalar(-1);

    const pos = this.scene.position;
    const sceneBox = new THREE.Box3().setFromObject(this.scene);
    const height = Math.max(sceneBox.getSize().y, sceneBox.getSize().x);
    const fov = this.camera.fov * (Math.PI / 180);
    const distance = Math.abs(height / Math.sin(fov / 2));

    this.camera.position.set(pos.x, pos.y, distance + (height / 2));
    this.camera.zoom = 2.5;
    this.camera.updateProjectionMatrix();

    const gridHelper = new THREE.GridHelper(height, 100);
    gridHelper.position.y -= (height / 2);
    gridHelper.rotation.y = Math.PI / 4;

    this.scene.add(gridHelper);

    const light = new THREE.HemisphereLight(0xeeeeee, 0x888888, 0.5);
    light.position.set(0, 20, 0);

    this.scene.add(light);
  }
}

export default ModelRenderer;
