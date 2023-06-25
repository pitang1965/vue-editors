<template>
  <div>
    <h1 class="text-2xl font-bold">VueQuill</h1>
    <button
      @click="handleClick"
      class="bg-purple-500 hover:bg-purple-700 text-white p-2 my-4 rounded-full"
    >
      contentを表示
    </button>
    <QuillEditor theme="snow" v-model:content="inputValue" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const inputValue = ref({
  ops: [{ insert: 'Hello ' }, { insert: 'world', attributes: { bold: true } }, { insert: '\n' }]
})

const handleClick = () => {
  alert(JSON.stringify(inputValue))
}
</script>
