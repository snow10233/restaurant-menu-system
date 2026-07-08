<script setup lang="ts">
import type { Page } from "../types";

defineProps<{
  eyebrow: string;
  title: string;
  subtitle: string;
  activePage: Page;
}>();

defineEmits<{
  navigate: [page: Page];
}>();
</script>

<template>
  <header
    class="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-stone-200 bg-[#fbfaf7]/95 px-4 py-4 backdrop-blur md:items-center md:px-10"
  >
    <div class="min-w-0">
      <p class="mb-1 text-xs font-black uppercase tracking-wider text-teal-700">{{ eyebrow }}</p>
      <h1 class="text-2xl font-black tracking-normal text-stone-900 md:text-4xl">{{ title }}</h1>
      <p class="mt-1 text-sm text-stone-500 md:text-base">{{ subtitle }}</p>
    </div>

    <nav class="flex shrink-0 flex-wrap justify-end gap-2" aria-label="主要操作">
      <button
        type="button"
        class="min-h-11 rounded-lg border px-4 text-sm font-black transition hover:-translate-y-0.5"
        :class="
          activePage === 'menu'
            ? 'border-stone-900 bg-stone-900 text-white'
            : 'border-stone-200 bg-white text-stone-800'
        "
        @click="$emit('navigate', 'menu')"
      >
        點餐
      </button>
      <button
        type="button"
        class="min-h-11 rounded-lg border px-4 text-sm font-black transition hover:-translate-y-0.5"
        :class="
          activePage === 'staff'
            ? 'border-stone-900 bg-stone-900 text-white'
            : 'border-stone-200 bg-white text-stone-800'
        "
        @click="$emit('navigate', 'staff')"
      >
        店員
      </button>
      <button
        type="button"
        class="min-h-11 min-w-11 rounded-lg border border-stone-200 bg-white px-3 text-sm font-black text-stone-800 transition hover:-translate-y-0.5"
        aria-label="呼叫服務"
      >
        鈴
      </button>
    </nav>
  </header>
</template>

