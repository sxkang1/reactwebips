var Detector = {
    translationMatrix:[0, 0], //位移矩阵
    scaleMatrix:[1, 1],//缩放矩阵
    shaders: [

        'http://10.44.161.217:80/shader/2d-vertex-shader.glsl',
        'http://10.44.161.217:80/shader/2d-fragment-shader.glsl',
        'http://10.44.161.217:80/shader/2d-fragment-shader-reverse.glsl',
        'http://10.44.161.217:80/shader/2d-fragment-shader-red.glsl',
        'http://10.44.161.217:80/shader/2d-fragment-shader-brightness.glsl',
        'http://10.44.161.217:80/shader/2d-vertex-shader-kernel.glsl',
        'http://10.44.161.217:80/shader/2d-fragment-shader-kernel.glsl',
        'http://10.44.161.217:80/shader/2d-fragment-shader-gray.glsl',
        'http://10.44.161.217:80/shader/2d-fragment-shader-grayImage.glsl',
        'http://10.44.161.217:80/shader/2d-fragment-shader-LogEdgeEnhance.glsl',
        'http://10.44.161.217:80/shader/2d-fragment-shader-cosEdgeEnhance.glsl'


        // 'http://127.0.0.1:5000/shader/2d-vertex-shader.glsl',
        // 'http://127.0.0.1:5000/shader/2d-fragment-shader.glsl',
        // 'http://127.0.0.1:5000/shader/2d-fragment-shader-reverse.glsl',
        // 'http://127.0.0.1:5000/shader/2d-fragment-shader-red.glsl',
        // 'http://127.0.0.1:5000/shader/2d-fragment-shader-brightness.glsl',
        // 'http://127.0.0.1:5000/shader/2d-vertex-shader-kernel.glsl',
        // 'http://127.0.0.1:5000/shader/2d-fragment-shader-kernel.glsl',
        // 'http://127.0.0.1:5000/shader/2d-fragment-shader-gray.glsl',
        // 'http://127.0.0.1:5000/shader/2d-fragment-shader-grayImage.glsl',
        // 'http://127.0.0.1:5000/shader/2d-fragment-shader-LogEdgeEnhance.glsl',
        // 'http://127.0.0.1:5000/shader/2d-fragment-shader-cosEdgeEnhance.glsl'

        
        //debug
        // './2d-vertex-shader.glsl',
        // './2d-fragment-shader.glsl',
        // './2d-fragment-shader-reverse.glsl',
        // './2d-fragment-shader-red.glsl',
        // './2d-fragment-shader-brightness.glsl',
        // './2d-vertex-shader-kernel.glsl',
        // './2d-fragment-shader-kernel.glsl',
        // './2d-fragment-shader-gray.glsl',
        // './2d-fragment-shader-grayImage.glsl',
        // './2d-fragment-shader-LogEdgeEnhance.glsl',
        // './2d-fragment-shader-cosEdgeEnhance.glsl'
        
    ],
    textureData:new Float32Array([
        0,1,//左上角——uv0
        0,0,//左下角——uv1
        1,1,//右上角——uv2
        1,0 //右下角——uv3
    ])

    // textureData:new Float32Array([
    //     0,0,//左上角——uv0
    //     0,1,//左下角——uv1
    //     1,0,//右上角——uv2
    //     1,1 //右下角——uv3
    // ])
};

export default Detector;