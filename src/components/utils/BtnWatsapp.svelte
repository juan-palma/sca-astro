<script>
	import { onMount } from "svelte";
	import { btnWhatsapp } from "/src/utils/btnWhatsapp.js";

	onMount(async () => {
		btnWhatsapp();
	});
</script>
