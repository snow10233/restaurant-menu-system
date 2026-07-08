<script setup lang="ts">
import type { CartItem } from "../types";
import { formatCurrency } from "../utils/format";

defineProps<{
  cart: CartItem[];
  total: number;
}>();

defineEmits<{
  clear: [];
  submit: [];
  increase: [index: number];
  decrease: [index: number];
  remove: [index: number];
}>();
</script>

<template>
  <aside
    class="self-start rounded-lg border border-stone-200 bg-white p-5 shadow-[0_18px_40px_rgba(42,35,28,0.12)] lg:sticky lg:top-28"
    aria-labelledby="cart-title"
  >
    <div class="mb-5 flex items-end justify-between gap-4">
      <div>
        <p class="mb-1 text-xs font-black uppercase tracking-wider text-teal-700">Cart</p>
        <h2 id="cart-title" class="text-2xl font-black tracking-normal">購物車</h2>
      </div>
      <button
        type="button"
        class="min-h-10 rounded-lg border border-stone-200 px-3 text-sm font-black text-teal-800 transition hover:-translate-y-0.5"
        @click="$emit('clear')"
      >
        清空
      </button>
    </div>

    <div class="grid min-h-32 gap-3">
      <div
        v-if="cart.length === 0"
        class="grid min-h-32 place-items-center rounded-lg border border-dashed border-stone-200 text-center text-stone-500"
      >
        購物車目前是空的
      </div>

      <article v-for="(item, index) in cart" v-else :key="`${item.id}-${item.options}-${item.price}`" class="border-b border-stone-200 pb-3">
        <div class="flex justify-between gap-4 font-black">
          <span>{{ item.name }}</span>
          <span>{{ formatCurrency(item.price * item.quantity) }}</span>
        </div>
        <p v-if="item.options" class="mt-1 text-sm text-stone-500">{{ item.options }}</p>
        <div class="mt-3 flex items-center justify-between gap-3">
          <div class="grid grid-cols-[2.5rem_3rem_2.5rem] overflow-hidden rounded-lg border border-stone-200">
            <button type="button" class="min-h-10 font-black" @click="$emit('decrease', index)">-</button>
            <span class="grid place-items-center font-black">{{ item.quantity }}</span>
            <button type="button" class="min-h-10 font-black" @click="$emit('increase', index)">+</button>
          </div>
          <button type="button" class="font-black text-red-700" @click="$emit('remove', index)">移除</button>
        </div>
      </article>
    </div>

    <label class="mt-5 grid gap-2 text-sm font-black text-stone-500" for="order-note">
      訂單備註
      <textarea
        id="order-note"
        class="min-h-24 resize-y rounded-lg border border-stone-200 bg-white p-3 text-base font-normal text-stone-900 outline-none focus:border-teal-700"
        rows="3"
        placeholder="例如：少醬、兒童餐具"
      />
    </label>

    <div class="mt-5 flex flex-col gap-4 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span class="text-sm text-stone-500">小計</span>
        <strong class="block text-3xl font-black">{{ formatCurrency(total) }}</strong>
      </div>
      <button
        type="button"
        class="min-h-12 rounded-lg bg-teal-700 px-5 font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-32"
        :disabled="cart.length === 0"
        @click="$emit('submit')"
      >
        送出訂單
      </button>
    </div>
  </aside>
</template>

