<script lang="ts">
  /* ────────────────────────────────────────────────
     IMPORTS Y REGISTRO GSAP
  ──────────────────────────────────────────────── */
  import { onMount, onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
  gsap.registerPlugin(ScrollToPlugin);

  /* ────────────────────────────────────────────────
     PROPS (soporta items o links)
  ──────────────────────────────────────────────── */
  export let items: { label: string; href: string }[] | undefined;
  export let links: { label: string; href: string }[] | undefined;

  /*  si el padre pasa «links», úsalo.
      si no pasa nada, caemos en los enlaces por defecto  */
  if (!items) items = links;
  if (!items || items.length === 0) {
    items = [
      { label: 'Inicio',     href: '#slider'     },
      { label: 'Nosotros',   href: '#elegirnos'  },
      { label: 'Contacto',   href: '#contacto'   }
    ];
  }

  /* ────────────────────────────────────────────────
     ESTADO Y REFERENCIAS
  ──────────────────────────────────────────────── */
  let open       = false;          // menú móvil abierto/cerrado
  let mobileBox: HTMLElement;      // <div id="menuBoxMobile">
  const removers: (() => void)[] = [];

  /* ────────────────────────────────────────────────
     TOGGLE / CLOSE
  ──────────────────────────────────────────────── */
  function toggle() {
    open = !open;
    mobileBox.classList.toggle('activo');
  }
  function close() {
    open = false;
    mobileBox.classList.remove('activo');
  }

  /* ────────────────────────────────────────────────
     LISTENERS GSAP SCROLL SUAVE
  ──────────────────────────────────────────────── */
  onMount(() => {
    // solo los enlaces del componente
    const desktop = document.querySelectorAll<HTMLAnchorElement>('#menuBox .scrollingTo');
    const mobile  = document.querySelectorAll<HTMLAnchorElement>('#menuMobileBox .scrollingTo');

    [...desktop, ...mobile].forEach(link => {
      const handler = (e: Event) => {
        const href = link.getAttribute('href');
        if (!href?.startsWith('#')) return; // externo => navegador normal

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          gsap.to(window, {
            duration: 1.2,
            scrollTo: { y: target, offsetY: 100 },
            ease: 'power3.inOut'
          });
          close(); // cierra el menú móvil tras hacer scroll
        }
      };

      link.addEventListener('click', handler);
      removers.push(() => link.removeEventListener('click', handler));
    });
  });

  onDestroy(() => removers.forEach(fn => fn()));
</script>

<!-- Menú de escritorio -->
<ul id="menuBox" class="onlyDesktopG">
  {#each items as item, i}
    <li class:activoOFF={i === 0}>
      <a href={item.href} class="scrollingTo prevenir">{item.label}</a>
    </li>
  {/each}
</ul>

<!-- Menú móvil (botón + lista) -->
<div id="menuBoxMobile" class="onlyMobileG" bind:this={mobileBox}>
  <!-- Lista móvil -->
  <ul id="menuMobileBox">
    {#each items as item}
      <li>
        <a href={item.href} class="scrollingTo" on:click={close}>
          {item.label}
        </a>
      </li>
    {/each}
  </ul>

  <!-- Botón hamburguesa / cerrar -->
  <button
    id="menuMobileBtn"
    class="hamburger"
    aria-label="Abrir menú"
    aria-expanded={open}
    aria-controls="menuMobileBox"
  >
    <span id="imgMenuMobile" class="iconosMobileMenu" aria-hidden={!open} on:click={toggle}>
      <i class="fa-solid fa-bars"></i>
    </span>
    <span id="imgClose" class="iconosMobileMenu" aria-hidden={open} on:click={toggle}>
      <i class="fa-solid fa-xmark"></i>
    </span>
  </button>
</div>
