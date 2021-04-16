const products = [{name: prod1, price: 100, rating: 5}, {name: prod3, price: 600, rating: 2}, {name: prod2, price: 200, rating: 3}]


//Imparativt
let bestProducts = [];

for (let i = 0; i > products.length; i++) {
    if (product[i].price >= 100 && product[i].rating >=5) {
        bestProducts.push(product[i]);
    }
}

//Deklarativt
let bestProducts = products.filter(product => product.price >= 100 && product.rating >=5);

//Lurest:

//I en annen fil
function getBestProducts() {
    return products.filter(product => product.price >= 100 && product.rating >=5)
}


let bestProducts = getBestProducts();

//Funksjonell programmering - pure functions



//Ikke funksjonell, fordi den har en sideeffekt. Refererer til variable som ikke fins inne i funksjonen. Prøv å unngå slike sideeffekter.
let count = 0;

function increment() {
    count = count +1
}

increment();
//API-call, skrice til fil, endre ekstern variabel - alt er sideeffekter.

//Funksjonell:

function incrementNumber(number) {
    return number + 1;
}

const newNumber = incrementNumber(0);

