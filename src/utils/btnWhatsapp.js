// src/utils/btnWathsapp.js
// Activar los botones Whatsapp
export function btnWhatsapp(selector = '.btn-whatsapp', scope = document) {
	const elementos = scope.querySelectorAll(selector)
	elementos.forEach(el => {
		el.addEventListener('click', () => {
			const url = el.dataset.url;
			// Abre en ventana/pestaña nueva
			window.open(url, '_blank');
		});
	});

	return "";
}