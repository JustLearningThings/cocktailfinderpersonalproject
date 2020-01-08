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
}

// state variable for search results
let resultDisplayied = false;


function createSearchQueryFromInput() {
    let input = document.getElementById('search').value;

    if(typeof input === 'string')
        return `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input.toLowerCase()}`;
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
        let data = await fetch(URL).then(data => data.json());
        //data = await data.json();
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

function displaySearchResults() {
    document.getElementById('search-results').style.display = 'block';
}

// tough one, this function
function createResult(data) {
    // RESULT DIV
    let result = document.createElement('div');
    result.classList.add('result');

    // create a span
    let span = document.createElement('span');
    span.classList.add('result-name');
    // add cocktail name to the span's text
    span.innerText = data.name;
    // append span to parent div
    result.appendChild(span);

    // then just add the icon
    let icon = document.createElement('i');
    // add the necessary classes
    icon.classList.add('fa');
    icon.classList.add('fa-chevron-down');
    icon.ariaHidden = 'true';
    // append icon to parent div
    result.appendChild(icon);


    // RESULT-CONTENT DIV
    let content = document.createElement('div');
    content.classList.add('result-content');
    // .RESULT-CONTENT -> .CONTENT-MAIN
    let main = document.createElement('div');
    main.classList.add('content-main');

    // create children of main (img and 3 ps)
    let img = document.createElement('img');
    img.classList.add('content-img');
    img.src = data.imageURL;
    img.alt = `An image of ${data.name}`;

    let cType = document.createElement('p');
    cType.classList.add('content-type');
    cType.innerText = `Type: ${data.type}`;

    let cCategory = document.createElement('p');
    cCategory.classList.add('content-category');
    cCategory.innerText = `Category: ${data.category}`;

    let cIBA = document.createElement('p');
    let iba = data.iba ? data.iba : 'Unranked';
    cIBA.classList.add('content-iba');
    cIBA.innerText = `International Bartenders Association(IBA) rank: ${iba}`;

    // div to contain type, category and iba ranking
    let brief = document.createElement('div');
    brief.classList.add('content-brief');
    brief.appendChild(cType);
    brief.appendChild(cCategory);
    // if drink is not IBA ranked, better not display the IBA section at all
    if(data.iba)
        brief.appendChild(cIBA);

    main.appendChild(img);
    main.appendChild(brief);

    // append .CONENT-MAIN to .RESULT-CONTENT
    content.appendChild(main);

    // .RESULT-CONTENT .CONTENT-INSTRUCTIONS 
    let instructions = document.createElement('div');
    instructions.classList.add('content-instructions');

    // add the instructions header
    let header = document.createElement('h3');
    header.classList.add('instructions-header');
    header.innerText = 'Ingredients and instructions';
    instructions.appendChild(header);

    // create the ul
    let ul = document.createElement('ul');
    ul.classList.add('ul-ingredients');

    // should create lis coresponding to the number of ingredients
    for(let i = 0; i < data.ingredients.length; i++) {
        let measure = (data.ingredientMeasures[i] && data.ingredientMeasures[i] !== undefined) ? (`(${data.ingredientMeasures[i]}`) : '';
        let li = document.createElement('li');
        
        li.classList.add('ingredient');
        
        // lis contain spans
        let span = document.createElement('span');
        
        span.classList.add('ingredient-measure');
        span.innerText = ` ${measure}`;
        if (measure || measure !== '') span.innerText += ')'; // add the right paranthese if measure isn't empty
        li.innerText = data.ingredients[i];
        
        // append the span to li
        li.appendChild(span);
        ul.appendChild(li);
        console.log(li);
    }

    // append the ul
    instructions.appendChild(ul);
    // append .CONTENT-INSTRUCTIONS
    content.appendChild(instructions);

    // .RESULT-CONTENT .INSTRUCTIONS
    let paragraph = document.createElement('p');
    paragraph.classList.add('instructions');
    paragraph.innerText = data.instructions;
    instructions.appendChild(paragraph);

    // both .RESULT and .RESULT-CONTENT are children of #SEARCH-RESULTS
    document.getElementById('search-results').appendChild(result);
    document.getElementById('search-results').appendChild(content);

    // set global state variable to true to indicate that a search has been made
    resultDisplayied = true;
}

function fillResults(cocktails) {
    for(let i = 0;i < cocktails.length;i++) {
        let contentJSON = createCocktail(cocktails[i]);

        //console.log(results[i].children[0]);
        //fillResultsDOM(contentJSON, results[i].children);
        createResult(contentJSON);
    }
}

function animateResultBar(animation, index) {
    let bar = document.getElementsByClassName('result')[index];
    let icon = document.getElementsByClassName('fa')[index];
    let content = document.getElementsByClassName('result-content')[index];

    if (bar.classList.contains('expand')) bar.classList.remove('expand');
    if (bar.classList.contains('shrink')) bar.classList.remove('shrink');
    if(icon.classList.contains('rotate')) icon.classList.remove('rotate');
    if(icon.classList.contains('rotate-reverse')) icon.classList.remove('rotate-reverse');
    if(content.classList.contains('appear')) content.classList.remove('appear');
    if(content.classList.contains('disappear')) content.classList.remove('disappear');

    if (animation === 'expand') {
        bar.classList.add('expand');
        icon.classList.add('rotate');
        content.classList.add('appear');
    } 
    else if (animation === 'shrink') {
        bar.classList.add('shrink');
        icon.classList.add('rotate-reverse');
        content.classList.add('disappear');
    }
    else throw 'Incorrect animation type.Expected shrink or expand !';
}

// delete search results in case a search was already done and turn state variable to false (search results had been deleted)
function resolveStateVariable() {
    let results = Array.from(document.getElementsByClassName('result'));
    let contents = Array.from(document.getElementsByClassName('result-content'));
    // transform to Array, as HTMLCollection gets incorrect length value

    // .RESULT-CONTENT
    let cLen = contents.length;
    for(let i = 0;i < cLen; i++) {
        let main = contents[i].childNodes[0];
        let instructions = contents[i].childNodes[1];

        while(main.firstChild) 
            main.removeChild(main.firstChild);
        main.parentNode.removeChild(main);

        while(instructions.firstChild)
            instructions.removeChild(instructions.firstChild);
        instructions.parentNode.removeChild(instructions);

        contents[i].parentNode.removeChild(contents[i]);
    }
    
    // .RESULT
    let rLen = results.length;
    for(let i = 0;i < rLen; i++) {
        while(results[i].firstChild) 
            results[i].removeChild(results[i].firstChild);
        results[i].parentNode.removeChild(results[i]);  
    }

    resultDisplayied = false;
}

// search event
document.getElementById('search').addEventListener('keydown', async function(event) {
    if (event.keyCode === 13 && document.getElementById('search').value !== '') {
        if(resultDisplayied) resolveStateVariable();

        if(!resultDisplayied) {
            let data = await searchCocktail();

            if (data === null) {
                displayInputError();
                throw 'Invalid input';
            }

            displaySearchResults();
            fillResults(data);
            addResultsEvents();
            resultDisplayied = true;
        } else throw 'State error.Unable to search for results !';
    }
});

// button event
document.getElementById('again').addEventListener('click', () =>
    getRandomCocktail().then(data => createCocktail(data)).then(cocktail => updateRandomCocktailDOM(cocktail))
);

//div expand event
function addResultsEvents() {
    let results = document.getElementsByClassName('result');

    for (let i = 0; i < results.length; i++)
        results[i].addEventListener('click', () => {
            let content = document.getElementsByClassName('result-content')[i];

            if (content.style.display === 'block') {
                content.style.display = 'none';
                animateResultBar('shrink', i);
            }
            else {
                 content.style.display = 'block';
                 animateResultBar('expand', i);
            }
        });
}

getRandomCocktail()
.then(data => createCocktail(data))
.then(cocktail => updateRandomCocktailDOM(cocktail));
