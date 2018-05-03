const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.height = Math.max(window.innerWidth, window.innerHeight);

canvas.addEventListener('mousewheel', mouseWheelHandler, false);

function mouseWheelHandler(e){
	var e = window.event || e;
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	oneTri.w += delta * 0.05 * oneTri.w;

	//handling for main triangle getting too big or too small
	if (oneTri.w > (2 * canvas.width)){
		oneTri.w /= 2;
	}
	if (oneTri.w < (canvas.width)){
		oneTri.w *= 2;
	}
}

function triangle(x, y, w){
	this.x = x;
	this.y = y
	this.w = w;
	this.fractal = [];

	this.iterate = function(){//create 3 sub-triangles
		this.fractal = [];
		if (this.w > 16){//smaller for a tighter fractal, larger for better performance
			this.fractal.push(new triangle(this.x, this.y, this.w / 2));
			this.fractal.push(new triangle(this.x + (this.w / 2), this.y, this.w / 2));
			this.fractal.push(new triangle(this.x, this.y + (this.w / 2), this.w / 2));
		}
	}

	this.iterate();

	this.draw = function(){
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.w, this.y);
		ctx.lineTo(this.x, this.y + this.w);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
		this.fractal.forEach(tri => {
			tri.iterate();//recursion lul
			tri.draw();
		});
	}
}

let oneTri = new triangle(0, 0, canvas.width);
let oldW = oneTri.w;
function animate(){
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	oneTri.draw();
	//if triangle width has changed, re-calculate all sub-triangles
	if (oneTri.w != oldW){
		oneTri.iterate();
		oldW = oneTri.w;
	}
}

animate();
