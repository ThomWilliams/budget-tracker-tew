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

// request.onsuccess = function (e) {
//     console.log('success');
//     db = e.target.result;
  
//     // Check if app is online before reading from db
//     if (navigator.onLine) {
//       console.log('Backend online!');
//       checkDatabase();
//     }
//   };

// ERROR REQUEST
request.onerror = function (event) {
    console.log(`Error processing request! ${event.target.errorCode}`);
};

// SAVE RECORD
function saveRecord(record) {
    console.log('Save record invoked');
  const transaction = db.transaction(['BudgetStore'], 'readwrite');
  const store = transaction.objectStore('BudgetStore');
  // Add record to store 
  store.add(record);
}

// CHECK DATABASE
function checkDatabase() {
    console.log('check db invoked');
    let transaction = db.transaction(['BudgetStore'], 'readwrite');
    const store = transaction.objectStore('BudgetStore');
  
    // Get all records from store 
    const getAll = store.getAll();
  
    // If the request was successful
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((res) => {
            // If returned response is not empty, Open another transaction
            if (res.length !== 0) {
              transaction = db.transaction(['BudgetStore'], 'readwrite');
  
              // Assigns current store to a currentStore variable
              const currentStore = transaction.objectStore('BudgetStore');
  
              // Clears existing entries 
              currentStore.clear();
              console.log('Store cleared');
            }
          });
      }
    };
  }

window.addEventListener("online", checkDatabase);
