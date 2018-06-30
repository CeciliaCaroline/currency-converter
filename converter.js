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

document.getElementById("toCurrency").addEventListener("click", () => {
  getCurrency();
});

document.getElementById("convert").addEventListener("click", () => {
  converter();
});

let converter = () => {
  let fromCurrency = window.document.getElementById("fromCurrency").value;
  let toCurrency = window.document.getElementById("toCurrency").value;
  let amount = window.document.getElementById("amount").value;

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
          document.getElementById(
            "result"
          ).innerHTML = `${result} ${toCurrency}`;
          let database = db_request.result;
          let tx = database.transaction("conversionStore", "readwrite");
          conversionStore = tx.objectStore("conversionStore");
          let currencyPair = `${fromCurrency}_${toCurrency}`;
          conversionStore.put(conversion);

          //  return result;
        })
        .catch(error => {
          console.log("no data in the response", error);
        });
    })
    .catch(error => {
      document.getElementById("rate").innerHTML = "No Internet";
      document.getElementById("result").innerHTML = "";

      console.log("No internet, fetch from url");
    });
};

let getCurrency = () => {
  fetch(`https://free.currencyconverterapi.com/api/v5/currencies`)
    .then(response => {
      response.json().then(data => {
        let curr = data.results;
        Object.keys(curr)
          .sort()
          .forEach((key, value) => {
            let currencyValue = curr[key];
            let database = db_request.result;
            let tx = database.transaction("currencyStore", "readwrite");
            currencyStore = tx.objectStore("currencyStore");
            // currencyIndex = currencyStore.index('currencyName');

            currencyStore.put({
              id: currencyValue["id"],
              currencyName: currencyValue["currencyName"]
            });

            let currency1 = document.getElementById("fromCurrency");
            let currency2 = document.getElementById("toCurrency");
            let option1 = document.createElement("option");
            let option2 = document.createElement("option");

            option1.text = currencyValue["currencyName"];
            option1.value = currencyValue["id"];
            option2.text = currencyValue["currencyName"];
            option2.value = currencyValue["id"];

            currency1.options.add(option1, -1);
            currency2.options.add(option2);
          });
      });
    })
    .catch(error => {
      console.log("error................", error);
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
    let conversionStore = db.createObjectStore("conversionStore", {
      autoIncrement: true
    });

    // let currencyStore = db.createObjectStore("currenciesStore", { autoIncrement: true});
    // let currencyIndex = currencyStore.createIndex('currencyName','currencyName');
  });
};

databaseSetUp();

let addCurrency = () => {
  console.log("Successfully created database");
  let database = db_request.result;
  let tx = database.transaction("currencyStore", "readwrite");
  currencyStore = tx.objectStore("currencyStore");

  currencyStore.put({
    id: currencyValue["id"],
    currencyName: currencyValue["currencyName"]
  });
};
