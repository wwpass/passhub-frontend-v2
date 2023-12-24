
let theItem = null;
let timer = null;
const copyBufferTimeout = 40;

let copyBufferListeners = [];

function peekCopyBuffer() {
  return theItem;
}

function isCopyBufferEmpty() {
  return theItem === null;
}

function popCopyBuffer() {
  const result = theItem;
  theItem = null;
  if(timer) {
    clearTimeout(timer);
  }
  copyBufferListeners.forEach(f => f());
  return result;
}

function putCopyBuffer(item) {
  theItem = item;
  if(timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(popCopyBuffer, copyBufferTimeout*1000)
  copyBufferListeners.forEach(f => f());
}


function copyBufferAddListener(f) {
  copyBufferListeners.push(f);
}

function copyBufferRemoveListener(f) {
  copyBufferListeners = copyBufferListeners.filter((e) => e !== f);
}

export {
  peekCopyBuffer,
  isCopyBufferEmpty,
  popCopyBuffer,
  putCopyBuffer,
  copyBufferAddListener,
  copyBufferRemoveListener,
  copyBufferTimeout
};


