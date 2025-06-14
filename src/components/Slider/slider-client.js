export class Slider {
	constructor($el, data, defaultDelay) {
		this.$el = $el;
		this.data = data;
		this.current = 0;
		this.track = $el.querySelector('.slidesWrapper');
		this.dots = $el.querySelector('.dots');
		this.w = 0;
		this.isBusy = false;
		this.defaultDelay = defaultDelay || 8000;
		this.timer = null;

		this.setup();
		this.bind();
		this.resizeFix();
		this.startAuto();
	}

	setup() {
		this.w = this.$el.clientWidth;

		this.dots.innerHTML = '';
		this.data.forEach((_, i) => {
			const li = document.createElement('li');
			li.dataset.index = i;
			this.dots.appendChild(li);
		});

		this.goto(0, false);
	}

	bind() {
		const nextBtn = this.$el.querySelector('.nav--next');
		const prevBtn = this.$el.querySelector('.nav--prev');

		if (nextBtn) nextBtn.addEventListener('click', () => this.next());
		if (prevBtn) prevBtn.addEventListener('click', () => this.prev());

		this.dots.addEventListener('click', e => {
			if (e.target.tagName === 'LI') this.jump(+e.target.dataset.index);
		});

		this.track.addEventListener('transitionend', () => this.fixLoop());
	}

	next() {
		if (this.isBusy) return;
		this.goto(this.current + 1);
	}

	prev() {
		if (this.isBusy) return;
		this.goto(this.current - 1);
	}

	jump(targetIndex) {
		if (targetIndex === this.current) return;
		const dir = targetIndex > this.current ? 1 : -1;
		const neighbor = targetIndex - dir;

		this.goto(neighbor, false);
		requestAnimationFrame(() => {
			dir === 1 ? this.next() : this.prev();
		});
	}

	goto(idx, animate = true) {
		if (animate && idx >= 0 && idx < this.data.length) this.resetAuto();

		this.isBusy = animate;
		this.current = idx;

		this.track.style.transition = animate ? "transform .6s ease" : "none";
		const offset = -(idx + 1) * this.w; // +1 por el clon inicial
		this.track.style.transform = `translateX(${offset}px)`;

		this.updateDots();
	}


	fixLoop() {
		if (this.current === -1) {
			this.track.style.transition = "none";
			this.current = this.data.length - 1;
		} else if (this.current === this.data.length) {
			this.track.style.transition = "none";
			this.current = 0;
		}

		const offset = -(this.current + 1) * this.w;
		this.track.style.transform = `translateX(${offset}px)`;

		this.updateDots();
		this.isBusy = false;
		this.resetAuto();
	}



	startAuto() {
		if (this.data.length > 1) {
			const delay = this.data[this.current]?.delay ?? this.defaultDelay;
			this.timer = setTimeout(() => this.next(), delay);
		}
	}

	resetAuto() {
		clearTimeout(this.timer);
		this.startAuto();
	}

	updateDots() {
		Array.from(this.dots.children).forEach((dot, i) => {
			dot.classList.toggle("active", i === this.current);
		});
	}


	resizeFix() {
		const resizeHandler = () => {
			this.w = this.$el.clientWidth;
			this.goto(this.current, false);
		};

		window.addEventListener("resize", resizeHandler);

		this.cleanup = () => {
			window.removeEventListener("resize", resizeHandler);
		};
	}
}
