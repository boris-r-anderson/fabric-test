<template>
  <v-app-bar>
    <v-app-bar-title> Boris Anderson - Fabric Test </v-app-bar-title>
  </v-app-bar>
  <v-container>
    <v-row>
      <v-col>
        <v-btn width="300px" title="Button 1" @click="buttonPress(1)"
          >Search "Matrix"</v-btn
        >
      </v-col>
      <v-col>
        <v-btn width="300px" title="Button 2" @click="buttonPress(2)"
          >Search "Matrix Reloaded"</v-btn
        >
      </v-col>
      <v-col>
        <v-btn width="300px" title="Button 3" @click="buttonPress(3)"
          >Search "Matrix Revolutions"</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-data-table :items="data" :headers="headers" :loading="loading">
        <template v-slot:item.Poster="{ value }">
          <v-img v-if="value != 'N/A'" :src="value" />
        </template>
      </v-data-table>
    </v-row>
    <v-snackbar v-model="showError" timeout="2000">
      {{ errorMsg }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

// Types
interface RecordResult {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

const headers = [
  {
    title: 'Title',
    key: 'Title',
  },
  {
    title: 'Release Year',
    key: 'Year',
  },
  {
    title: 'IMDb Id',
    key: 'imdbID',
  },
  {
    title: 'Type',
    key: 'Type',
  },
  {
    title: 'Poster',
    key: 'Poster',
    sortable: false,
  },
]

// Misc variables
const errorMsg = ''
const showError = computed(() => errorMsg.length > 0)
let loading = false

// Table data
let data: Array<RecordResult> = reactive([])

const buttonPress = async (button: number) => {
  try {
    loading = true
    const apiResponse: Response = await fetch(
      `http://localhost:8000/api/button-${button}`
    )

    if (!apiResponse.ok) {
      throw 'Invalid response received'
    }

    // Read response and set data to table
    const resBody = await apiResponse.json()

    data.length = 0
    data.push(...resBody.results)
    // console.log(resBody.results)
    loading = false
  } catch (error) {
    loading = false
    console.error(`Failed to fetch data for button ${button}`)
  }
}
</script>
