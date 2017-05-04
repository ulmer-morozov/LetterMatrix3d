declare function require(path: string): any;

import * as THREE from 'three';
import { Plate } from "./plate";
import { BrowserDetector } from "./browserDetector";
import { Howl }  from 'howler';

let TWEEN = require('./assets/Tween.js');
let Complex = require('three-simplicial-complex')(THREE)

var flipSoundPath = require("./assets/flip.mp3");
// require("file-loader?name=favicon.ico!./favicon.ico")
require("file-loader?name=favicon-16x16.png!./favicon-16x16.png")
require("file-loader?name=favicon-32x32.png!./favicon-32x32.png")
require("file-loader?name=pace.min.js!./assets/pace.min.js")

/* Code */

export default class AppComponent {

  canvas: HTMLCanvasElement;

  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private raycaster: THREE.Raycaster;

  private mouse: THREE.Vector2;
  private mouseSpeed = new THREE.Vector2();

  private lastTouch = new THREE.Vector2();
  private touchSpeed = new THREE.Vector2();

  private INTERSECTED: Plate;

  private normalMaterial = new THREE.MeshNormalMaterial();

  private geometries: THREE.Geometry[] = [];
  private italicGeometries: THREE.Geometry[] = [];

  private colliders: THREE.Mesh[] = [];

  // colors
  private frontColor = 0xffffff;
  private backColor = 0x000000;
  private sideColor = 0x333333;

  // contants
  private cubeWidth = 0.8;
  private cubeHeight = 1.2;
  private cubeThick = 0.1;
  private gap = 0.05;
  private fontGeomScale = 0.03;

  // shared objects
  private frontLetterMaterial: THREE.Material;
  private backLetterMaterial: THREE.Material;
  private plateMaterial: THREE.Material;
  private plateCubeGeometry: THREE.Geometry;
  private zoomTween: any;

  private canvasWidth: number;
  private canvasHeight: number;
  private lastFlipSoundPlayed = 0;

  private minZoom = 1;
  private maxZoom = 10;
  private zoomStep = 0.005;
  private normZoom = 0;
  private preciseZoomEnabled = false;

  private availableLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZабвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

  private plateSound: Howl;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.init();

