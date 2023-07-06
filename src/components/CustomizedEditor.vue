<template>
  <div class="text-sm m-2">行数：{{ numLines }}</div>
  <div class="flex gap-2">
    <label>背景色</label>
    <n-color-picker size="small" v-model:value="backgroundColor" on-update="backgroundColor" class="w-40" />
    <label>文字色</label>
    <n-color-picker size="small" v-model:value="textColor" on-update="textColor" class="w-40" />

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
      @focus="onFocus"
      @blur="onBlur"
      @selectionChange="onSelectionChange"
      ref="textEditor"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { NColorPicker} from 'naive-ui'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const initialLineNumbers = `1
2
3`

const initialContent = `Hello world!
2行目
3行目`

let quillRef = ref(null)

const numLines = ref(0)
const textEditor = ref()
const backgroundColor = ref('#F5E3F9FF')
const textColor = ref('#1F2DC9FF')
const showLineNumber = ref(true)
const showHighlight = ref(true)
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

const changeFontFamily = () => {
  fontFamily.value = fontFamily.value === fontSans ? fontSerif : fontSans
}

const changeFontSize = () => {
  fontSize.value = fontSize.value === '1rem' ? '1.25rem' : '1rem'
}

const onContentChange = (content) => {
  numLines.value = content.split('\n').length - 1

  // 行番号の生成（今は表示していなくても生成している）
  lineNumbers.value = Array.from({ length: numLines.value }, (_, i) => i + 1).join('\n')
}

const onReady = (quill) => {
  // 現在の行数の取得
  const contents = quill.getContents()

  quillRef.value = quill

  let totalLines = 0

  for (let op of contents.ops) {
    if (typeof op.insert === 'string') {
      totalLines += op.insert.split('\n').length - 1
    }
  }

  numLines.value = totalLines
}

// Quill Editorにフォーカスが入ったときに呼ばれる。フォーカス後にQuill Editor内の別の行などをクリックしても呼ばれない。
const onFocus = () => {
  if (!showHighlight.value) return

  // ユーザーの選択範囲を取得 (https://quilljs.com/docs/api/#getselection)
  const range = quillRef.value.getSelection()

  focusLine(range.index)
}

const onBlur = () => {
  if (!showHighlight.value) return
  unfocusLine()
}

const onSelectionChange = (range) => {
  if (!showHighlight.value) return
  unfocusLine()
  focusLine(range.range.index)
}

const focusLine = (rangeIndex) => {
  // クリックした行に下線を引く
  let index = rangeIndex
  const content = quillRef.value.getText()
  if (content[index] === '\n') {
    index = 0 <= index - 1 ? index - 1 : index
  }
  let beforeNewline = content.lastIndexOf('\n', index)
  let afterNewline = content.indexOf('\n', index)

  if (beforeNewline === -1) beforeNewline = 0
  if (afterNewline === -1) afterNewline = content.length

  quillRef.value.formatText(beforeNewline, afterNewline - beforeNewline, 'underline', true)
}

const unfocusLine = () => {
  // テキスト全体の下線を解除
  const length = quillRef.value.getLength()
  quillRef.value.formatText(0, length, 'underline', false)
}
</script>
