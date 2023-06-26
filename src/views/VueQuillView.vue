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
    <h2 class="text-xl font-bold mt-4">ツールバーなし</h2>
    <QuillEditor
      theme=""
      toolbar="none"
      contentType="text"
      content="Hello world!"
      class="border border-solid border-current border-slate-200 mt-2"
      ref="textEditor"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { htmlContent } from './contents/vueQuillContents.js'
import { copyToClipboard } from '../utils/clipboard.js'

const richEditor = ref()
const textEditor = ref()
const myContent = ref(htmlContent)

const handleClick = () => {
  copyToClipboard(JSON.stringify(richEditor.value.getHTML()))
}

onMounted(() => {
  deleteKeybinding(85) // Ctrl+U 又は Cmd+U
  deleteKeybinding(73) // Ctrl+I 又は Cmd+I
  deleteKeybinding(66) // Ctrl+B 又は Cmd+B
})

// Ctrl + keyCode 及び Cmd + keyCodeのキーバインディングの削除
const deleteKeybinding = (keyCode) => {
  const quill = textEditor.value.getQuill()
  const Keyboard = quill.getModule('keyboard')
  delete Keyboard.bindings[keyCode]
  Keyboard.addBinding({
    key: keyCode,
    metaKey: true, // Cmd 又は Ctrlキー
    handler:() => {
      // 何も実行しない
      return false
    }
  })
}
</script>
