<template>
  <div class="mx-3 my-3">
    <b-jumbotron header="Smoothie Status" />
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table :items="orders" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref} from 'vue'
import { BJumbotron, BButton, BTable } from 'bootstrap-vue';
import { Ingredient, Order } from '../../../server/data';

const orders: Ref<Order[]> = ref([])
const possibleIngredients: Ref<Ingredient[]> = ref([])
const fields = [
  {
    key: "_id",
    label: "ID"
  },
  {
    key: "customerId",
    label: "customerId"
  },
  {
    key: "state",
    label: "state"
  },
  {
    key: "operatorId",
    label: "operatorId"
  },
  {
    key: "ingredientIds",
    label: "Ingredients",
    formatter: (ingredientIds: string[] | null) => {
      let ingredients = ingredientIds?.map(
        (id: string) => possibleIngredients.value.find(i => i._id === id)?.name
      )
      return ingredients?.toString()
    }
  }
]
async function refresh() {
  orders.value = await (await fetch("/api/orders")).json()
}
onMounted(refresh)
</script>