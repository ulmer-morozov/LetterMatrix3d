import { Component, ViewChild, ElementRef} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
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
  private cubeHeight = 1.04;
  private cubeThick = 0.1;
  private gap = 0.05;
  private fontGeomScale = 0.03;

  // shared objects
  private frontLetterMaterial: THREE.Material;
  private backLetterMaterial: THREE.Material;
  private plateMaterial: THREE.Material;
  private plateCubeGeometry: THREE.Geometry;

  private canvasWidth: number;
  private canvasHeight: number;

  private availableLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZабвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

  constructor(private http: Http) {

  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.init();
  }

  init = (): void => {

    let showHelpers = false;

    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;

    this.scene = new THREE.Scene();

    if (showHelpers) {
      this.scene.add(new THREE.AxisHelper(50));
    }

    let zoom = window.devicePixelRatio;
    let ratio = this.canvasWidth / this.canvasHeight;

    this.camera = new THREE.PerspectiveCamera(25, ratio, 1, 5000);

    // const cameraFactor = 60;
    // this.camera = new THREE.OrthographicCamera(-width / cameraFactor, width / cameraFactor, height / cameraFactor, -height / cameraFactor, 0, 100);

    this.camera.position.set(0, 0, 55);;

    this.raycaster = new THREE.Raycaster();

    this.renderer = new THREE.WebGLRenderer
      ({
        antialias: true,
        canvas: this.canvas
      });

    this.renderer.setSize(zoom * this.canvasWidth, zoom * this.canvasHeight, false);
    this.renderer.shadowMap.enabled = false;

    // Управление мышкой
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enabled = !this.isMobile();

    this.plateCubeGeometry = new THREE.CubeGeometry(this.cubeWidth, this.cubeHeight, this.cubeThick);
    this.prepareMaterials();

    this.loadAdaptedGeometries();

    // this.loadSvgGeometries();
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
    let loadingFault = (error) => {
      error => console.log(error);
    };

    let loadingComplete = (response: Response): void => {
      let data = response.json();

      let letterGeomInComplexes: any[] = data.letterGeomInComplexes;
      let italicLetterGeomInComplexes: any[] = data.italicLetterGeomInComplexes;

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

    this.http
      .get("./assets/letter_geometries.json")
      .subscribe(loadingComplete, loadingFault);
  }

  completeSceneGeneration = (): void => {
    this.fillSceneWithPlates();
    this.bindEvents();
    this.render();
  }

  bindEvents = (): void => {
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
    document.addEventListener("touchstart", this.onTouchStart, false);
    document.addEventListener("touchmove", this.onTouchMove, false);
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

        let posX = i * (this.cubeWidth + this.gap) - fullWidth / 2;
        let posY = j * (this.cubeHeight + this.gap) - fullHeight / 2;

        let cube = this.createPlateMesh();

        cube.position.x = posX;
        cube.position.y = posY;

        this.scene.add(cube);
      }
    }
  }

  loadSvgGeometries = (exportGeometriesAfterLoad: boolean = false): void => {
    let currentPos = 0;

    let letterGeomInComplexes = [];
    let italicLetterGeomInComplexes = [];

    let loadComplete = () => {
      this.completeSceneGeneration();

      if (exportGeometriesAfterLoad) {
        var geometryData = {
          letterGeomInComplexes: letterGeomInComplexes,
          italicLetterGeomInComplexes: italicLetterGeomInComplexes
        };
        let rawGeometryJson = JSON.stringify(geometryData);
        this.download(`letter_geometries.json`, rawGeometryJson);
      }
    };


    let loadSymbol = (isItalic: boolean) => {
      let letter = this.availableLetters[currentPos];
      let letterCode = letter.charCodeAt(0);

      let italicText = isItalic ? "_italic" : "";
      let glyphName = `letter_${letterCode}${italicText}_converted.svg`;
      let glyphPath = `assets/images/${glyphName}`;

      loadSvg(glyphPath, (err, svg): void => {
        if (err)
          throw err

        let svgPath = parsePath(svg);
        let rawGeometry = svgMesh3d(svgPath, {
          // delaunay: false,
          scale: 10,
          simplify: 0.01,
          normalize: false
        });

        let complexGeometry: THREE.Geometry = Complex(rawGeometry);

        if (isItalic) {
          this.italicGeometries[currentPos] = complexGeometry;
          letterGeomInComplexes.push(rawGeometry);
        } else {
          this.geometries[currentPos] = complexGeometry;
          italicLetterGeomInComplexes.push(rawGeometry);
        }

        if (isItalic == false) {
          loadSymbol(true);
        } else {
          currentPos++;
          if (currentPos < this.availableLetters.length)
            loadSymbol(false);
          else
            loadComplete();
        }
      });
    };

    loadSymbol(false);
  }

  createPlateMesh = (): Plate => {
    let position = Math.round(Math.random() * (this.geometries.length - 1));

    let frontLetterGeometry = this.geometries[position];
    let backLetterGeometry = this.italicGeometries[position];

    let frontLetterMesh = new THREE.Mesh(frontLetterGeometry, this.frontLetterMaterial);
    let backLetterMesh = new THREE.Mesh(backLetterGeometry, this.backLetterMaterial);

    frontLetterMesh.scale.set(this.fontGeomScale, this.fontGeomScale, 1);
    frontLetterMesh.position.x = -0.3;
    frontLetterMesh.position.y = 0.4;
    frontLetterMesh.position.z = this.cubeThick + this.cubeThick / 100;

    backLetterMesh.scale.set(this.fontGeomScale, this.fontGeomScale, 1);
    backLetterMesh.position.x = 0.3;
    backLetterMesh.position.y = 0.4;
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
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    this.mouseSpeed.x = event.movementX;
    this.mouseSpeed.y = event.movementY;
  }

  onTouchStart = (event: TouchEvent) => {
    if (this.mouse == undefined) {
      this.mouse = new THREE.Vector2();
    }

    let touchMoveEvent = event.touches[0];

    this.lastTouch.x = (touchMoveEvent.clientX / window.innerWidth) * 2 - 1;
    this.lastTouch.y = (touchMoveEvent.clientY / window.innerHeight) * 2 + 1;

    // console.log("touchStart: " + JSON.stringify(this.lastTouch));
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

    this.lastTouch.x = (touchMoveEvent.clientX / window.innerWidth) * 2 - 1;
    this.lastTouch.y = (touchMoveEvent.clientY / window.innerHeight) * 2 + 1;
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

  isMobile = (): boolean => {
    var check = false;
    (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || (window as any).opera);
    return check;
  };

  download = (filename: string, text: string): void => {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    }
    else {
      pom.click();
    }
  }

}

interface ILetterPlate {
  rotation: number;
  frontSymbol: string;
  backSymbol: string;
  isActive: boolean;
  transform: any;
}
