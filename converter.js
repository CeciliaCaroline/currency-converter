let currencyStore, conversionStore;
let db_request = window.indexedDB.open("myConverterDB", 1);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./dist/serviceworker.js")
    .then(registration => {
      console.log("service worker has been registered");
    })
    .catch(error => {
      console.log("service worker not rtegistered", error);
    });
}

document.getElementById("fromCurrency").addEventListener("click", () => {
  getCurrency();
});

// document.getElementById("toCurrency").addEventListener("click", () => {
//   getCurrency();
// });

document.getElementById("convert").addEventListener("click", () => {
  converter();
});

let converter = () => {
  let fromCurrency = window.document.getElementById("fromCurrency").value;
  let toCurrency = window.document.getElementById("toCurrency").value;
  let amount = window.document.getElementById("amount").value;
  let currencyPair = `${fromCurrency}_${toCurrency}`;

  fetch(
    `https://free.currencyconverterapi.com/api/v5/convert?q=${fromCurrency}_${toCurrency}&compact=ultra`
  )
    .then(response => {
      response
        .json()
        .then(data => {
          let conversion = data[`${fromCurrency}_${toCurrency}`];
          let result = amount * conversion;
          document.getElementById(
            "rate"
          ).innerHTML = `1 ${fromCurrency} = ${conversion} ${toCurrency}`;
          document.getElementById("result").innerHTML = `${result} ${toCurrency}`;
          dbConversion();

          conversionStore.put(conversion, currencyPair);
        })
        .catch(error => {
          console.log("no data in the response", error);
        });
    })
    .catch(error => {
      dbConversion();
      let getPair = conversionStore.get(currencyPair);
      getPair.onsuccess = () => {
        let conversion = getPair.result;
        let result = amount * conversion;
        document.getElementById(
          "rate"
        ).innerHTML = `1 ${fromCurrency} = ${conversion} ${toCurrency}`;
        document.getElementById("result").innerHTML = `${result} ${toCurrency}`;

        console.log("pair", getPair.result);
      };
      // console.log("No internet, fetch from url");
    });
};

let getCurrency = () => {

  fetch(`https://free.currencyconverterapi.com/api/v5/currencies`)
    .then(response => {
      response.json().then(data => {
        let curr = data.results;

        dbCurrency();
        dbPopulateOptions(curr);
      });
    })
    .catch(error => {
      dbCurrency();
      let storedCurrency = currencyStore.getAll();
      dbPopulateOptions(storedCurrency);
    });
};

let databaseSetUp = () => {
  // db_request = window.indexedDB.open('myConverterDB', 1);
  db_request.addEventListener("error", event => {
    alert("could not open DB due to error" + event.target.errorCode);
  });

  db_request.addEventListener("upgradeneeded", event => {
    // Save the IDBDatabase interface
    let db = db_request.result;

    // Create an objectStore for this database
    let currencyStore = db.createObjectStore("currencyStore");
    let conversionStore = db.createObjectStore("conversionStore");
  });
};

databaseSetUp();

let dbCurrency = () => {
  let database = db_request.result;
  let tx = database.transaction("currencyStore", "readwrite");
  currencyStore = tx.objectStore("currencyStore");
};

let dbConversion = () => {
  let database = db_request.result;
  let tx = database.transaction("conversionStore", "readwrite");
  conversionStore = tx.objectStore("conversionStore");
};

let dbPopulateOptions = curr => {
    let options = "";
    let currency1 = document.getElementById("fromCurrency");
    let currency2 = document.getElementById("toCurrency");

  Object.keys(curr)
    .sort()
    .forEach((key, value) => {
      let currencyValue = curr[key];
      currencyStore.put(currencyValue.currencyName, currencyValue.id);

      options += `<option value="${currencyValue["id"]}">${
        currencyValue["currencyName"]
      }</option>`;

    });
    currency1.innerHTML = options;
    currency2.innerHTML = options;
};

