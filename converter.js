if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('./serviceworker.js')
        .then(registration => {
            console.log('service worker has been registered');
        })
        .catch(error => {
            console.log('service worker not rtegistered', error);
        })

}


converter = () =>  {
   let fromCurrency = window.document.getElementById('fromCurrency').value;
   let toCurrency = window.document.getElementById('toCurrency').value;
   let amount = window.document.getElementById('amount').value;
   
   fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${fromCurrency}_${toCurrency}&compact=ultra`)
    .then(  (response) =>{
        response.json().then((data) => {
             let conversion = data[`${fromCurrency}_${toCurrency}`];
             let result = amount * conversion;
             console.log(result);
             document.getElementById("rate").innerHTML = `1 ${fromCurrency} = ${conversion} ${toCurrency}`;
             document.getElementById("result").innerHTML = `${result} ${toCurrency}`;
             return result;
          
         })
         .catch(error => {
             console.log('no data in the response', error)
         })
   })
   .catch(error => {
        document.getElementById("rate").innerHTML = "";
        console.log("No internet")

   })
};

currencies = () => {
  
   fetch(`https://free.currencyconverterapi.com/api/v5/currencies`)
   .then(response => {
       response.json()
       .then(data => {
        let curr = data.results;
        // console.log(curr);
        Object.keys(curr).sort()
        .forEach((key, value) => {
            let currencyValue = curr[key];
            Object.keys(currencyValue)
            .forEach(name => {
                if (currencyValue['currencyName']) {
                    console.log("name[currencyName]", currencyValue['currencyName']);
                    console.log("name[id]", currencyValue['currencyName']);

                }
            })

            // console.log(curr[key]);
            let currency1 = document.getElementById("fromCurrency");   
            let currency2 = document.getElementById("toCurrency");     
            let option1  = document.createElement("option");
            let option2  = document.createElement("option");

            option1.text = key;
            option2.text = key;

            currency1.options.add(option1, -1);
            currency2.options.add(option2);

  
        })


    
        });

    })
};
   
database = () => {
    let database;
    let idb_request;
    idb_request = window.indexedDB.open('my-DB', 1);

    idb_request.addEventListener('error', event => {
        alert('could not open DB due to error')
    })


    idb_request.addEventListener('upgradeneeded', event => {
        console.log('creating database');
          // Save the IDBDatabase interface 
        let db = event.target.result;

        // Create an objectStore for this database
        let objectStore = db.createObjectStore("data", { autoIncrement: true });
    })

    idb_request.addEventListener('success', event => {
        console.log('Successfully created database');
        database = event.target.result;

    })

}    


