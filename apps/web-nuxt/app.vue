<script setup lang="ts">
import { computed, ref } from "vue";
import { dishes, orderTickets } from "./data/menu";
import type { CartItem, Dish, Page, StockStatus } from "./types";

useHead({
  htmlAttrs: {
    lang: "zh-Hant"
  },
  title: "餐廳點餐系統",
  meta: [
    {
      name: "description",
      content: "單店餐廳 QR Code 點餐系統，支援客人點餐、餐點詳情、購物車與店員供應狀態控制。"
    }
  ]
});

const activePage = ref<Page>("menu");
const selectedDishId = ref(dishes[0]?.id ?? "");
const cart = ref<CartItem[]>([]);
const toastMessage = ref("");
let toastTimer: ReturnType<typeof setTimeout> | undefined;

const inventory = ref<Record<string, StockStatus>>(
  dishes.reduce<Record<string, StockStatus>>((state, dish) => {
    state[dish.id] = dish.status;
    return state;
  }, {})
);

const selectedDish = computed(() => dishes.find((dish) => dish.id === selectedDishId.value) ?? dishes[0]);
const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0));
const selectedDishStockStatus = computed<StockStatus>(() => {
  if (!selectedDish.value) return "closed";
  return inventory.value[selectedDish.value.id] ?? selectedDish.value.status;
});
const headerCopy = computed(() => {
  if (activePage.value === "staff") {
    return {
      eyebrow: "Staff",
      title: "現場控制台",
      subtitle: "快速確認待出餐與今日供應狀態。"
    };
  }

  if (activePage.value === "dish") {
    return {
      eyebrow: "桌號 A03",
      title: "餐點詳情",
      subtitle: "選好份量與備註後加入購物車。"
    };
  }

  return {
    eyebrow: "桌號 A03",
    title: "今日點餐",
    subtitle: "4 位用餐中，送單前可自由調整品項。"
  };
});

function showToast(message: string) {
  toastMessage.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = "";
  }, 2200);
}

function navigate(page: Page) {
  activePage.value = page;
}

function openDish(dishId: string) {
  selectedDishId.value = dishId;
  activePage.value = "dish";
}

function addToCart(dish: Dish, quantity: number, options: string, price: number) {
  if (inventory.value[dish.id] === "closed") {
    showToast("此品項目前暫停供應");
    return;
  }

  const existing = cart.value.find((item) => item.id === dish.id && item.options === options && item.price === price);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.value.push({
      id: dish.id,
      name: dish.name,
      price,
      quantity,
      options
    });
  }
  showToast("已加入購物車");
}

function updateCartQuantity(index: number, delta: number) {
  const item = cart.value[index];
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
}

function removeCartItem(index: number) {
  cart.value.splice(index, 1);
}

function clearCart() {
  cart.value = [];
  showToast("購物車已清空");
}

function submitOrder() {
  if (cart.value.length === 0) {
    showToast("請先加入餐點");
    return;
  }

  cart.value = [];
  showToast("訂單已送出，請等待店員確認");
}

function toggleInventory(dishId: string) {
  const dish = dishes.find((item) => item.id === dishId);
  if (!dish) return;
  inventory.value[dishId] = inventory.value[dishId] === "closed" ? dish.status : "closed";
  showToast(`${dish.name}已${inventory.value[dishId] === "closed" ? "暫停供應" : "開放供應"}`);
}

function resetInventory() {
  inventory.value = dishes.reduce<Record<string, StockStatus>>((state, dish) => {
    state[dish.id] = dish.status;
    return state;
  }, {});
  showToast("展示資料已還原");
}
</script>

<template>
  <div class="min-h-screen bg-[#fbfaf7] text-stone-900">
    <AppHeader
      :eyebrow="headerCopy.eyebrow"
      :title="headerCopy.title"
      :subtitle="headerCopy.subtitle"
      :active-page="activePage"
      @navigate="navigate"
    />

    <CustomerMenu
      v-if="activePage === 'menu'"
      :dishes="dishes"
      :inventory="inventory"
      :cart="cart"
      :cart-total="cartTotal"
      @add-to-cart="addToCart"
      @open-dish="openDish"
      @clear-cart="clearCart"
      @submit-order="submitOrder"
      @increase-cart="updateCartQuantity($event, 1)"
      @decrease-cart="updateCartQuantity($event, -1)"
      @remove-cart="removeCartItem"
    />

    <DishDetail
      v-else-if="activePage === 'dish' && selectedDish"
      :dish="selectedDish"
      :stock-status="selectedDishStockStatus"
      @back="navigate('menu')"
      @add-to-cart="addToCart"
    />

    <StaffConsole
      v-else
      :dishes="dishes"
      :inventory="inventory"
      :tickets="orderTickets"
      @toggle-inventory="toggleInventory"
      @reset-inventory="resetInventory"
    />

    <ToastMessage :message="toastMessage" />
  </div>
</template>
