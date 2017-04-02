webpackJsonp([1,4],{

/***/ 312:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 312;


/***/ }),

/***/ 313:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(423);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(424);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 421:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_three__ = __webpack_require__(200);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Plate; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var Plate = (function (_super) {
    __extends(Plate, _super);
    function Plate() {
        _super.call(this);
    }
    return Plate;
}(__WEBPACK_IMPORTED_MODULE_0_three__["Object3D"]));
//# sourceMappingURL=Plate.js.map

/***/ }),

/***/ 422:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_three__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Plate__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_three_orbitcontrols_ts__ = __webpack_require__(544);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_three_orbitcontrols_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_three_orbitcontrols_ts__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var loadSvg = __webpack_require__(511);
var parsePath = __webpack_require__(504).parse;
var svgMesh3d = __webpack_require__(542);
var Complex = __webpack_require__(545)(__WEBPACK_IMPORTED_MODULE_1_three__);

var AppComponent = (function () {
    function AppComponent() {
        var _this = this;
        this.mouseSpeed = new __WEBPACK_IMPORTED_MODULE_1_three__["Vector2"]();
        this.normalMaterial = new __WEBPACK_IMPORTED_MODULE_1_three__["MeshNormalMaterial"]();
        this.geometries = [];
        this.colliders = [];
        // colors
        this.frontColor = 0xffffff;
        this.backColor = 0x000000;
        this.sideColor = 0x333333;
        // contants
        this.cubeWidth = 0.8;
        this.cubeHeight = 1.04;
        this.cubeThick = 0.1;
        this.gap = 0.05;
        this.fontGeomScale = this.cubeWidth / 4.4;
        this.init = function () {
            var showHelpers = false;
            var width = window.innerWidth;
            var height = window.innerHeight;
            _this.scene = new __WEBPACK_IMPORTED_MODULE_1_three__["Scene"]();
            if (showHelpers) {
                _this.scene.add(new __WEBPACK_IMPORTED_MODULE_1_three__["AxisHelper"](50));
            }
            var zoom = window.devicePixelRatio;
            var ratio = width / height;
            _this.camera = new __WEBPACK_IMPORTED_MODULE_1_three__["PerspectiveCamera"](25, ratio, 1, 5000);
            var cameraFactor = 60;
            // this.camera = new THREE.OrthographicCamera(-width / cameraFactor, width / cameraFactor, height / cameraFactor, -height / cameraFactor, 0, 100);
            _this.camera.position.set(0, 0, 55);
            ;
            _this.raycaster = new __WEBPACK_IMPORTED_MODULE_1_three__["Raycaster"]();
            _this.renderer = new __WEBPACK_IMPORTED_MODULE_1_three__["WebGLRenderer"]({
                antialias: true,
                // alpha: true,
                // clearAlpha: 0.5,
                canvas: _this.canvas
            });
            // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            _this.renderer.setSize(zoom * width, zoom * height, false);
            // this.renderer.setClearColor(0xfafafa, 1);
            // this.renderer.gammaInput = true;
            // this.renderer.gammaOutput = true;
            _this.renderer.shadowMap.enabled = false;
            // this.renderer.shadowMapDebug = true;
            // renderer.shadowMapSoft = true;
            // this.renderer.shadowMap.type = THREE.PCFShadowMap;
            // Управление мышкой
            _this.controls = new __WEBPACK_IMPORTED_MODULE_3_three_orbitcontrols_ts__["OrbitControls"](_this.camera, _this.canvas);
            _this.plateCubeGeometry = new __WEBPACK_IMPORTED_MODULE_1_three__["CubeGeometry"](_this.cubeWidth, _this.cubeHeight, _this.cubeThick);
            _this.plateMaterial = new __WEBPACK_IMPORTED_MODULE_1_three__["MultiMaterial"]([
                new __WEBPACK_IMPORTED_MODULE_1_three__["MeshBasicMaterial"]({ color: _this.sideColor }),
                new __WEBPACK_IMPORTED_MODULE_1_three__["MeshBasicMaterial"]({ color: _this.sideColor }),
                new __WEBPACK_IMPORTED_MODULE_1_three__["MeshBasicMaterial"]({ color: _this.sideColor }),
                new __WEBPACK_IMPORTED_MODULE_1_three__["MeshBasicMaterial"]({ color: _this.sideColor }),
                new __WEBPACK_IMPORTED_MODULE_1_three__["MeshBasicMaterial"]({ color: _this.frontColor }),
                new __WEBPACK_IMPORTED_MODULE_1_three__["MeshBasicMaterial"]({ color: _this.backColor })
            ]);
            _this.frontLetterMaterial = new __WEBPACK_IMPORTED_MODULE_1_three__["MeshBasicMaterial"]({ color: 0x000000, wireframe: false, side: __WEBPACK_IMPORTED_MODULE_1_three__["BackSide"] });
            _this.backLetterMaterial = new __WEBPACK_IMPORTED_MODULE_1_three__["MeshBasicMaterial"]({ color: 0xffffff, wireframe: false, side: __WEBPACK_IMPORTED_MODULE_1_three__["BackSide"] });
            var webGlScreenWidth = width / 30;
            var webGlScreenHeight = height / 30;
            var columnCount = Math.ceil(webGlScreenWidth / (_this.cubeWidth + _this.gap));
            var rowCount = Math.ceil(webGlScreenHeight / (_this.cubeHeight + _this.gap));
            console.log("plate count: " + columnCount * rowCount);
            var fullWidth = columnCount * _this.cubeWidth + (columnCount - 1) * _this.gap;
            var fullHeight = rowCount * _this.cubeHeight + (rowCount - 1) * _this.gap;
            // var light = new THREE.DirectionalLight(0xffffff, 1);
            // light.position.set(1, 1, 1).normalize();
            // this.scene.add(light);
            var availableLetters = ["G", "j"];
            var loadedCount = 0;
            var currentPos = 0;
            var loadComplete = function () {
                // debugger;
                for (var i = 0; i < columnCount; i++) {
                    for (var j = 0; j < rowCount; j++) {
                        var posX = i * (_this.cubeWidth + _this.gap) - fullWidth / 2;
                        var posY = j * (_this.cubeHeight + _this.gap) - fullHeight / 2;
                        var cube = _this.createPlateMesh();
                        cube.position.x = posX;
                        cube.position.y = posY;
                        _this.scene.add(cube);
                    }
                }
                document.addEventListener('mousemove', _this.onDocumentMouseMove, false);
                _this.render();
            };
            var loadSymbol = function () {
                var letter = availableLetters[currentPos];
                var glyphPath = "assets/images/letter_" + letter + ".svg";
                loadSvg(glyphPath, function (err, svg) {
                    if (err)
                        throw err;
                    var svgPath = parsePath(svg);
                    var rawGeometry = svgMesh3d(svgPath, {
                        // delaunay: false,
                        scale: 1,
                        simplify: 0.01
                    });
                    // debugger;
                    var complexGeometry = Complex(rawGeometry);
                    _this.geometries[currentPos] = complexGeometry;
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
        };
        // loadingFinished = () => {
        //   let normalMaterial = new THREE.MeshNormalMaterial();
        //   let wireframeMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
        //
        //   this.render();
        // }
        this.createPlateMesh = function () {
            var frontLetterGeometry = _this.geometries[0];
            var backLetterGeometry = _this.geometries[1];
            var frontLetterMesh = new __WEBPACK_IMPORTED_MODULE_1_three__["Mesh"](frontLetterGeometry, _this.frontLetterMaterial);
            var backLetterMesh = new __WEBPACK_IMPORTED_MODULE_1_three__["Mesh"](backLetterGeometry, _this.backLetterMaterial);
            frontLetterMesh.scale.set(_this.fontGeomScale, _this.fontGeomScale, 1);
            frontLetterMesh.position.z = _this.cubeThick + _this.cubeThick / 100;
            backLetterMesh.scale.set(_this.fontGeomScale, _this.fontGeomScale, 1);
            backLetterMesh.position.z = -_this.cubeThick - _this.cubeThick / 100;
            backLetterMesh.rotation.y = Math.PI;
            // complexMesh.position.z = 50;
            var cube = new __WEBPACK_IMPORTED_MODULE_1_three__["Mesh"](_this.plateCubeGeometry, _this.plateMaterial);
            cube.castShadow = false;
            cube.receiveShadow = false;
            var resultObject = new __WEBPACK_IMPORTED_MODULE_2__Plate__["a" /* Plate */]();
            resultObject.isInteractive = true;
            resultObject.add(frontLetterMesh);
            resultObject.add(cube);
            resultObject.add(backLetterMesh);
            _this.colliders.push(cube);
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
        };
        this.onDocumentMouseMove = function (event) {
            if (_this.mouse == undefined) {
                _this.mouse = new __WEBPACK_IMPORTED_MODULE_1_three__["Vector2"]();
            }
            event.preventDefault();
            _this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            _this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            _this.mouseSpeed.x = event.movementX;
            _this.mouseSpeed.y = event.movementY;
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
        };
        this.calcNewRotationAngleFor = function (currentRotation) {
            var zoomLevel = 10;
            var speedXMultiplier = 1600;
            var minPlateRotation = 110;
            var maxPlateRotation = 220;
            var speedX = _this.mouseSpeed.x;
            // if (speedX != 0)
            //   debugger;
            var sign = Math.sign(_this.mouseSpeed.x);
            var rotationAmplitude = Math.abs(speedX * zoomLevel);
            if (sign == 0) {
                sign = 1;
            }
            var rawRotation = currentRotation + sign * Math.round(minPlateRotation + rotationAmplitude);
            if (isNaN(rawRotation) || rawRotation == undefined) {
                rawRotation = 0;
            }
            var rotation = rawRotation % 360;
            var gapAmplitude = 30;
            var resultSign = Math.sign(rotation);
            if (Math.abs(rotation) > 90 - gapAmplitude && Math.abs(rotation) < 90 + gapAmplitude) {
                rotation = resultSign * (90 + gapAmplitude);
            }
            else if (Math.abs(rotation) > 270 - gapAmplitude && Math.abs(rotation) < 270 + gapAmplitude) {
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
        };
        this.calcInteraction = function () {
            _this.raycaster.setFromCamera(_this.mouse, _this.camera);
            var intersects = _this.raycaster.intersectObjects(_this.colliders, false);
            if (intersects.length > 0) {
                // debugger;
                var hitPlate = intersects[0].object.parent;
                if (hitPlate.isInteractive == false)
                    return;
                if (_this.INTERSECTED != hitPlate) {
                    hitPlate.isInteractive = false;
                    _this.INTERSECTED = hitPlate;
                    // (this.INTERSECTED.material as THREE.MeshLambertMaterial).color.setHex(this.activeColor);
                    var angleFrom = _this.INTERSECTED.rotation.y;
                    var angleDegFrom = angleFrom * 180 / Math.PI;
                    var angleDegTo = _this.calcNewRotationAngleFor(angleFrom);
                    var angleTo = angleDegTo * Math.PI / 180;
                    // console.log("rotation: "+ rotation);
                    if (angleDegFrom == angleDegTo)
                        return;
                    var obj_1 = _this.INTERSECTED;
                    var tween = new TWEEN.Tween({ y: angleFrom })
                        .to({ y: angleTo }, 400)
                        .on('update', function (object) {
                        obj_1.rotation.y = object.y;
                    });
                    // tween.on("complete", () => {
                    //   let plateIsOnFrontSide = (angleDegTo > -90 && angleDegTo < 90) || Math.abs(angleDegTo) > 270;
                    //
                    //   if (plateIsOnFrontSide)
                    //     debugger;
                    //   hitPlate.isInteractive = plateIsOnFrontSide;
                    // })
                    tween.start();
                }
            }
            else {
                // if (this.INTERSECTED)
                //   (this.INTERSECTED.material as THREE.MeshLambertMaterial).color.setHex(0x0000ff);
                _this.INTERSECTED = undefined;
            }
        };
        this.render = function () {
            TWEEN.update();
            // find intersections
            if (_this.mouse != undefined) {
                _this.calcInteraction();
            }
            _this.renderer.render(_this.scene, _this.camera);
            requestAnimationFrame(_this.render);
        };
    }
    AppComponent.prototype.ngAfterViewInit = function () {
        this.canvas = this.canvasRef.nativeElement;
        this.init();
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* ViewChild */])('canvas'), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["h" /* ElementRef */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["h" /* ElementRef */]) === 'function' && _a) || Object)
    ], AppComponent.prototype, "canvasRef", void 0);
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(525),
            styles: [__webpack_require__(503)]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 423:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(391);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(422);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* ReactiveFormsModule */]
            ],
            // exports: [],
            providers: [],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 424:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 503:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(196)();
// imports


// module
exports.push([module.i, "canvas {\n  height: 100vh;\n  width: 100vw;\n  display: block;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 525:
/***/ (function(module, exports) {

module.exports = "<canvas id=\"canvas3d\" width=\"200\" height=\"100\" #canvas></canvas>\n"

/***/ }),

/***/ 556:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(313);


/***/ })

},[556]);
//# sourceMappingURL=main.bundle.js.map