// src/utils/fx/fadeOnScroll.js
import gsap from 'gsap';
//import { ScrollTrigger } from 'gsap/ScrollTrigger';
//gsap.registerPlugin(ScrollTrigger);

export function fadeOnScroll(selector = '.idaAniFade', scope = document) {
	const ctx = gsap.context(() => {
		const elementos = gsap.utils.toArray(selector, scope);

		elementos.forEach((el) => {
			const direccion = el.dataset.direccion || 'izquierda';
			const duracion = parseFloat(el.dataset.duracion) || 0.65;
			const distancia = parseInt(el.dataset.distancia) || 68;
			const retrasoGrupo = parseFloat(el.dataset.retrasoGrupo) || 0.15;
			const retraso = parseFloat(el.dataset.retraso) || 0;

			let propiedad, polaridad;
			if (direccion === 'derecha' || direccion === 'izquierda') {
				propiedad = 'x';
				polaridad = direccion === 'derecha' ? 1 : -1;
			} else {
				propiedad = 'y';
				polaridad = direccion === 'arriba' ? -1 : 1;
			}

			const valor = distancia * polaridad;
			const objeto = el.classList.contains('idaAniFadeGrupo')
				? el.querySelectorAll(`.${el.dataset.grupo}`)
				: el;

			gsap.set(objeto, {
				[propiedad]: valor,
				autoAlpha: 0,
			});

			gsap.to(objeto, {
				scrollTrigger: {
					trigger: el,
					start: '10% 68%',
					end: 'center bottom',
					toggleActions: 'restart none reverse none',
					invalidateOnRefresh: true,
					fastScrollEnd: true,
				},
				duration: duracion,
				ease: 'power3.inOut',
				[propiedad]: 0,
				autoAlpha: 1,
				delay: retraso,
				stagger: retrasoGrupo,
			});
		});
	}, scope);

	// Retornamos función de limpieza para usar si es necesario
	return () => ctx.revert();
}
