<script setup lang="ts">
import type { Dish, OrderTicket, StockStatus } from "../types";

const props = defineProps<{
  dishes: Dish[];
  inventory: Record<string, StockStatus>;
  tickets: OrderTicket[];
}>();

const emit = defineEmits<{
  toggleInventory: [dishId: string];
  resetInventory: [];
}>();

function availabilityText(dish: Dish): string {
  return props.inventory[dish.id] === "closed" ? "暫停供應" : dish.stockText;
}
</script>

<template>
  <main class="grid gap-7 px-4 py-7 md:px-10 lg:grid-cols-[minmax(0,1fr)_420px]">
    <section aria-labelledby="orders-title">
      <div class="mb-5 flex items-end justify-between gap-4">
        <div>
          <p class="mb-1 text-xs font-black uppercase tracking-wider text-teal-700">Kitchen</p>
          <h2 id="orders-title" class="text-2xl font-black tracking-normal">待處理訂單</h2>
        </div>
        <span class="inline-flex min-h-8 items-center rounded-full bg-teal-50 px-3 text-xs font-black text-teal-800">
          {{ tickets.length }} 張單
        </span>
      </div>

      <div class="grid gap-4">
        <article v-for="ticket in tickets" :key="`${ticket.table}-${ticket.state}`" class="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <strong class="text-2xl font-black">{{ ticket.table }}</strong>
            <span class="font-black text-amber-700">{{ ticket.state }}</span>
          </div>
          <p class="text-stone-500">{{ ticket.items }}</p>
          <button
            type="button"
            class="min-h-11 rounded-lg border border-stone-200 bg-stone-50 px-4 font-black text-teal-800 transition hover:-translate-y-0.5"
          >
            {{ ticket.action }}
          </button>
        </article>
      </div>
    </section>

    <section aria-labelledby="inventory-title">
      <div class="mb-5 flex items-end justify-between gap-4">
        <div>
          <p class="mb-1 text-xs font-black uppercase tracking-wider text-teal-700">Inventory</p>
          <h2 id="inventory-title" class="text-2xl font-black tracking-normal">今日供應</h2>
        </div>
        <button
          type="button"
          class="min-h-10 rounded-lg border border-stone-200 px-3 text-sm font-black text-teal-800 transition hover:-translate-y-0.5"
          @click="emit('resetInventory')"
        >
          還原展示
        </button>
      </div>

      <div class="grid gap-3">
        <article
          v-for="dish in dishes"
          :key="dish.id"
          class="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-stone-200 bg-white p-3 shadow-sm"
        >
          <img class="h-16 w-[4.5rem] rounded-md object-cover" :src="dish.image" :alt="dish.name" />
          <div class="min-w-0">
            <h3 class="truncate font-black">{{ dish.name }}</h3>
            <p class="text-sm text-stone-500">{{ availabilityText(dish) }}</p>
          </div>
          <label class="relative inline-flex h-9 w-15 cursor-pointer items-center" :aria-label="`${dish.name}供應狀態`">
            <input
              class="peer sr-only"
              type="checkbox"
              :checked="inventory[dish.id] !== 'closed'"
              @change="emit('toggleInventory', dish.id)"
            />
            <span class="absolute inset-0 rounded-full bg-stone-300 transition peer-checked:bg-teal-700"></span>
            <span class="absolute left-1 size-7 rounded-full bg-white shadow transition peer-checked:translate-x-6"></span>
          </label>
        </article>
      </div>
    </section>
  </main>
</template>

