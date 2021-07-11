const indexedDB =
  window.indexedDB ||
  window.shimIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.mozIndexedDB;

let db;

const request = indexedDB.open("BudgetStore", 1);

// UPGRADE ON REQUEST
request.onupgradeneeded = ({ target }) => {
  console.log("Upgrade IndexDB");
  db = target.result;
  db.createObjectStore("BudgetStore", { autoIncrement: true });
};

// SUCCESS REQUEST
request.onsuccess = ({ target }) => {
  db = target.result;

  if (navigator.onLine) {
    console.log("Backend online!");
    checkLiveDatabase();
  }
};

// ERROR REQUEST
request.onerror = function (event) {
  console.log(`Error processing request! ${event.target.errorCode}`);
};

// SAVE RECORD
function saveRecord(record) {
  console.log("Save record invoked");
  const transaction = db.transaction(["BudgetStore"], "readwrite");
  const store = transaction.objectStore("BudgetStore");
  // Add record to store
  store.add(record);
}

// CHECK DATABASE
function checkLiveDatabase() {
  console.log("check db invoked");
  let transaction = db.transaction(["BudgetStore"], "readwrite");
  const store = transaction.objectStore("BudgetStore");

  // Get all records from store
  const getAll = store.getAll();

  // If the request was successful
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transactions/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          // If returned response is not empty, Open another transaction
          if (res.length !== 0) {
            transaction = db.transaction(["BudgetStore"], "readwrite");

            // Assigns current store to a currentStore variable
            const currentStore = transaction.objectStore("BudgetStore");

            // Clears existing entries
            currentStore.clear();
            console.log("Store cleared");
          }
        });
    }
  };
}

window.addEventListener("online", checkLiveDatabase);
