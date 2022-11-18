<template>
  <div class="mx-3 my-3">
    <b-jumbotron bg-variant="primary" text-variant="white" :header="`Welcome, ${name}`" />

    <h2>Orders</h2>
    <b-button @click="refresh" class="mb-2">Refresh</b-button>
    <b-table v-if="customer" :items="customer.orders" :fields="fields" />

    <h2>Draft Order</h2>
    Check the ingredients you want:
    <!-- Step 6(b) -->
    <b-list-group horizontal>
      <b-list-group-item v-for="ingredient, i in possibleIngredients" :key="i">
        <span>
          <b-button class="ml-3 add-ingredient" id="add-ingredient" @click="addIngredient(ingredient)">Add {{
              ingredient.name
          }}</b-button>
        </span>
      </b-list-group-item>
    </b-list-group>
    <!-- Step 6(c) -->
    <b-list-group>
      <b-list-group-list v-for="ingredientId, i in draftOrderIngredientIds" :key="i">
        {{ possibleIngredients.find(ingredient => ingredient._id === ingredientId)?.name }}
        <b-button class="ml-3" @click="deleteIngredient(ingredientId, i)">Delete</b-button>
      </b-list-group-list>
    </b-list-group>
    <!-- Step 6(d) -->
    <span>
      Your Total Cost:
      {{ totalCostDraft }}
    </span>
    <!-- Submit Order -->
    <div class="mt-2">
      <b-button @click="save">Save</b-button>
    </div>
    <div class="mt-2">
      <b-button @click="submit">Submit</b-button>
      Note: must save before submitting
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, Ref } from 'vue'
import { CustomerWithOrders, Ingredient } from "../../../server/data"

// props
interface Props {
  customerId: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  customerId: "",
})

const customer: Ref<CustomerWithOrders | null> = ref(null)

const name = computed(() => customer.value?.name || props.customerId)
const draftOrderIngredientIds: Ref<string[]> = ref([])
const possibleIngredients: Ref<Ingredient[]> = ref([])
// reactive variable to track draft order ingredients
const draftOrderIngredients = computed(
  () => draftOrderIngredientIds.value.map(id => possibleIngredients.value.find(i => i._id === id))
)
// reactive variables to calculate total cost
const draftOrderCost = computed(
  () => draftOrderIngredients.value.map(i => i?.price || 0)
)
const totalCostDraft = computed(
  () => draftOrderCost.value.reduce((oldPrice: number, newPrice: number) => oldPrice + newPrice, 0)
)
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
  possibleIngredients.value = await (await fetch("/api/possible-ingredients")).json()

  if (props.customerId) {
    customer.value = await (await fetch("/api/customer/" + encodeURIComponent(props.customerId))).json()
    draftOrderIngredientIds.value = (await (await fetch("/api/customer/" + encodeURIComponent(props.customerId) + "/draft-order")).json())?.ingredients || []
  }
}
onMounted(refresh)

async function save() {
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/draft-order",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ ingredientIds: draftOrderIngredientIds.value })
    }
  )
}

async function submit() {
  await fetch(
    "/api/customer/" + encodeURIComponent(props.customerId) + "/submit-draft-order",
    { method: "POST" }
  )
  await refresh()
}

function addIngredient(ingredient: Ingredient) {
  draftOrderIngredientIds.value.push(ingredient._id)
}

function deleteIngredient(ingredient: string, i: number) {
  draftOrderIngredientIds.value.splice(i, 1)
}
</script>