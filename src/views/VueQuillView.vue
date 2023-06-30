<template>
  <div>
    <h1 class="text-2xl font-bold">VueQuill</h1>
    <h2 class="text-xl font-bold mt-4">ツールバー(full)あり</h2>
    <button
      @click="handleClick"
      class="bg-purple-500 hover:bg-purple-700 text-white px-2 my-2 rounded-full"
    >
      HTMLをコピー
    </button>
    <QuillEditor
      theme="snow"
      toolbar="full"
      :content="myContent"
      contentType="html"
      ref="richEditor"
      class="border border-solid border-current border-slate-200 mt-1"
    />
    <h2 class="text-xl font-bold mt-4">カスタマイズ可能なエディタ</h2>
    <p class="text-sm">Ctrl+U（下線）など使えなくしています</p>
    <CustomizedEditor />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { htmlContent } from './contents/vueQuillContents.js'
import { copyToClipboard } from '@/utils/clipboard.js'
import CustomizedEditor from '@/components/CustomizedEditor.vue'

const richEditor = ref()
const myContent = ref(htmlContent)

const handleClick = () => {
  copyToClipboard(JSON.stringify(richEditor.value.getHTML()))
}
</script>
