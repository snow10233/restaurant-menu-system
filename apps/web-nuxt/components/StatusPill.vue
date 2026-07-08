<script setup lang="ts">
import type { StockStatus } from "../types";

defineProps<{
  status: StockStatus;
  label: string;
}>();
</script>

<template>
  <span
    class="inline-flex min-h-8 items-center rounded-full px-3 text-xs font-black"
    :class="{
      'bg-teal-50 text-teal-800': status === 'open',
      'bg-amber-100 text-amber-800': status === 'limited',
      'bg-red-50 text-red-700': status === 'closed'
    }"
  >
    {{ label }}
  </span>
</template>