    this.plateSound = new Howl({
      src: [flipSoundPath]
    });
  }

  init = (): void => {
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.scene = new THREE.Scene();

    let zoom = window.devicePixelRatio;
    let ratio = this.canvasWidth / this.canvasHeight;

    this.setOptimalZoomStep();
    this.setOptimalPlateSizeByBrowser();

    // this.camera = new THREE.PerspectiveCamera(25, ratio, 1, 5000);
    const cameraFactor = 60;
    this.camera = new THREE.OrthographicCamera(-this.canvasWidth / cameraFactor, this.canvasWidth / cameraFactor, this.canvasHeight / cameraFactor, -this.canvasHeight / cameraFactor, 0, 100);

    this.camera.position.set(0, 0, 60);;

    this.raycaster = new THREE.Raycaster();

    this.renderer = new THREE.WebGLRenderer
      ({
        antialias: true,
        canvas: this.canvas
      });

    this.renderer.setSize(zoom * this.canvasWidth, zoom * this.canvasHeight, false);
    this.renderer.shadowMap.enabled = false;

    this.plateCubeGeometry = new THREE.CubeGeometry(this.cubeWidth, this.cubeHeight, this.cubeThick);
    this.prepareMaterials();
    this.loadAdaptedGeometries();
  }

  setOptimalZoomStep = (): void => {
    if (BrowserDetector.isMac) {
      this.zoomStep = 0.005;
      this.preciseZoomEnabled = true;
      console.log("mac detected");
      return;
    }
    this.zoomStep = 0.05;
    this.preciseZoomEnabled = false;
  }

  setOptimalPlateSizeByBrowser = (): void => {
    let optimalLetterZoom = 1;

    if (BrowserDetector.isSafari())
      optimalLetterZoom = 1.7;
    else if (BrowserDetector.isFirefox())
      optimalLetterZoom = 1.2;
    else if (BrowserDetector.isIE())
      optimalLetterZoom = 1.5;

    this.cubeWidth *= optimalLetterZoom;
    this.cubeHeight *= optimalLetterZoom;
    this.cubeThick *= optimalLetterZoom;
    this.gap *= optimalLetterZoom;
    this.fontGeomScale *= optimalLetterZoom;
    this.maxZoom /= optimalLetterZoom;
  }

  prepareMaterials = (): void => {
    this.plateMaterial = new THREE.MultiMaterial([
      new THREE.MeshBasicMaterial({ color: this.sideColor }),
      new THREE.MeshBasicMaterial({ color: this.sideColor }),
      new THREE.MeshBasicMaterial({ color: this.sideColor }),
      new THREE.MeshBasicMaterial({ color: this.sideColor }),
      new THREE.MeshBasicMaterial({ color: this.frontColor }),
      new THREE.MeshBasicMaterial({ color: this.backColor })
    ]);

    this.frontLetterMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false, side: THREE.BackSide });
    this.backLetterMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, side: THREE.BackSide });
  }

  loadAdaptedGeometries = (): void => {
    let data = require('./assets/letter_geometries.json');

    let letterGeomInComplexes: any[] = data.italicLetterGeomInComplexes;
    let italicLetterGeomInComplexes: any[] = data.letterGeomInComplexes;

    for (let j = 0; j < letterGeomInComplexes.length; j++) {
      let regularComplexGeometry = letterGeomInComplexes[j];
      let italicComplexGeometry = italicLetterGeomInComplexes[j];

      let regularGeometry: THREE.Geometry = Complex(regularComplexGeometry);
      let italicGeometry: THREE.Geometry = Complex(italicComplexGeometry);

      this.geometries[j] = regularGeometry;
      this.italicGeometries[j] = italicGeometry;
    }
    this.completeSceneGeneration();
  }

  completeSceneGeneration = (): void => {
    this.fillSceneWithPlates();
    this.bindEvents();
    this.render();
  }

  bindEvents = (): void => {
    this.canvas.addEventListener('click', this.onDocumentMouseClick, false);
    this.canvas.addEventListener('mousemove', this.onDocumentMouseMove, false);
    this.canvas.addEventListener("touchstart", this.onTouchStart, false);
    this.canvas.addEventListener("touchmove", this.onTouchMove, false);

    if ('onwheel' in document) {
      // IE9+, FF17+, Ch31+
      this.canvas.addEventListener("wheel", this.onWheel);
    } else if ('onmousewheel' in document) {
      // устаревший вариант события
      this.canvas.addEventListener("mousewheel", this.onWheel);
    } else {
      // Firefox < 17
      this.canvas.addEventListener("MozMousePixelScroll", this.onWheel);
    }

    //links
    document.getElementById("dmitry").addEventListener("click", () => this.openLink("https://www.facebook.com/dmitry.ulmermorozov"));
    document.getElementById("maria").addEventListener("click", () => this.openLink("https://www.facebook.com/mmmirzametova"));
    document.getElementById("alexandr").addEventListener("click", () => this.openLink("https://www.facebook.com/nobodyroo"));
    document.getElementById("vadim").addEventListener("click", () => this.openLink("https://www.facebook.com/mirumirg"));
    document.getElementById("type-today-logo").addEventListener("click", () => this.openLink("https://type.today/ru/menoe"));

    let aboutEl = document.getElementById("about");

    document.getElementById("byInteractopusButton").addEventListener("click", () => {
      aboutEl.style.display = 'block';
    });

    document.getElementById("close-about-button").addEventListener("click", () => {
      aboutEl.style.display = 'none';
    });

    document.getElementById("clearButton").addEventListener("click", this.clearRotations);
  }

  clearRotations = (): void => {
    let colladers = this.colliders;
    let plate: Plate;
    for (let j = 0; j < colladers.length; j++) {
      plate = colladers[j].parent as Plate;
      plate.rotation.y = 0;
      plate.isInteractive = true;
      // debugger;
    }
  }

  openLink = (url: string): void => {
    let win = window.open(url, "_blank");
    win.focus();
  }

  fillSceneWithPlates = (): void => {
    const webGlScreenWidth = this.canvasWidth / 30;
    const webGlScreenHeight = this.canvasHeight / 30;

    const columnCount = Math.ceil(webGlScreenWidth / (this.cubeWidth + this.gap));
    const rowCount = Math.ceil(webGlScreenHeight / (this.cubeHeight + this.gap));

    console.log("plate count: " + columnCount * rowCount);
    const fullWidth = columnCount * this.cubeWidth + (columnCount - 1) * this.gap;
    const fullHeight = rowCount * this.cubeHeight + (rowCount - 1) * this.gap;

    for (let i = 0; i < columnCount; i++) {
      for (let j = 0; j < rowCount; j++) {

        let posX = i * (this.cubeWidth + this.gap) - fullWidth / 2 + this.cubeWidth / 2;
        let posY = j * (this.cubeHeight + this.gap) - fullHeight / 2 + this.cubeHeight / 2;
        let cube = this.createPlateMesh();

        cube.position.x = posX;
        cube.position.y = posY;

        this.scene.add(cube);
      }
    }
  }

  createPlateMesh = (): Plate => {
    let position = Math.round(Math.random() * (this.geometries.length - 1));

    let frontLetterGeometry = this.geometries[position];
    let backLetterGeometry = this.italicGeometries[position];

    let frontLetterMesh = new THREE.Mesh(frontLetterGeometry, this.frontLetterMaterial);
    let backLetterMesh = new THREE.Mesh(backLetterGeometry, this.backLetterMaterial);

    // debugger;
    frontLetterMesh.scale.set(this.fontGeomScale, this.fontGeomScale, 1);
    frontLetterMesh.updateMatrix();
    var frontBox = new THREE.Box3().setFromObject(frontLetterMesh).getSize();

    frontLetterMesh.position.x = -0.38 * this.cubeWidth;
    frontLetterMesh.position.y = 0.33 * this.cubeHeight;
    frontLetterMesh.position.z = this.cubeThick + this.cubeThick / 100;

    backLetterMesh.scale.set(this.fontGeomScale, this.fontGeomScale, 1);
    backLetterMesh.position.x = 0.38 * this.cubeWidth;
    backLetterMesh.position.y = 0.33 * this.cubeHeight;
    backLetterMesh.position.z = -this.cubeThick - this.cubeThick / 100;
    backLetterMesh.rotation.y = Math.PI;


    // complexMesh.position.z = 50;

    let cube = new THREE.Mesh(this.plateCubeGeometry, this.plateMaterial);
    cube.castShadow = false;
    cube.receiveShadow = false;

    let resultObject = new Plate();
    resultObject.isInteractive = true;

    resultObject.add(frontLetterMesh);
    resultObject.add(cube);
    resultObject.add(backLetterMesh);

    this.colliders.push(cube);

    return resultObject;
  }

  onDocumentMouseMove = (event: MouseEvent) => {
    if (this.mouse == undefined)
      this.mouse = new THREE.Vector2();

    let newMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    let newMouseY = - (event.clientY / window.innerHeight) * 2 + 1;

    this.mouseSpeed.x = Math.round(350 * (newMouseX - this.mouse.x));
    this.mouseSpeed.y = Math.round(350 * (newMouseY - this.mouse.y));

    this.mouse.x = newMouseX;
    this.mouse.y = newMouseY;

    // console.log("speed " + this.mouseSpeed.x);
    // console.log("movementX " + event.movementX);

    event.preventDefault();
  }

  onWheel = (event: WheelEvent) => {
    let deltaY: number;

    if (this.preciseZoomEnabled)
      deltaY = event.deltaY;
    else
      deltaY = Math.sign(event.deltaY);

    let newNormZoom = (this.normZoom + deltaY * this.zoomStep);

    newNormZoom = Math.round(newNormZoom * 1000) / 1000;

    if (newNormZoom < 0)
      newNormZoom = 0;

    if (newNormZoom > 1)
      newNormZoom = 1;

    if (newNormZoom == this.normZoom)
      return;

    this.normZoom = newNormZoom;

    let easingFunc: (t: number) => number;

    if (this.preciseZoomEnabled)
      easingFunc = t => t;
    else
      easingFunc = (t: number): number => { return t * t * t };

    let newZoomLevel = this.minZoom + easingFunc(newNormZoom) * (this.maxZoom - this.minZoom);

    newZoomLevel = Math.round(newZoomLevel * 100) / 100;
    console.log("normZoom " + this.normZoom + " | zoom  " + newZoomLevel);

    this.camera.zoom = newZoomLevel;
    this.camera.updateProjectionMatrix();
  }

  onDocumentMouseClick = (event: MouseEvent) => {
    let coord = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: - (event.clientY / window.innerHeight) * 2 + 1
    }

    this.raycaster.setFromCamera(coord, this.camera);

    var intersects = this.raycaster.intersectObjects(this.colliders, false);
    if (intersects.length < 1)
      return;

    let hitPlate = intersects[0].object.parent as Plate;
    let newRotation = 0;

    if (hitPlate.rotation.y == 0)
      newRotation = Math.PI;

    if (newRotation == hitPlate.rotation.y)
      return;

    var tween = new TWEEN.Tween({ y: hitPlate.rotation.y })
      .to({ y: newRotation }, 400)
      .on('update', object => {
        hitPlate.rotation.y = object.y;
      });

    tween.start();
    this.plateSound.play();
  }

  onTouchStart = (event: TouchEvent) => {
    if (this.mouse == undefined) {
      this.mouse = new THREE.Vector2();
    }

    let touchMoveEvent = event.touches[0];

    this.lastTouch.x = (touchMoveEvent.clientX / window.innerWidth) * 2 - 1;
    this.lastTouch.y = (touchMoveEvent.clientY / window.innerHeight) * 2 + 1;
  }

  onTouchMove = (event: TouchEvent) => {
    if (this.mouse == undefined) {
      this.mouse = new THREE.Vector2();
    }

    let touchMoveEvent = event.touches[0];

    event.preventDefault();

    this.mouse.x = (touchMoveEvent.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (touchMoveEvent.clientY / window.innerHeight) * 2 + 1;

    this.mouseSpeed.x = this.lastTouch.x - this.mouse.x;
    this.mouseSpeed.y = this.lastTouch.y - this.mouse.y;

    this.lastTouch.x = this.mouse.x;
    this.lastTouch.y = this.mouse.y;
  }


  calcNewRotationAngleFor = (currentRotation: number): number => {
    let zoomLevel = 10;
    let speedXMultiplier = 1600;
    let minPlateRotation = 110;
    let maxPlateRotation = 220;

    let speedX = this.mouseSpeed.x;
    let sign = Math.sign(this.mouseSpeed.x);

    let rotationAmplitude = Math.abs(speedX * zoomLevel);

    if (sign == 0) {
      sign = 1;
    }

    let rawRotation = currentRotation + sign * Math.round(minPlateRotation + rotationAmplitude);

    if (isNaN(rawRotation) || rawRotation == undefined) {
      rawRotation = 0;
    }

    let rotation = rawRotation % 360;
    let gapAmplitude = 30;

    var resultSign = Math.sign(rotation);

    if (Math.abs(rotation) > 90 - gapAmplitude && Math.abs(rotation) < 90 + gapAmplitude) {
      rotation = resultSign * (90 + gapAmplitude);
    } else if (Math.abs(rotation) > 270 - gapAmplitude && Math.abs(rotation) < 270 + gapAmplitude) {
      rotation = resultSign * (270 + gapAmplitude);
    }

    // if (rawRotation != 0 || rotation != 0)
    //   console.log(rawRotation + " ==> " + rotation);

    currentRotation = rotation;

    if (Math.abs(currentRotation) > maxPlateRotation) {
      currentRotation = Math.sign(currentRotation) * maxPlateRotation;
    }

    if (Math.abs(currentRotation) < minPlateRotation) {
      currentRotation = Math.sign(currentRotation) * minPlateRotation;
    }

    return currentRotation;
  }

  calcInteraction = (): void => {

    this.raycaster.setFromCamera(this.mouse, this.camera);

    var intersects = this.raycaster.intersectObjects(this.colliders, false);
    if (intersects.length > 0) {
      // debugger;

      let hitPlate = intersects[0].object.parent as Plate;

      if (hitPlate.isInteractive == false)
        return;

      if (this.INTERSECTED != hitPlate) {
        let angleFrom = hitPlate.rotation.y;
        let angleDegFrom = angleFrom * 180 / Math.PI;

        let angleDegTo = this.calcNewRotationAngleFor(angleFrom);
        let angleTo = angleDegTo * Math.PI / 180;

        if (angleDegFrom == angleDegTo)
          return;

        hitPlate.isInteractive = false;
        this.INTERSECTED = hitPlate;

        let obj = this.INTERSECTED;

        var tween = new TWEEN.Tween({ y: angleFrom })
          .to({ y: angleTo }, 400)
          .on('update', object => {
            obj.rotation.y = object.y;
          });
        tween.start();

        let audioPlayedDelay = Date.now() - this.lastFlipSoundPlayed;
        if (audioPlayedDelay > 100) {
          this.plateSound.play();
          this.lastFlipSoundPlayed = Date.now();
        }


      }

    } else {
      this.INTERSECTED = undefined;
    }
  }

  render = (): void => {
    TWEEN.update();
    // find intersections
    if (this.mouse != undefined) {
      this.calcInteraction();
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  }
}

let start = new AppComponent();
