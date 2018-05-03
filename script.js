const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.height = Math.max(window.innerWidth, window.innerHeight);

canvas.addEventListener('mousewheel', mouseWheelHandler, false);

function mouseWheelHandler(e){
	var e = window.event || e;
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	oneTri.w += delta * 0.05 * oneTri.w;

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
	this.initW = w;
	this.fractal = [];

	this.iterate = function(){
		this.fractal = [];
		if (this.w > 16){
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
			tri.iterate();
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
	if (oneTri.w != oldW){
		oneTri.iterate();
		oldW = oneTri.w;
	}
}

animate();
