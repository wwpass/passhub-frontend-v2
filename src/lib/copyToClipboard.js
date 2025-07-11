
function createTextArea(text) {
  const textArea = document.createElement('textArea');
  textArea.value = text;
  document.body.appendChild(textArea);
  return textArea;
}

function selectText(textArea) {
  if (window.navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    textArea.setSelectionRange(0, 999999);
  } else {
    textArea.select();
  }
}

function copyToClipboard1(text) {
  const textArea = createTextArea(text);
  selectText(textArea);
  document.execCommand('copy');
  document.body.removeChild(textArea);
}


function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    windowClose();
  })
}

function startCopiedTimer() {
  setTimeout(() => {
    document
      .querySelectorAll(".copied")
      .forEach((e) => (e.style.display = "none"));
  }, 1000);
}


export { copyToClipboard, startCopiedTimer };