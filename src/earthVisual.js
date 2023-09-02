var THREE: any;

module powerbi.visuals {
    export class YourVisual implements IVisual {
        private baseUrl = 'https://dl.dropboxusercontent.com/u/193121/earth/';
        private viewport: IViewport;
        private container: JQuery;
        private camera: any;
        private renderer: any;
        private scene: any;
        private controls: any;

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Category',
                    kind: powerbi.VisualDataRoleKind.Grouping,
                },
                {
                    name: 'Y',
                    kind: powerbi.VisualDataRoleKind.Measure,
                },
            ],
            dataViewMappings: [{
                categories: {
                    for: { in: 'Category' },
                    dataReductionAlgorithm: { top: {} }
                },
                values: {
                    select: [{ bind: { to: 'Y' } }]
                },
            }],
        };

        public static converter(dataView: DataView): any {
            window.console.log('converter', dataView);
            return {};
        }

        public init(options: VisualInitOptions): void {
            this.container = options.element;
            this.viewport = options.viewport;

           if(!THREE) {
                $.getScript(this.baseUrl + 'three.js', () => {
                    console.log('loaded');
                    this.initScene();
                });
           } else {
                this.initScene();
           }


            //options.element.append($('<a href="#">asdfasdf</a>'));
            window.console.log('init', options.element);
        }

        private initScene() {
            var viewport = this.viewport
            var renderer = this.renderer = new THREE.WebGLRenderer()
            var camera = this.camera = new THREE.PerspectiveCamera(45, viewport.width / viewport.height, 0.1, 1000)
            var controls = this.controls = new THREE.TrackballControls(camera)
            var scene = this.scene = new THREE.Scene()

            renderer.setSize(viewport.width, viewport.height)
            this.container.append(renderer.domElement)

            camera.position.z = 2
            controls.rotateSpeed = 3.0;
            controls.zoomSpeed = 1.2;
            controls.noZoom = false;
            controls.noPan = true;
            controls.dynamicDampingFactor = 0.5;

            var ambientLight = new THREE.AmbientLight(0x444444)
            var directLight = new THREE.DirectionalLight(0xcccccc, 0.7)
            directLight.position.set(5, 3, 5)

            var universe = this.createUniverse()
            var earth = this.createEarth()
            var clouds = this.createEarthClouds();
            var ozone = this.createEarthOzone();

            scene.add(ambientLight)
            scene.add(directLight)
            scene.add(earth);
            scene.add(clouds);
            scene.add(ozone);
            scene.add(universe);

            console.log('scene created', this.viewport);

            requestAnimationFrame(function render() {
                requestAnimationFrame(render)
                earth.rotation.y += 0.2/180;
                clouds.rotation.y += 0.24/180;
                controls.update();

                renderer.render(scene, camera);
                //console.log('render');
            });
        }

        private createEarth() {
            var geometry = new THREE.SphereGeometry(0.5, 32, 32)
            var material = new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture(this.baseUrl + 'earthpixels4k.jpg'),
                bumpMap: THREE.ImageUtils.loadTexture(this.baseUrl + 'earthbump4k.jpg'),
                bumpScale: 0.02,
                shininess: 7,
                specularMap: THREE.ImageUtils.loadTexture(this.baseUrl + 'earthspec1k.jpg'),
                specular: new THREE.Color('gray'),
            })
            return new THREE.Mesh(geometry, material)
        }

        private createUniverse() {
            var geometry = new THREE.SphereGeometry(90, 32, 32)
            var material = new THREE.MeshBasicMaterial()
            material.map = THREE.ImageUtils.loadTexture(this.baseUrl + 'galaxy_starfield.png')
            material.side = THREE.BackSide
            return new THREE.Mesh(geometry, material)
        }

        private createEarthClouds() {
            var geometry = new THREE.SphereGeometry(0.505, 32, 32)
            var material = new THREE.MeshBasicMaterial()
            material.map = THREE.ImageUtils.loadTexture(this.baseUrl + 'earthclouds4k.png')
            material.transparent = true;
            return new THREE.Mesh(geometry, material)
        }

        private createEarthOzone() {
            var geometry = new THREE.SphereGeometry(0.51, 32, 32)
            var material = THREE.GlowMaterial()
            material.uniforms.glowColor.value.set(0x00b3ff)
            material.uniforms.coeficient.value = 1.0
            material.uniforms.power.value = 2.0
            //material.wireframe = true
            return new THREE.Mesh(geometry, material);
        }

        public update(options: VisualUpdateOptions) {
            if (options.viewport.height !== this.viewport.height || options.viewport.width !== this.viewport.width) {
                var viewport = this.viewport = options.viewport
                this.camera.aspect = viewport.width / viewport.height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize( viewport.width, viewport.height );
                this.controls.handleResize();
            }
            window.console.log('update', options);
        }
    }
}

module powerbi.visuals.plugins {
    export var _YourVisual: IVisualPlugin = {
        name: '_YourVisual',
        class: '_YourVisual',
        capabilities: YourVisual.capabilities,
        create: () => new YourVisual()
    };
}




// http://stemkoski.github.io/Three.js/Selective-Glow.html
// http://threegraphs.com/charts/sample/world/ -
// http://stemkoski.github.io/Three.js/Shader-Halo.html
// http://www.ted.com/talks/sergey_brin_and_larry_page_on_google?language=en#t-65444
// https://www.gosquared.com/labs/globe/
// https://github.com/turban/webgl-earth/tree/master/images

// view-source: http://jeromeetienne.github.io/threex.planets/examples/earth.html - atmosphereMaterial
