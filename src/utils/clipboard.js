export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    console.log('Copied to clipboard')
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
