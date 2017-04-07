webpackJsonp([1,4],{

/***/ 313:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 313;


/***/ }),

/***/ 314:
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(267);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_three__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Plate__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_three_orbitcontrols_ts__ = __webpack_require__(544);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_three_orbitcontrols_ts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_three_orbitcontrols_ts__);
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
var Complex = __webpack_require__(545)(__WEBPACK_IMPORTED_MODULE_2_three__);

var AppComponent = (function () {
    function AppComponent(http) {
        var _this = this;
        this.http = http;
        this.mouseSpeed = new __WEBPACK_IMPORTED_MODULE_2_three__["Vector2"]();
        this.lastTouch = new __WEBPACK_IMPORTED_MODULE_2_three__["Vector2"]();
        this.touchSpeed = new __WEBPACK_IMPORTED_MODULE_2_three__["Vector2"]();
        this.normalMaterial = new __WEBPACK_IMPORTED_MODULE_2_three__["MeshNormalMaterial"]();
        this.geometries = [];
        this.italicGeometries = [];
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
        this.fontGeomScale = 0.03;
        this.availableLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZабвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
        this.init = function () {
            var showHelpers = false;
            _this.canvasWidth = window.innerWidth;
            _this.canvasHeight = window.innerHeight;
            _this.scene = new __WEBPACK_IMPORTED_MODULE_2_three__["Scene"]();
            if (showHelpers) {
                _this.scene.add(new __WEBPACK_IMPORTED_MODULE_2_three__["AxisHelper"](50));
            }
            var zoom = window.devicePixelRatio;
            var ratio = _this.canvasWidth / _this.canvasHeight;
            _this.camera = new __WEBPACK_IMPORTED_MODULE_2_three__["PerspectiveCamera"](25, ratio, 1, 5000);
            // const cameraFactor = 60;
            // this.camera = new THREE.OrthographicCamera(-width / cameraFactor, width / cameraFactor, height / cameraFactor, -height / cameraFactor, 0, 100);
            _this.camera.position.set(0, 0, 55);
            ;
            _this.raycaster = new __WEBPACK_IMPORTED_MODULE_2_three__["Raycaster"]();
            _this.renderer = new __WEBPACK_IMPORTED_MODULE_2_three__["WebGLRenderer"]({
                antialias: true,
                canvas: _this.canvas
            });
            _this.renderer.setSize(zoom * _this.canvasWidth, zoom * _this.canvasHeight, false);
            _this.renderer.shadowMap.enabled = false;
            // Управление мышкой
            _this.controls = new __WEBPACK_IMPORTED_MODULE_4_three_orbitcontrols_ts__["OrbitControls"](_this.camera, _this.canvas);
            _this.controls.enabled = !_this.isMobile();
            _this.plateCubeGeometry = new __WEBPACK_IMPORTED_MODULE_2_three__["CubeGeometry"](_this.cubeWidth, _this.cubeHeight, _this.cubeThick);
            _this.prepareMaterials();
            _this.loadAdaptedGeometries();
            // this.loadSvgGeometries();
        };
        this.prepareMaterials = function () {
            _this.plateMaterial = new __WEBPACK_IMPORTED_MODULE_2_three__["MultiMaterial"]([
                new __WEBPACK_IMPORTED_MODULE_2_three__["MeshBasicMaterial"]({ color: _this.sideColor }),
                new __WEBPACK_IMPORTED_MODULE_2_three__["MeshBasicMaterial"]({ color: _this.sideColor }),
                new __WEBPACK_IMPORTED_MODULE_2_three__["MeshBasicMaterial"]({ color: _this.sideColor }),
                new __WEBPACK_IMPORTED_MODULE_2_three__["MeshBasicMaterial"]({ color: _this.sideColor }),
                new __WEBPACK_IMPORTED_MODULE_2_three__["MeshBasicMaterial"]({ color: _this.frontColor }),
                new __WEBPACK_IMPORTED_MODULE_2_three__["MeshBasicMaterial"]({ color: _this.backColor })
            ]);
            _this.frontLetterMaterial = new __WEBPACK_IMPORTED_MODULE_2_three__["MeshBasicMaterial"]({ color: 0x000000, wireframe: false, side: __WEBPACK_IMPORTED_MODULE_2_three__["BackSide"] });
            _this.backLetterMaterial = new __WEBPACK_IMPORTED_MODULE_2_three__["MeshBasicMaterial"]({ color: 0xffffff, wireframe: false, side: __WEBPACK_IMPORTED_MODULE_2_three__["BackSide"] });
        };
        this.loadAdaptedGeometries = function () {
            var loadingFault = function (error) {
                (function (error) { return console.log(error); });
            };
            var loadingComplete = function (response) {
                var data = response.json();
                var letterGeomInComplexes = data.italicLetterGeomInComplexes;
                var italicLetterGeomInComplexes = data.letterGeomInComplexes;
                for (var j = 0; j < letterGeomInComplexes.length; j++) {
                    var regularComplexGeometry = letterGeomInComplexes[j];
                    var italicComplexGeometry = italicLetterGeomInComplexes[j];
                    var regularGeometry = Complex(regularComplexGeometry);
                    var italicGeometry = Complex(italicComplexGeometry);
                    _this.geometries[j] = regularGeometry;
                    _this.italicGeometries[j] = italicGeometry;
                }
                _this.completeSceneGeneration();
            };
            _this.http
                .get("./assets/letter_geometries.json")
                .subscribe(loadingComplete, loadingFault);
        };
        this.completeSceneGeneration = function () {
            _this.fillSceneWithPlates();
            _this.bindEvents();
            _this.render();
        };
        this.bindEvents = function () {
            document.addEventListener('click', _this.onDocumentMouseClick, false);
            document.addEventListener('mousemove', _this.onDocumentMouseMove, false);
            document.addEventListener("touchstart", _this.onTouchStart, false);
            document.addEventListener("touchmove", _this.onTouchMove, false);
        };
        this.fillSceneWithPlates = function () {
            var webGlScreenWidth = _this.canvasWidth / 30;
            var webGlScreenHeight = _this.canvasHeight / 30;
            var columnCount = Math.ceil(webGlScreenWidth / (_this.cubeWidth + _this.gap));
            var rowCount = Math.ceil(webGlScreenHeight / (_this.cubeHeight + _this.gap));
            console.log("plate count: " + columnCount * rowCount);
            var fullWidth = columnCount * _this.cubeWidth + (columnCount - 1) * _this.gap;
            var fullHeight = rowCount * _this.cubeHeight + (rowCount - 1) * _this.gap;
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
        };
        this.loadSvgGeometries = function (exportGeometriesAfterLoad) {
            if (exportGeometriesAfterLoad === void 0) { exportGeometriesAfterLoad = false; }
            var currentPos = 0;
            var letterGeomInComplexes = [];
            var italicLetterGeomInComplexes = [];
            var loadComplete = function () {
                _this.completeSceneGeneration();
                if (exportGeometriesAfterLoad) {
                    var geometryData = {
                        letterGeomInComplexes: letterGeomInComplexes,
                        italicLetterGeomInComplexes: italicLetterGeomInComplexes
                    };
                    var rawGeometryJson = JSON.stringify(geometryData);
                    _this.download("letter_geometries.json", rawGeometryJson);
                }
            };
            var loadSymbol = function (isItalic) {
                var letter = _this.availableLetters[currentPos];
                var letterCode = letter.charCodeAt(0);
                var italicText = isItalic ? "_italic" : "";
                var glyphName = "letter_" + letterCode + italicText + "_converted.svg";
                var glyphPath = "assets/images/" + glyphName;
                loadSvg(glyphPath, function (err, svg) {
                    if (err)
                        throw err;
                    var svgPath = parsePath(svg);
                    var rawGeometry = svgMesh3d(svgPath, {
                        // delaunay: false,
                        scale: 10,
                        simplify: 0.01,
                        normalize: false
                    });
                    var complexGeometry = Complex(rawGeometry);
                    if (isItalic) {
                        _this.italicGeometries[currentPos] = complexGeometry;
                        letterGeomInComplexes.push(rawGeometry);
                    }
                    else {
                        _this.geometries[currentPos] = complexGeometry;
                        italicLetterGeomInComplexes.push(rawGeometry);
                    }
                    if (isItalic == false) {
                        loadSymbol(true);
                    }
                    else {
                        currentPos++;
                        if (currentPos < _this.availableLetters.length)
                            loadSymbol(false);
                        else
                            loadComplete();
                    }
                });
            };
            loadSymbol(false);
        };
        this.createPlateMesh = function () {
            var position = Math.round(Math.random() * (_this.geometries.length - 1));
            var frontLetterGeometry = _this.geometries[position];
            var backLetterGeometry = _this.italicGeometries[position];
            var frontLetterMesh = new __WEBPACK_IMPORTED_MODULE_2_three__["Mesh"](frontLetterGeometry, _this.frontLetterMaterial);
            var backLetterMesh = new __WEBPACK_IMPORTED_MODULE_2_three__["Mesh"](backLetterGeometry, _this.backLetterMaterial);
            frontLetterMesh.scale.set(_this.fontGeomScale, _this.fontGeomScale, 1);
            frontLetterMesh.position.x = -0.3;
            frontLetterMesh.position.y = 0.4;
            frontLetterMesh.position.z = _this.cubeThick + _this.cubeThick / 100;
            backLetterMesh.scale.set(_this.fontGeomScale, _this.fontGeomScale, 1);
            backLetterMesh.position.x = 0.3;
            backLetterMesh.position.y = 0.4;
            backLetterMesh.position.z = -_this.cubeThick - _this.cubeThick / 100;
            backLetterMesh.rotation.y = Math.PI;
            // complexMesh.position.z = 50;
            var cube = new __WEBPACK_IMPORTED_MODULE_2_three__["Mesh"](_this.plateCubeGeometry, _this.plateMaterial);
            cube.castShadow = false;
            cube.receiveShadow = false;
            var resultObject = new __WEBPACK_IMPORTED_MODULE_3__Plate__["a" /* Plate */]();
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
                _this.mouse = new __WEBPACK_IMPORTED_MODULE_2_three__["Vector2"]();
            }
            event.preventDefault();
            _this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            _this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            _this.mouseSpeed.x = event.movementX;
            _this.mouseSpeed.y = event.movementY;
        };
        this.onDocumentMouseClick = function (event) {
            var coord = {
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1
            };
            _this.raycaster.setFromCamera(coord, _this.camera);
            var intersects = _this.raycaster.intersectObjects(_this.colliders, false);
            if (intersects.length < 1)
                return;
            var hitPlate = intersects[0].object.parent;
            debugger;
        };
        this.onTouchStart = function (event) {
            if (_this.mouse == undefined) {
                _this.mouse = new __WEBPACK_IMPORTED_MODULE_2_three__["Vector2"]();
            }
            var touchMoveEvent = event.touches[0];
            _this.lastTouch.x = (touchMoveEvent.clientX / window.innerWidth) * 2 - 1;
            _this.lastTouch.y = (touchMoveEvent.clientY / window.innerHeight) * 2 + 1;
            // console.log("touchStart: " + JSON.stringify(this.lastTouch));
        };
        this.onTouchMove = function (event) {
            if (_this.mouse == undefined) {
                _this.mouse = new __WEBPACK_IMPORTED_MODULE_2_three__["Vector2"]();
            }
            var touchMoveEvent = event.touches[0];
            event.preventDefault();
            _this.mouse.x = (touchMoveEvent.clientX / window.innerWidth) * 2 - 1;
            _this.mouse.y = -(touchMoveEvent.clientY / window.innerHeight) * 2 + 1;
            _this.mouseSpeed.x = _this.lastTouch.x - _this.mouse.x;
            _this.mouseSpeed.y = _this.lastTouch.y - _this.mouse.y;
            _this.lastTouch.x = (touchMoveEvent.clientX / window.innerWidth) * 2 - 1;
            _this.lastTouch.y = (touchMoveEvent.clientY / window.innerHeight) * 2 + 1;
        };
        this.calcNewRotationAngleFor = function (currentRotation) {
            var zoomLevel = 10;
            var speedXMultiplier = 1600;
            var minPlateRotation = 110;
            var maxPlateRotation = 220;
            var speedX = _this.mouseSpeed.x;
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
                    var angleFrom = hitPlate.rotation.y;
                    var angleDegFrom = angleFrom * 180 / Math.PI;
                    var angleDegTo = _this.calcNewRotationAngleFor(angleFrom);
                    var angleTo = angleDegTo * Math.PI / 180;
                    if (angleDegFrom == angleDegTo)
                        return;
                    hitPlate.isInteractive = false;
                    _this.INTERSECTED = hitPlate;
                    var obj_1 = _this.INTERSECTED;
                    var tween = new TWEEN.Tween({ y: angleFrom })
                        .to({ y: angleTo }, 400)
                        .on('update', function (object) {
                        obj_1.rotation.y = object.y;
                    });
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
        this.isMobile = function () {
            var check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        };
        this.download = function (filename, text) {
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
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === 'function' && _b) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
}());
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 423:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(267);
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

module.exports = __webpack_require__(314);


/***/ })

},[556]);
//# sourceMappingURL=main.bundle.js.map