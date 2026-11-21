<script setup lang="ts">
import { computed, ref } from "vue";
import type { Dish, DishChoiceGroup, StockStatus } from "../types";
import { formatCurrency } from "../utils/format";

const props = defineProps<{
  dish: Dish;
  stockStatus: StockStatus;
}>();

const emit = defineEmits<{
  back: [];
  addToCart: [dish: Dish, quantity: number, options: string, price: number];
}>();

const quantity = ref(1);
const upgraded = ref(false);
const selections = ref<Record<string, string>>({});
const tasteOptions = ref<string[]>([]);
const note = ref("");

const activeUpgrade = computed(() => (upgraded.value ? props.dish.upgrade : undefined));
const activeGroups = computed(() => [...props.dish.choiceGroups, ...(activeUpgrade.value?.choiceGroups ?? [])]);
const missingGroup = computed(() => activeGroups.value.find((group) => !selectedOption(group)));
const unitPrice = computed(
  () =>
    props.dish.price +
    (activeUpgrade.value?.priceDelta ?? 0) +
    activeGroups.value.reduce((sum, group) => sum + (selectedOption(group)?.priceDelta ?? 0), 0)
);
const isClosed = computed(() => props.stockStatus === "closed");
const stockLabel = computed(() => (isClosed.value ? "暫停供應" : props.dish.stockText));

function selectedOption(group: DishChoiceGroup) {
  return group.options.find((option) => option.label === selections.value[group.id]);
}

function addQuantity(delta: number) {
  quantity.value = Math.max(1, quantity.value + delta);
}

function addItem() {
  const options = [
    activeUpgrade.value?.label,
    ...activeGroups.value.map((group) => `${group.label}：${selectedOption(group)?.label}`),
    ...tasteOptions.value,
    note.value.trim()
  ]
    .filter(Boolean)
    .join(" / ");
  emit("addToCart", props.dish, quantity.value, options, unitPrice.value);
}
</script>

<template>
  <main class="px-4 py-7 md:px-10">
    <section
      class="mx-auto grid gap-8"
      :class="dish.image ? 'max-w-6xl lg:grid-cols-[minmax(280px,0.9fr)_minmax(320px,1.1fr)]' : 'max-w-2xl'"
    >
      <div v-if="dish.image" class="overflow-hidden rounded-lg bg-stone-100 shadow-[0_18px_40px_rgba(42,35,28,0.12)]">
        <img class="h-80 w-full object-cover lg:h-full lg:min-h-[32rem]" :src="dish.image" :alt="dish.name" />
      </div>

      <div class="grid content-start gap-5">
        <button type="button" class="w-fit font-black text-teal-800" @click="emit('back')">返回菜單</button>
        <div>
          <p class="mb-1 text-xs font-black uppercase tracking-wider text-teal-700">{{ dish.categoryLabel }}</p>
          <h2 class="text-4xl font-black tracking-normal text-stone-900 md:text-6xl">{{ dish.name }}</h2>
          <p v-if="dish.description" class="mt-4 text-stone-500">{{ dish.description }}</p>
          <ul v-if="dish.notes.length > 0" class="mt-3 grid gap-1 text-sm text-stone-500">
            <li v-for="item in dish.notes" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="flex items-center justify-between gap-4 border-y border-stone-200 py-4">
          <strong class="text-3xl font-black">{{ dish.priceLabel ?? formatCurrency(unitPrice) }}</strong>
          <StatusPill :status="stockStatus" :label="stockLabel" />
        </div>

        <fieldset v-if="dish.upgrade" class="grid gap-3 rounded-lg border border-stone-200 bg-white p-4">
          <legend class="px-1 font-black text-stone-500">{{ dish.upgrade.label }}</legend>
          <label class="flex min-h-9 items-center gap-3">
            <input v-model="upgraded" class="accent-teal-700" type="checkbox" />
            {{ dish.upgrade.label }} +{{ formatCurrency(dish.upgrade.priceDelta) }}
          </label>
          <p class="text-sm text-stone-500">{{ dish.upgrade.description }}</p>
        </fieldset>

        <fieldset
          v-for="group in activeGroups"
          :key="group.id"
          class="grid gap-3 rounded-lg border border-stone-200 bg-white p-4"
        >
          <legend class="px-1 font-black text-stone-500">{{ group.label }}</legend>
          <label v-for="option in group.options" :key="option.label" class="flex min-h-9 items-center gap-3">
            <input
              v-model="selections[group.id]"
              class="accent-teal-700"
              type="radio"
              :name="group.id"
              :value="option.label"
            />
            {{ option.label }}
            <template v-if="option.priceDelta > 0">+{{ formatCurrency(option.priceDelta) }}</template>
          </label>
        </fieldset>

        <fieldset class="grid gap-3 rounded-lg border border-stone-200 bg-white p-4">
          <legend class="px-1 font-black text-stone-500">口味</legend>
          <label class="flex min-h-9 items-center gap-3">
            <input v-model="tasteOptions" class="accent-teal-700" type="checkbox" value="少醬" />
            少醬
          </label>
          <label class="flex min-h-9 items-center gap-3">
            <input v-model="tasteOptions" class="accent-teal-700" type="checkbox" value="不要芥末" />
            不要芥末
          </label>
        </fieldset>

        <label class="grid gap-2 text-sm font-black text-stone-500">
          餐點備註
          <textarea
            v-model="note"
            class="min-h-24 resize-y rounded-lg border border-stone-200 bg-white p-3 text-base font-normal text-stone-900 outline-none focus:border-teal-700"
            rows="3"
            placeholder="例如：切小塊、分開裝"
          />
        </label>

        <p v-if="dish.orderable && missingGroup" class="font-black text-amber-700">請選擇{{ missingGroup.label }}</p>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="grid w-fit grid-cols-[2.75rem_3.5rem_2.75rem] overflow-hidden rounded-lg border border-stone-200 bg-white">
            <button type="button" class="min-h-11 font-black" @click="addQuantity(-1)">-</button>
            <output class="grid place-items-center font-black">{{ quantity }}</output>
            <button type="button" class="min-h-11 font-black" @click="addQuantity(1)">+</button>
          </div>
          <button
            type="button"
            class="min-h-12 rounded-lg bg-teal-700 px-6 font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-40"
            :disabled="!dish.orderable || isClosed || Boolean(missingGroup)"
            @click="addItem"
          >
            {{ dish.orderable ? "加入購物車" : "請洽店員" }}
          </button>
        </div>
      </div>
    </section>
  </main>
</template>
