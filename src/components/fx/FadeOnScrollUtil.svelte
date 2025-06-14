<script>
  import { onMount, onDestroy } from 'svelte';
  import {fadeOnScroll} from '/src/utils/fx/fadeOnScroll.js';

  let cleanup;

  onMount(async () => {
    const gsap = (await import('gsap')).default;
    const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
    gsap.registerPlugin(ScrollTrigger);

    cleanup = fadeOnScroll();
  });

  onDestroy(() => {
    if (cleanup) cleanup();
  });
</script>
