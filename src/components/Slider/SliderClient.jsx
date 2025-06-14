import { useEffect } from 'preact/hooks';
import { Slider } from './slider-client.js';

export default function SliderClient({ id, slides, defaultDelay = 8000 }) {
  useEffect(() => {
    const el = document.getElementById(id);
    if (el) {
      new Slider(el, slides, defaultDelay);
    }
  }, [id, slides, defaultDelay]);

  return null; // No renderiza nada, solo activa
}
