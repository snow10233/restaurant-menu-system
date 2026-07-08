<script setup lang="ts">
import { computed, ref } from "vue";
import type { CartItem, Dish, DishCategory, StockStatus } from "../types";
import { formatCurrency } from "../utils/format";

const props = defineProps<{
  dishes: Dish[];
  inventory: Record<string, StockStatus>;
  cart: CartItem[];
  cartTotal: number;
}>();

const emit = defineEmits<{
  addToCart: [dish: Dish, quantity: number, options: string, price: number];
  openDish: [dishId: string];
  clearCart: [];
  submitOrder: [];
  increaseCart: [index: number];
  decreaseCart: [index: number];
  removeCart: [index: number];
}>();

type CategoryFilter = "all" | DishCategory;

const selectedCategory = ref<CategoryFilter>("all");
const search = ref("");

const categories: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "sushi", label: "壽司" },
  { id: "rice", label: "飯類" },
  { id: "noodle", label: "麵食" },
  { id: "seasonal", label: "時令" }
];

const visibleDishes = computed(() => {
  const query = search.value.trim().toLowerCase();
  return props.dishes.filter((dish) => {
    const byCategory = selectedCategory.value === "all" || dish.category === selectedCategory.value;
    const bySearch = !query || dish.name.toLowerCase().includes(query);
    return byCategory && bySearch;
  });
});

function stockText(dish: Dish): string {
  return props.inventory[dish.id] === "closed" ? "暫停供應" : dish.stockText;
}

function stockStatus(dish: Dish): StockStatus {
  return props.inventory[dish.id] ?? dish.status;
}
</script>

<template>
  <main class="grid gap-7 px-4 py-7 md:px-10 lg:grid-cols-[minmax(0,1fr)_360px]">
    <section aria-labelledby="menu-title">
      <div
        class="mb-6 flex flex-col gap-3 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 font-black text-teal-900 sm:flex-row sm:items-center sm:justify-between"
      >
        <div><span class="mr-2 inline-block size-2.5 rounded-full bg-teal-700"></span>目前供餐中</div>
        <div>預估出餐 15-20 分鐘</div>
      </div>

      <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="mb-1 text-xs font-black uppercase tracking-wider text-teal-700">Menu</p>
          <h2 id="menu-title" class="text-2xl font-black tracking-normal">餐點列表</h2>
        </div>
        <label class="grid gap-1 text-sm font-black text-stone-500">
          搜尋
          <input
            v-model="search"
            type="search"
            class="h-11 w-full rounded-lg border border-stone-200 bg-white px-3 text-base font-normal text-stone-900 outline-none focus:border-teal-700 sm:w-64"
            placeholder="餐點名稱"
            autocomplete="off"
          />
        </label>
      </div>

      <div class="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="餐點分類">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="min-h-11 shrink-0 rounded-lg border px-4 font-black transition hover:-translate-y-0.5"
          :class="
            selectedCategory === category.id
              ? 'border-stone-900 bg-stone-900 text-white'
              : 'border-stone-200 bg-white text-stone-500'
          "
          @click="selectedCategory = category.id"
        >
          {{ category.label }}
        </button>
      </div>

      <div class="grid gap-4 xl:grid-cols-2" aria-live="polite">
        <article
          v-for="dish in visibleDishes"
          :key="dish.id"
          class="grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm sm:grid-cols-[10.5rem_minmax(0,1fr)]"
        >
          <img class="h-48 w-full object-cover sm:h-full" :src="dish.image" :alt="dish.name" />
          <div class="grid gap-4 p-4">
            <div class="flex items-start justify-between gap-3">
              <StatusPill :status="stockStatus(dish)" :label="stockText(dish)" />
              <strong class="text-lg">{{ formatCurrency(dish.price) }}</strong>
            </div>
            <div>
              <h3 class="text-lg font-black tracking-normal">{{ dish.name }}</h3>
              <p class="mt-1 text-sm text-stone-500">{{ dish.description }}</p>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" class="text-left font-black text-teal-800" @click="emit('openDish', dish.id)">
                詳情
              </button>
              <button
                type="button"
                class="min-h-11 rounded-lg bg-teal-700 px-4 font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="inventory[dish.id] === 'closed'"
                @click="emit('addToCart', dish, 1, '', dish.price)"
              >
                加入
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <CartPanel
      :cart="cart"
      :total="cartTotal"
      @clear="emit('clearCart')"
      @submit="emit('submitOrder')"
      @increase="emit('increaseCart', $event)"
      @decrease="emit('decreaseCart', $event)"
      @remove="emit('removeCart', $event)"
    />
  </main>
</template>
