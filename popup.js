const keyInput = document.getElementById("keyInput");
const valueInput = document.getElementById("valueInput");
const saveBtn = document.getElementById("saveBtn");
const kvList = document.getElementById("kvList");

function loadData() {
  chrome.storage.local.get({ kv: {} }, (res) => {
    renderList(res.kv);
  });
}

function saveData() {
  const key = keyInput.value.trim();
  const value = valueInput.value.trim();

  if (!key || !value) {
    alert("Enter both key and value");
    return;
  }

  chrome.storage.local.get({ kv: {} }, (res) => {
    const updated = res.kv;
    updated[key] = value;

    chrome.storage.local.set({ kv: updated }, () => {
      keyInput.value = "";
      valueInput.value = "";
      loadData();
    });
  });
}

function deleteKey(key) {
  chrome.storage.local.get({ kv: {} }, (res) => {
    const updated = res.kv;
    delete updated[key];

    chrome.storage.local.set({ kv: updated }, loadData);
  });
}

function copyValue(key, kv) {
  navigator.clipboard.writeText(kv[key]).then(() => {
    console.log("Copied");
  });
}

function renderList(kv) {
  kvList.innerHTML = "";

  const keys = Object.keys(kv);
  if (keys.length === 0) {
    kvList.innerHTML = "<p style='color:#666;'>No entries</p>";
    return;
  }

  keys.forEach(key => {
    const item = document.createElement("div");
    item.className = "item";

    const row = document.createElement("div");
    row.className = "row";

    const text = document.createElement("div");
    text.textContent = key;

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.className = "copy-btn";
    copyBtn.onclick = () => copyValue(key, kv);

    const delBtn = document.createElement("button");
    delBtn.textContent = "X";
    delBtn.className = "del-btn";
    delBtn.onclick = () => deleteKey(key);

    row.appendChild(text);
    row.appendChild(copyBtn);
    row.appendChild(delBtn);

    item.appendChild(row);

    kvList.appendChild(item);
  });
}

saveBtn.onclick = saveData;
document.addEventListener("DOMContentLoaded", loadData);
