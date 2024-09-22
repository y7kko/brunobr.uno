import * as THREE from 'three';


function main() {

	const canvas = document.querySelector( '#header_canvas' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas,alpha:true } );
	renderer.autoClearColor = false;

	const camera = new THREE.OrthographicCamera(
		- 1, // left
		1, // right
		1, // top
		- 1, // bottom
		- 1, // near,
		1, // far
	);
	const scene = new THREE.Scene();
	const plane = new THREE.PlaneGeometry( 2, 2 );

	const fragmentShader = `
  #include <common>

  uniform vec3 iResolution;
  uniform float iTime;

float randm(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float rand_linterp(float inlet){
    float init_val = randm(124.0*vec2(floor(inlet)));
    float next_val = randm(124.0*vec2(ceil(inlet)));
    return mix(init_val,next_val,fract(inlet));
}
float rand_linterp(vec2 inlet){
    float init_val = randm(124.0*floor(inlet));
    float next_val = randm(124.0*ceil(inlet));
    return mix(init_val,next_val,fract(length(inlet)));
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    float aspect = iResolution.x/iResolution.y;
    vec2 uv = fragCoord/iResolution.xy * 2.0 -1.0;
    uv.x *= aspect;
    uv.x -= aspect;
    uv.y += 1.0;
    float t = -iTime*20.0;
    
    float pixelize = 7.0;
    vec2 uvd = uv*pixelize;
    uvd = floor(uvd);
    vec2 uvf = fract(uv/2.0);

    float selector = abs(rand_linterp(t));
    float uvd_m = dot(uvd,uvd.yx+uvd.xx+16.52);
    float col = (
            rand_linterp(0.3*uvf+1.0*length(uvd)+t+0.1*randm(uvd))
            ); //alterar os pesos dos argumentos muda a quantidade de caos e ordem

	if (col < 0.3){
		col = 0.0;
		}


    // Output to screen
    float denominator = pixelize*abs(0.0*cos(t/4.0)+3.0);
    float fade = mix(4.0,0.0,length(uvd)/denominator);
    fragColor = vec4(col)*fade;
}


  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
  `;
	const uniforms = {
		iTime: { value: 0 },
		iResolution: { value: new THREE.Vector3() },
	};
	const material = new THREE.ShaderMaterial( {
		fragmentShader,
		uniforms,
	} );
	scene.add( new THREE.Mesh( plane, material ) );

	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render( time ) {

		time *= 0.001; // convert to seconds

		resizeRendererToDisplaySize( renderer );

		const canvas = renderer.domElement;
		uniforms.iResolution.value.set( canvas.width, canvas.height, 1 );
		uniforms.iTime.value = time;

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();

  