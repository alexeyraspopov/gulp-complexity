(function(){
	"use strict";

	function toRadians(degrees){
		return degrees * Math.PI / 180;
	}

	function alignValue(value){
		return parseFloat((value).toFixed(5));
	}

	function handleEvent(event){
		var type = event.type, originalEvent;

		originalEvent = !touch.isTouch ? event : event.changedTouches[0];

		switch(type){
			case touch.events.start:
				if(originalEvent.pageY > 450){
					this.element.addEventListener("swipeleft", touch.stop);
					this.element.addEventListener("swiperight", touch.stop);
					this.startX = originalEvent.pageX;
				}else{
					this.element.removeEventListener("swipeleft", touch.stop);
					this.element.removeEventListener("swiperight", touch.stop);
				}
				break;

			case touch.events.move:
				if(this.startX){
					this.tempOffset = (this.startX - originalEvent.pageX) * 0.2;
					this.update();
				}
				break;

			case touch.events.end:
				this.startX = null;
				this.offset += this.tempOffset;
				this.tempOffset = 0;
				break;
		}
	}

	function Carousel(element){
		this.element = element;
		this.elements = element.children;

		this.stepAngle = 360 / this.elements.length;

		this.radiusX = 330;
		this.radiusY = 190;
		this.radiusZ = 350;

		this.offset = 0;
		this.tempOffset = 0;
		this.startX = 0;

		element.addEventListener(touch.events.start, handleEvent.bind(this));
		element.addEventListener(touch.events.move, handleEvent.bind(this));
		element.addEventListener(touch.events.end, handleEvent.bind(this));

		this.update();
	}

	Carousel.prototype.update = function(){
		var radians, i, x, y, z, opacity;

		for(i = 0; i < this.elements.length; i++){
			radians = toRadians(this.stepAngle * i + this.offset + 90 + this.tempOffset);

			x = alignValue(this.radiusX * Math.cos(radians));
			y = alignValue(this.radiusY * Math.sin(radians)) - this.radiusY;
			z = alignValue(this.radiusZ * Math.sin(radians)) - this.radiusZ;

			opacity = (z + this.radiusZ) * 0.5/1300 + 0.75;

			this.elements[i].style.cssText = "-webkit-transform: translate3d(" + x + "px, " + y + "px, " + z + "px); opacity: " + opacity +";";
		}
	};

	window.Carousel = Carousel;
})();