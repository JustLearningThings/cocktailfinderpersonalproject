class Cocktail {
    constructor(name, type, category, ingredients, ingredientMeasures, instructions, image, iba) {
        this.name = name;
        this.type = type;
        this.category = category;
        this.ingredients = ingredients;
        this.ingredientMeasures = ingredientMeasures;
        this.instructions = instructions;
        this.imageURL = image;
        this.iba = iba;
    }

//upcoming methods
}

function createSearchQueryFromInput() {
    let input = document.getElementById('search').value;

    if(typeof input === 'string')
        return `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`;
    return undefined;
}

// function randomNumber(upto) {
//     return Math.round(Math.random() * upto);
// }

function getIngredients(drink) {
    let baseStr = 'strIngredient';
    let ingredients = [];
    let i = 1;

    while(drink[baseStr + i] != null) {
        ingredients.push(drink[baseStr + i]);
        i++;
    }
    return ingredients;
}

function getMeasures(drink) {
     let baseStr = 'strMeasure';
     let measures = [];
     let i = 1;
     
     while(drink[baseStr + i] != null) {
         measures.push(drink[baseStr + i]);
         i++;
        }
        return measures;
    }
    
function createCocktail(json) {
    return new Cocktail(json.strDrink, json.strAlcoholic, json.strCategory, getIngredients(json), getMeasures(json), json.strInstructions, json.strDrinkThumb, json.strIBA);
}

async function getRandomCocktail() {
    let URL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
    if(URL === undefined) throw 'Invalid API URL';

    try {
        let data = await fetch(URL);
        data = await data.json()
        return data.drinks[0];
   }
    catch(e)  {
        updateRandomCocktailDOMOnError();
        throw e;
    };
}

function updateRandomCocktailDOM(drink) {
    document.getElementById('cocktailImage').src = drink.imageURL;
    document.getElementById('cocktailName').innerText = drink.name; 

    let ingredientsStr = '';
    for(let i = 0;i < drink.ingredients.length;i++) {
        ingredientsStr += `${drink.ingredients[i].toLowerCase()}`;
        if(drink.ingredients.length - i !== 1) ingredientsStr += ', ';
    } ingredientsStr += ' .';

    document.getElementById('cocktailBrief').innerText = `This ${drink.type.toLowerCase()} drink is made out of ${ingredientsStr}`;
}

function updateRandomCocktailDOMOnError() {
    document.getElementById('cocktailImage').src = './images/loadingDrink.jpg'
    document.getElementById('cocktailBrief').innerText = 'This unkown cocktail is made out of unknown ingredients';
    document.getElementById('cocktailName').innerText = 'Unknown cocktail';
}

async function searchCocktail() {
    let url = createSearchQueryFromInput();
    if(url === undefined) throw 'Invali API URL';

    let data = await fetch(url);
    data = await data.json();
    return data.drinks;
}

function displayInputError() {
    let input = document.getElementById('search');
    let text = document.getElementsByTagName('label');

    input.classList.add('input-error');
    setTimeout(() => {
        input.classList.remove('input-error');
    }, 1100);
}

// search event
document.getElementById('search').addEventListener('keydown', async function(event) {
    if (event.keyCode === 13 && document.getElementById('search').value !== '') {
        let data = await searchCocktail();
        if(data === null) {
            displayInputError();
            throw 'Invalid input';
        }
    }
});

// button event
document.getElementById('again').addEventListener('click', () =>
    getRandomCocktail().then(data => createCocktail(data)).then(cocktail => updateRandomCocktailDOM(cocktail))
);


getRandomCocktail()
.then(data => createCocktail(data))
.then(cocktail => updateRandomCocktailDOM(cocktail));
