<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand href="#">This is my discussion board</b-navbar-brand>      
    </b-navbar>

    <b-container fluid class="my-4">
      <b-row>
        <b-col xs="12" sm="3">
          <b-button> New Posts</b-button>
        </b-col>
        <b-col xs="12" sm="3">

          <b-list-group flush>
            <b-list-group-item>
              10086
            </b-list-group-item>

            <span @click="alert">1</span>

            <b-list-group-item>
              10086
            </b-list-group-item>
            <b-list-group-item>
              10086
            </b-list-group-item>
          </b-list-group>


        </b-col>
        <b-col xs="12" sm="6">
          <b-card>
            10086
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    
  </div>
</template>

<script setup lang="ts">
function alert(){
  alert(10086)
}
</script>