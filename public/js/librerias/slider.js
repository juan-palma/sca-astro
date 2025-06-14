/* =======================================================================
   Slider Module (ES6)
   Adaptado para Vite - Juan Palma (2025)
======================================================================= */

export class Slider {
    constructor($el, data, defaultDelay) {
        this.$el = $el;
        this.data = data;
        this.current = 0;
        this.track = null;
        this.dots = $el.querySelector(".dots");
        this.w = 0;
        this.isBusy = false;
        this.defaultDelay = defaultDelay || window.sliderDefaultDelay || 5000;
        this.timer = null;

        this.build();
        this.bind();
        this.resizeFix();
        this.startAuto();
    }

    /* =======================================================================
       DOM dinámico
    ======================================================================= */
    build() {
        this.track = document.createElement("div");
        this.track.className = "slidesWrapper";
        this.$el.insertBefore(this.track, this.$el.firstChild);

        // clones extremos
        this.track.appendChild(this.slide(this.data.at(-1), true));
        this.data.forEach(s => this.track.appendChild(this.slide(s)));
        this.track.appendChild(this.slide(this.data[0], true));

        // bullets
        this.data.forEach((_, i) => {
            const li = document.createElement("li");
            li.dataset.index = i;
            this.dots.appendChild(li);
        });

        this.w = this.$el.clientWidth;
        this.goto(0, false);
    }

    slide(info, clone = false) {
        const art = document.createElement("article");
        art.className = `slide${info.class ? ` ${info.class}` : ""}${clone ? " slide--clone" : ""}`;
        if (!clone && info.id) art.id = info.id;

        const fig = document.createElement("figure");
        fig.className = "slide__content";

        if (info.img && info.img !== "") {
            const pic = document.createElement("picture");
            pic.innerHTML = `<img src="${info.img}" alt="${info.alt || info.title || ""}" loading="lazy">`;
            fig.appendChild(pic);
        }

        const cap = document.createElement("figcaption");
        if (info.title) cap.insertAdjacentHTML("beforeend", `<h2>${info.title}</h2>`);
        if (info.text) cap.insertAdjacentHTML("beforeend", `<p>${info.text}</p>`);
        
        if (info.link) {
            cap.insertAdjacentHTML("beforeend", 
                `<a class="btn" href="${info.link}">${info.btnLabel || "Ir"}</a>`
            );
        }

        if (info.foto) {
            cap.insertAdjacentHTML("beforeend", `
                <div class="testUser">
                    <img src="${info.foto}" alt="${info.alt || info.title || ""}" loading="lazy">
                    <p>
                        <span class="nombre">${info.nombre}</span>
                        <span class="puesto">${info.puesto}</span>
                    </p>
                </div>`
            );
        }

        fig.appendChild(cap);
        art.appendChild(fig);
        return art;
    }

    /* =======================================================================
       Eventos
    ======================================================================= */
    bind() {
        if (this.data.length >= 2) {
            this.$el.querySelector(".nav--next").addEventListener("click", () => this.next());
            this.$el.querySelector(".nav--prev").addEventListener("click", () => this.prev());

            this.dots.addEventListener("click", e => {
                if (e.target.tagName === "LI") this.jump(+e.target.dataset.index);
            });

            this.track.addEventListener("transitionend", () => this.fixLoop());
        } else {
            this.$el.querySelector(".nav--next").style.display = "none";
            this.$el.querySelector(".nav--prev").style.display = "none";
            this.dots.style.display = "none";
        }
    }

    /* =======================================================================
       Navegación
    ======================================================================= */
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

    /* =======================================================================
       Desplazamiento centralizado
    ======================================================================= */
    goto(idx, animate = true) {
        if (animate && idx >= 0 && idx < this.data.length) this.resetAuto();

        this.isBusy = animate;
        this.current = idx;

        this.track.style.transition = animate ? "transform .6s ease" : "none";
        const offset = -(idx + 1) * this.w;
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

    /* =======================================================================
       Auto-play
    ======================================================================= */
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

    /* =======================================================================
       Bullets activos
    ======================================================================= */
    updateDots() {
        Array.from(this.dots.children).forEach((dot, i) => {
            dot.classList.toggle(
                "active",
                i === ((this.current % this.data.length + this.data.length) % this.data.length)
            );
        });
    }

    /* =======================================================================
       Responsive
    ======================================================================= */
    resizeFix() {
        const resizeHandler = () => {
            this.w = this.$el.clientWidth;
            this.goto(this.current, false);
        };
        
        window.addEventListener("resize", resizeHandler);
        
        // Opcional: Limpiar evento si se necesita
        this.cleanup = () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }
}

/* =======================================================================
   Función de creación del slider (exportada como default)
======================================================================= */
export default function createHeroSlider(selector, data, options = {}) {
    return new Promise(resolve => {
        const $c = document.querySelector(selector);
        if (!$c) return resolve();

        const defaultDelay = options.defaultDelay || window.sliderDefaultDelay || 5000;
        
        // Precarga primera imagen
        const img = new Image();
        img.onload = img.onerror = () => {
            new Slider($c, data, defaultDelay);
            resolve();
        };
        img.src = data[0].img;
    });
}