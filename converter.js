let currencyStore, conversionStore;
let db_request = window.indexedDB.open("myConverterDB", 1);
let options = "";
let currency1 = document.getElementById("fromCurrency");
let currency2 = document.getElementById("toCurrency");


if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("serviceworker.js")
    .then(registration => {
      console.log("service worker has been registered");
    })
    .catch(error => {
      console.log("service worker not rtegistered", error);
    });
}
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

      };
    });
};

let getCurrency = () => {

  fetch(`https://free.currencyconverterapi.com/api/v5/currencies`)
    .then(response => {
      response.json().then(data => {
        let currency = data.results;

        dbCurrency();
        dbPopulateOptions(currency);
      });
    })
    .catch(error => {
      dbCurrency();
      let storedCurrency = currencyStore.getAll();
      storedCurrency.onsuccess = () => {
        let results = storedCurrency.result;
        results.forEach((key) => {
          let currencyValue = key["currencyName"]; 
          let currencyId = key["id"];
    
          options += `<option value="${currencyId}">${
            currencyValue
          }</option>`;
    
        });
        currency1.innerHTML = options;
        currency2.innerHTML = options;
        
      };
      
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
    let currencyStore = db.createObjectStore("currencyStore", {
      keyPath: "id"
    });
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

let dbPopulateOptions = currency => {


  Object.keys(currency)
    .sort()
    .forEach((key, value) => {
      let currencyValue = currency[key];
      currencyStore.put({
        "id": currencyValue["id"],
        "currencyName": currencyValue["currencyName"]
      });

      options += `<option value="${currencyValue["id"]}">${
        currencyValue["currencyName"]
      }</option>`;

    });
    currency1.innerHTML = options;
    currency2.innerHTML = options;
};
window.onload = () => {
  getCurrency();
  }
