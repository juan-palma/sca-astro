<script>
  import { onMount, onDestroy } from 'svelte';

  let el;
  let ctx;

  onMount(async () => {
    const gsap = (await import('gsap')).default;
    const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
    gsap.registerPlugin(ScrollTrigger);

    // Aquí vienen las props que se pasan
    let propiedad = direccion === "arriba" || direccion === "abajo" ? "y" : "x";
    let polaridad = (direccion === "arriba" || direccion === "izquierda") ? -1 : 1;
    let valor = distancia * polaridad;

    let objetivo = el;
    if (grupo && grupo !== "") {
      objetivo = el.querySelectorAll(`.${grupo}`);
    }

    ctx = gsap.context(() => {
      gsap.set(objetivo, {
        [propiedad]: valor,
        autoAlpha: 0,
      });

      gsap.to(objetivo, {
        scrollTrigger: {
          trigger: el,
          start: "10% 68%",
          end: "center bottom",
          toggleActions: "restart none reverse none",
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
        duration: duracion,
        ease: "power3.inOut",
        [propiedad]: 0,
        autoAlpha: 1,
        delay: retraso,
        stagger: stagger,
      });
    }, el);
  });

  onDestroy(() => {
    ctx && ctx.revert();
  });

  // Props
  export let direccion = "izquierda";
  export let duracion = 0.85;
  export let distancia = 68;
  export let retraso = 0;
  export let stagger = 0.15;
  export let grupo = "";
</script>

<div class="componenteBox fx fadeInOnScroll" bind:this={el}>
  <slot />
</div>
