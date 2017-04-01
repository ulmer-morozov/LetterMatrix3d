import { Component, ViewChild, ElementRef} from '@angular/core';
import * as THREE from 'three';

import { Plate } from "./Plate";
// import '@types/tweenjs';

declare function require(path: string): any;

var loadSvg = require('load-svg');
var parsePath = require('extract-svg-path').parse
var svgMesh3d = require('svg-mesh-3d')
var Complex = require('three-simplicial-complex')(THREE)


import { OrbitControls } from 'three-orbitcontrols-ts';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';

///// <reference types="tweenjs" />

declare var TWEEN;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('canvas') canvasRef: ElementRef;
  canvas: HTMLCanvasElement;

  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private raycaster: THREE.Raycaster;

  private mouse: THREE.Vector2;
  private mouseSpeed = new THREE.Vector2();
  private INTERSECTED: Plate;

  private normalMaterial = new THREE.MeshNormalMaterial();

  private geometries: THREE.Geometry[] = [];

  private colliders: THREE.Mesh[] = [];

  // colors
  private frontColor = 0xffffff;
  private backColor = 0x000000;
  private sideColor = 0x333333;

  // contants
  private cubeWidth = 0.8;
  private cubeHeight = 1.04;
  private cubeThick = 0.1;
  private gap = 0.05;
  private fontGeomScale = this.cubeWidth / 4.4;

  // shared objects
  private frontLetterMaterial: THREE.Material;
  private backLetterMaterial: THREE.Material;
  private plateMaterial: THREE.Material;
  private plateCubeGeometry: THREE.Geometry;

  constructor() {

  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.init();
  }

  init = (): void => {

    let showHelpers = false;

    let width = window.innerWidth;
    let height = window.innerHeight;

    this.scene = new THREE.Scene();

    if (showHelpers) {
      this.scene.add(new THREE.AxisHelper(50));
    }

    let zoom = window.devicePixelRatio;
    let ratio = width / height;

    // this.camera = new THREE.PerspectiveCamera(25, ratio, 1, 5000);

    const cameraFactor = 60;

    this.camera = new THREE.OrthographicCamera(-width / cameraFactor, width / cameraFactor, height / cameraFactor, -height / cameraFactor, 0, 100);

    this.camera.position.set(0, 0, 1);;

    this.raycaster = new THREE.Raycaster();

    this.renderer = new THREE.WebGLRenderer
      ({
        antialias: true,
        // alpha: true,
        // clearAlpha: 0.5,
        canvas: this.canvas
      });

    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.setSize(zoom * width, zoom * height, false);
    // this.renderer.setClearColor(0xfafafa, 1);

    // this.renderer.gammaInput = true;
    // this.renderer.gammaOutput = true;

    this.renderer.shadowMap.enabled = false;
    // this.renderer.shadowMapDebug = true;

    // renderer.shadowMapSoft = true;
    // this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // Управление мышкой
    this.controls = new OrbitControls(this.camera, this.canvas);

    this.plateCubeGeometry = new THREE.CubeGeometry(this.cubeWidth, this.cubeHeight, this.cubeThick);

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

    const webGlScreenWidth = width / 30;
    const webGlScreenHeight = height / 30;

    const columnCount = Math.ceil(webGlScreenWidth / (this.cubeWidth + this.gap));
    const rowCount = Math.ceil(webGlScreenHeight / (this.cubeHeight + this.gap));

    console.log("plate count: " + columnCount * rowCount);

    const fullWidth = columnCount * this.cubeWidth + (columnCount - 1) * this.gap;
    const fullHeight = rowCount * this.cubeHeight + (rowCount - 1) * this.gap;


    // var light = new THREE.DirectionalLight(0xffffff, 1);
    // light.position.set(1, 1, 1).normalize();
    // this.scene.add(light);

    let availableLetters = ["G", "j"];
    let loadedCount = 0;
    let currentPos = 0;


    let loadComplete = () => {
      // debugger;

      for (let i = 0; i < columnCount; i++) {
        for (let j = 0; j < rowCount; j++) {

          let posX = i * (this.cubeWidth + this.gap) - fullWidth / 2 ;
          let posY = j * (this.cubeHeight + this.gap) - fullHeight / 2;

          let cube = this.createPlateMesh();

          cube.position.x = posX;
          cube.position.y = posY;

          this.scene.add(cube);
        }
      }

      document.addEventListener('mousemove', this.onDocumentMouseMove, false);
      this.render();
    };

    let loadSymbol = () => {
      let letter = availableLetters[currentPos];
      let glyphPath = `assets/images/letter_${letter}.svg`;

      loadSvg(glyphPath, (err, svg): void => {
        if (err)
          throw err

        let svgPath = parsePath(svg);
        let rawGeometry = svgMesh3d(svgPath, {
          // delaunay: false,
          scale: 0.1,
          simplify: 0.01
        });
        // debugger;

        let complexGeometry: THREE.Geometry = Complex(rawGeometry);
        this.geometries[currentPos] = complexGeometry;

        currentPos++;
        if (currentPos < availableLetters.length)
          loadSymbol();
        else
          loadComplete();
      });
    };

    loadSymbol();
    // }

    // ];

    // loadSvg('assets/images/letter_G.svg', (err, svg): void => {
    //   if (err)
    //     throw err
    //
    //   let svgPath = parsePath(svg)
    //   let rawGeometry = svgMesh3d(svgPath, {
    //     // delaunay: false,
    //     scale: 1,
    //     simplify: 0.01
    //   });
    //   // debugger;
    //
    //   let complexGeometry: THREE.Geometry = Complex(rawGeometry);
    //   let material = new THREE.MeshNormalMaterial({ wireframe: false });
    //   material.side = THREE.BackSide;
    //
    //   let complexMesh = new THREE.Mesh(complexGeometry, material);
    //   // complexMesh.position.z = 50;
    //   this.scene.add(complexMesh);
    // })
  }

  // loadingFinished = () => {
  //   let normalMaterial = new THREE.MeshNormalMaterial();
  //   let wireframeMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
  //
  //   this.render();
  // }

  createPlateMesh = (): Plate => {

    let frontLetterGeometry = this.geometries[0];
    let backLetterGeometry = this.geometries[1];

    let frontLetterMesh = new THREE.Mesh(frontLetterGeometry, this.frontLetterMaterial);
    let backLetterMesh = new THREE.Mesh(backLetterGeometry, this.backLetterMaterial);

    frontLetterMesh.scale.set(this.fontGeomScale, this.fontGeomScale, 1);
    frontLetterMesh.position.z = this.cubeThick + this.cubeThick / 100;

    backLetterMesh.scale.set(this.fontGeomScale, this.fontGeomScale, 1);
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
    // var singleGeometry = new THREE.Geometry();
    //
    // cube.updateMatrix();
    // singleGeometry.merge(cube.geometry as THREE.Geometry, cube.matrix);
    //
    // frontLetterMesh.updateMatrix();
    // singleGeometry.merge(frontLetterMesh.geometry as THREE.Geometry, frontLetterMesh.matrix);
    //
    // backLetterMesh.updateMatrix();
    // singleGeometry.merge(backLetterMesh.geometry as THREE.Geometry, backLetterMesh.matrix);
    //
    //
    // let resultObject = new THREE.Mesh(singleGeometry, new THREE.MeshNormalMaterial());
  }

  onDocumentMouseMove = (event: MouseEvent) => {

    if (this.mouse == undefined) {
      this.mouse = new THREE.Vector2();
    }
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1.055;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1.055;

    this.mouseSpeed.x = event.movementX;
    this.mouseSpeed.y = event.movementY;

    // console.log(event.movementX, event.movementY);
    //
    // var vector = new THREE.Vector3();
    //
    // vector.set(
    //   (event.clientX / window.innerWidth) * 2 - 1,
    //   - (event.clientY / window.innerHeight) * 2 + 1,
    //   0.5);
    //
    // vector.unproject(this.camera);
    //
    // var dir = vector.sub(this.camera.position).normalize();
    // var distance = - this.camera.position.z / dir.z;
    //
    // var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
    // debugger;

    // this.mouse.x = pos.x;
    // this.mouse.y = pos.y;
  }

  calcNewRotationAngleFor = (currentRotation: number): number => {
    let zoomLevel = 10;
    let speedXMultiplier = 1600;
    let minPlateRotation = 110;
    let maxPlateRotation = 220;

    let speedX = this.mouseSpeed.x;

    // if (speedX != 0)
    //   debugger;

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

    var gapAmplitude = 30;

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
        hitPlate.isInteractive = false;

        this.INTERSECTED = hitPlate;
        // (this.INTERSECTED.material as THREE.MeshLambertMaterial).color.setHex(this.activeColor);


        let angleFrom = this.INTERSECTED.rotation.y;

        let angleDegFrom = angleFrom * 180 / Math.PI;
        let angleDegTo = this.calcNewRotationAngleFor(angleFrom);

        let angleTo = angleDegTo * Math.PI / 180;

        // console.log("rotation: "+ rotation);

        if (angleDegFrom == angleDegTo)
          return;

        let obj = this.INTERSECTED;

        var tween = new TWEEN.Tween({ y: angleFrom })
          .to({ y: angleTo }, 400)
          .on('update', object => {
            obj.rotation.y = object.y;
          })

        // tween.on("complete", () => {
        //   let plateIsOnFrontSide = (angleDegTo > -90 && angleDegTo < 90) || Math.abs(angleDegTo) > 270;
        //
        //   if (plateIsOnFrontSide)
        //     debugger;
        //   hitPlate.isInteractive = plateIsOnFrontSide;
        // })
        tween.start();


      }

    } else {
      // if (this.INTERSECTED)
      //   (this.INTERSECTED.material as THREE.MeshLambertMaterial).color.setHex(0x0000ff);

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

interface ILetterPlate {
  rotation: number;
  frontSymbol: string;
  backSymbol: string;
  isActive: boolean;
  transform: any;
}
