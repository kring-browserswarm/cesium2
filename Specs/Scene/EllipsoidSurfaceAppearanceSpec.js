/*global defineSuite*/
defineSuite([
         'Scene/EllipsoidSurfaceAppearance',
         'Scene/Appearance',
         'Scene/Material',
         'Scene/Primitive',
         'Core/ExtentGeometry',
         'Core/Extent',
         'Core/GeometryInstance',
         'Core/ColorGeometryInstanceAttribute',
         'Renderer/ClearCommand',
         'Specs/render',
         'Specs/createContext',
         'Specs/destroyContext',
         'Specs/createFrameState'
     ], function(
         EllipsoidSurfaceAppearance,
         Appearance,
         Material,
         Primitive,
         ExtentGeometry,
         Extent,
         GeometryInstance,
         ColorGeometryInstanceAttribute,
         ClearCommand,
         render,
         createContext,
         destroyContext,
         createFrameState) {
    "use strict";
    /*global jasmine,describe,xdescribe,it,xit,expect,beforeEach,afterEach,beforeAll,afterAll,spyOn,runs,waits,waitsFor*/

    var context;
    var frameState;
    var primitive;

    beforeAll(function() {
        context = createContext();
        frameState = createFrameState();

        var extent = Extent.fromDegrees(-10.0, -10.0, 10.0, 10.0);
        primitive = new Primitive({
            geometryInstances : new GeometryInstance({
                geometry : new ExtentGeometry({
                    extent : extent
                }),
                attributes : {
                    color : new ColorGeometryInstanceAttribute(1.0, 1.0, 0.0, 1.0)
                }
            }),
            asynchronous : false
        });

        frameState.camera.controller.viewExtent(extent);
        var us = context.getUniformState();
        us.update(context, frameState);
    });

    afterAll(function() {
        primitive = primitive && primitive.destroy();
        destroyContext(context);
    });

    it('constructor', function() {
        var a = new EllipsoidSurfaceAppearance();

        expect(a.material).toBeDefined();
        expect(a.material.type).toEqual(Material.ColorType);
        expect(a.vertexShaderSource).toBeDefined();
        expect(a.fragmentShaderSource).toBeDefined();
        expect(a.renderState).toEqual(Appearance.getDefaultRenderState(true, true));
        expect(a.vertexFormat).toEqual(EllipsoidSurfaceAppearance.VERTEX_FORMAT);
        expect(a.flat).toEqual(false);
        expect(a.faceForward).toEqual(false);
        expect(a.translucent).toEqual(true);
        expect(a.aboveGround).toEqual(false);
    });

    it('renders', function() {
        primitive.appearance = new EllipsoidSurfaceAppearance();

        ClearCommand.ALL.execute(context);
        expect(context.readPixels()).toEqual([0, 0, 0, 0]);

        render(context, frameState, primitive);
        expect(context.readPixels()).not.toEqual([0, 0, 0, 0]);
    });

});