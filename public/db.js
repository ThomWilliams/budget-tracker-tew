const indexedDB =
  window.indexedDB ||
  window.shimIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.mozIndexedDB;

let db;

const request = indexedDB.open("budget", 1);

// UPGRADE ON REQUEST
request.onupgradeneeded = ({ target }) => {
  console.log("Upgrade IndexDB");

  const { olderVersion } = e;
  const newerVersion = e.newerVersion || db.version;

  console.log(`Index DB Updated from previous version ${olderVersion} to new version ${newerVersion}`);

  db = target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore("BudgetStore", { autoIncrement: true });
  }
};

// SUCCESS REQUEST
request.onsuccess = ({ target }) => {
    db = request.result;
    tx = db.transaction("BudgetStore", "readWrite")
    store = tx.objectStore("BudgetStore")
    console.log(target, "Request Successful!")
};

// ERROR REQUEST
request.onerror = function (event) {
    console.log(`Error processing request! ${event.target.errorCode}`);
};

// SAVE RECORD
function saveRecord(record) {
    console.log('Save record invoked');
    // Create transaction on BudgetStore db
  const transaction = db.transaction(['BudgetStore'], 'readwrite');
  // Access to BudgetStore object store
  const store = transaction.objectStore('BudgetStore');
  // Add record to store 
  store.add(record);
}

// CHECK DATABASE

function checkDatabase() {
    
}

window.addEventListener("online", checkDatabase);
