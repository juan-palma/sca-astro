/*::::::::::: Juan Palma (2025) :::::::::::*/
export class Precarga {
    preLoadFind = 0;
    preloadTotal = 0;
    preloadLoad = 0;
    elementsPre;
    userFunc;
    userAni;
    progress = false;
    imgDelay = [];
    delayLoad = false;

    showPreloadDealy() {
        this.imgDelay.forEach(function(pre) {
            if (pre.hasAttribute('preload-srcset')) {
                pre.srcset = pre.getAttribute('preload-srcset');
                pre.removeAttribute('preload-srcset');
            } else {
                pre.src = pre.getAttribute('preload-src');
                pre.removeAttribute('preload-src');
            }
        });
    }

    loadDelay() {
        this.delayLoad = true;
        this.preloadTotal = 0;
        this.preloadLoad = 0;
        const miDOM = document.createDocumentFragment();

        this.imgDelay.forEach((pre) => {
            const tag = document.createElement(pre.tagName);
            if (pre.hasAttribute('preload-srcset')) {
                tag.srcset = pre.getAttribute('preload-srcset');
            } else {
                tag.src = pre.getAttribute('preload-src');
            }
            tag.setAttribute('preload-delay', "");
            tag.onload = this.checkPreload.bind(this);
            miDOM.appendChild(tag);
            this.preloadTotal++;
        });
    }
    
    showPreload() {
        this.elementsPre.forEach((pre) => {
            if (!pre.hasAttribute('preload-delay')) {
                if (pre.hasAttribute('preload-srcset')) {
                    pre.srcset = pre.getAttribute('preload-srcset');
                    pre.removeAttribute('preload-srcset');
                } else {
                    pre.src = pre.getAttribute('preload-src');
                    pre.removeAttribute('preload-src');
                }
            }
        });
        
        setTimeout(() => {
            if (this.userFunc instanceof Function) {
                this.userFunc();
            }
        }, 2200);
    }

    checkPreload(e) {
        this.preloadLoad++;
        if (this.preloadTotal === this.preloadLoad) {
            if (e.target.hasAttribute('preload-delay')) {
                this.showPreloadDealy();
            } else {
                this.showPreload();
            }
        }
        if (this.progress && !e.target.hasAttribute('preload-delay')) {
            const cargadoP = (this.preloadLoad * 100) / this.preLoadFind;
            if (this.userAni instanceof Function) {
                this.userAni(cargadoP);
            }
        }
    }

    run() {
        this.elementsPre = document.querySelectorAll('[preload-src]');
        const miDOM = document.createDocumentFragment();
        
        this.elementsPre.forEach((pre) => {
            if (pre.hasAttribute('preload-delay')) {
                this.imgDelay.push(pre);
            } else {
                const tag = document.createElement(pre.tagName);
                if (pre.hasAttribute('preload-srcset')) {
                    tag.srcset = pre.getAttribute('preload-srcset');
                } else {
                    tag.src = pre.getAttribute('preload-src');
                }
                tag.onload = this.checkPreload.bind(this);
                miDOM.appendChild(tag);
                this.preloadTotal++;
            }
        });
        
        this.preLoadFind = this.preloadTotal;
    }

    constructor(f) {
        if (f instanceof Function) {
            this.userFunc = f;
        }
    }
}

// Opcional: Exportar por defecto si prefieres
export default Precarga;