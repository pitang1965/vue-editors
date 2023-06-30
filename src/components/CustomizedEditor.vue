<template>
  <div class="text-sm m-2">行数：{{ numLines }}</div>
  <div class="flex gap-2">
    <button
      @click="changeBackgroundColor"
      class="px-2 py-1 bg-slate-200 text-sm text-black hover:bg-slate-400 border-2 border-slate-300 rounded-full"
    >
      背景色
    </button>

    <button
      @click="changeTextColor"
      class="px-2 py-1 bg-slate-200 text-sm text-black hover:bg-slate-400 border-2 border-slate-300 rounded-full"
    >
      文字色
    </button>

    <div class="flex items-center gap-2">
      <input type="checkbox" id="cb-show-line-number" v-model="showLineNumber" />
      <label for="cb-show-line-number">行番号を表示</label>
    </div>

    <div class="flex items-center gap-2">
      <input type="checkbox" id="cb-show-highlight" v-model="showHighlight" />
      <label for="cb-show-highlight">ハイライト</label>
    </div>

    <button
      @click="changeFontFamily"
      class="px-2 py-1 bg-slate-200 text-sm text-black hover:bg-slate-400 border-2 border-slate-300 rounded-full"
    >
      フォントファミリー
    </button>

    <button
      @click="changeFontSize"
      class="px-2 py-1 bg-slate-200 text-sm text-black hover:bg-slate-400 border-2 border-slate-300 rounded-full"
    >
      フォントサイズ
    </button>
  </div>

  <div class="flex mt-2">
    <QuillEditor
      v-if="showLineNumber"
      theme=""
      contentType="text"
      :content="lineNumbers"
      class="border border-solid border-current border-slate-200"
      :style="{ color: textColor, backgroundColor, fontFamily, fontSize }"
      :readOnly="true"
      @ready="onReady"
      @update:content="onContentChange"
      ref="textEditor"
    />
    <QuillEditor
      theme=""
      contentType="text"
      :content="initialContent"
      class="border border-solid border-current border-slate-200"
      :style="{ color: textColor, backgroundColor, fontFamily, fontSize }"
      @ready="onReady"
      @update:content="onContentChange"
      ref="textEditor"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const initialLineNumbers = `1
2
3`

const initialContent = `Hello world!
2行目
3行目`

const numLines = ref(0)
const textEditor = ref()
const backgroundColor = ref('#ffffff')
const textColor = ref('#000000')
const showLineNumber = ref(false)
const showHighlight = ref(false)
const fontSans = `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
const fontSerif = `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`
const fontFamily = ref(fontSans)
const fontSize = ref('1rem')
const lineNumbers = ref('')

onMounted(() => {
  deleteKeybinding(85) // Ctrl+U 又は Cmd+U
  deleteKeybinding(73) // Ctrl+I 又は Cmd+I
  deleteKeybinding(66) // Ctrl+B 又は Cmd+B

  lineNumbers.value = initialLineNumbers
})

// Ctrl + keyCode 及び Cmd + keyCodeのキーバインディングの削除
const deleteKeybinding = (keyCode) => {
  const quill = textEditor.value.getQuill()
  const Keyboard = quill.getModule('keyboard')
  delete Keyboard.bindings[keyCode]
  Keyboard.addBinding({
    key: keyCode,
    metaKey: true, // Cmd 又は Ctrlキー
    handler: () => {
      // 何も実行しない
      return false
    }
  })
}

const changeBackgroundColor = () => {
  backgroundColor.value = backgroundColor.value === '#ffffff' ? '#50d71e' : '#ffffff'
}

const changeTextColor = () => {
  textColor.value = textColor.value === '#000000' ? '#ff00ff' : '#000000'
}

const changeFontFamily = () => {
  fontFamily.value = fontFamily.value === fontSans ? fontSerif : fontSans
}

const changeFontSize = () => {
  fontSize.value = fontSize.value === '1rem' ? '1.25rem' : '1rem'
}

const onContentChange = (content) => {
  numLines.value = content.split('\n').length - 1

  // 行番号の生成（今は表示していなくても生成している）
  lineNumbers.value = Array.from({length: numLines.value}, (_, i) => i + 1).join('\n')

}

const onReady = (quill) => {
  // 現在の行数の取得
  const contents = quill.getContents()

  let totalLines = 0

  for (let op of contents.ops) {
    if (typeof op.insert === 'string') {
      totalLines += op.insert.split('\n').length - 1
    }
  }

  numLines.value = totalLines
}
</script>
