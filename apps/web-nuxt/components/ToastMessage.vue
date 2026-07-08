<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<template>
  <div
    class="fixed bottom-5 right-5 z-30 max-w-[calc(100vw-2.5rem)] rounded-lg bg-stone-900 px-4 py-3 text-sm font-bold text-white shadow-2xl transition duration-200"
    :class="message ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'"
    role="status"
    aria-live="polite"
  >
    {{ message }}
  </div>
</template>

