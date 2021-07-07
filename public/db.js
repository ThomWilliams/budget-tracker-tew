const indexedDB =
  window.indexedDB ||
  window.shimIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.mozIndexedDB;

let db;

const request = indexedDB.open("budget", 1);

// UPGRADE ONE REQUEST
request.onupgradeneeded = ({ target }) => {
  console.log("Upgrade IndexDB");

  const { olderVersion } = e;
  const newerVersion = e.newerVersion || db.version;

  console.log(`Index DB Updated from previous version ${olderVersion} to new version ${newerVersion}`);

  db = target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore("BudgetTracker", { autoIncrement: true });
  }
};

// SUCCESS REQUEST

request.onsuccess = ({ target }) => {

    
};

// ERROR REQUEST
request.onerror = function (event) {};

// SAVE RECORD

function saveRecord(record) {}

// CHECK DATABASE

function checkDatabase() {}

window.addEventListener("online", checkDatabase);
