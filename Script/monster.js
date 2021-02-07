
// defining variables
const searchDiv = document.querySelector('.searchDiv');
const searchText = document.getElementById('search-text');
const search = document.getElementById('search');
const foodDetail = document.getElementById('foodDetail');
const itemList = document.getElementById('items');

// adding click event listener to search button
search.addEventListener('click', fetchData);

// adding enter press event listener to input field
searchText.addEventListener('keyup', function(e){
    if(e.key == 'Enter'){
        fetchData();
    }
});

// call API to search the relevent data of given keyword
function fetchData() {
    if(searchText.value.length > 0){
        const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchText.value;
        fetch(url).then(res => res.json())
        .then(data => displayList(data));
    }
}

// display the list of food
function displayList(data) {
    const meals = data.meals;
    // if API return nothing for this requested keyword
    if (meals === null) {
        alert('Please insert a valid name.');
    } else {
        // if API return some data 
        let output = '';
        meals.forEach(meal => {
            // template of card 
            let template = `<div class="col-md-3 mb-5">
                            <div class="card" style="width: 15rem;">
                                <a class="item-details" data-id="${meal.idMeal}" href="#">
                                    <img src="${meal.strMealThumb}" class="card-img-top" alt="Food">
                                    <div class="card-body">
                                    <h5 class="card-text text-center">${meal.strMeal}</h5>
                                    </div>
                                </a>
                            </div>
                    </div>`;
            output += template;
        });
        
        // adding final output in html page 
        itemList.innerHTML = output;

        // adding click event listener to all the cards of food to show it's details
        let itemDetail = document.querySelectorAll('#items .item-details');
        itemDetail.forEach(card => {
            card.addEventListener('click', function () {
                let id = this.getAttribute('data-id');
                getFoodDetail(id);
            })
        });

    }
}

// function getFoodDetail that call API to get data for the particular food is clicked
function getFoodDetail(id) {
    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;
    fetch(url).then(res => res.json())
    .then(data => displayFoodDetail(data));
}

// display food detail in html page
function displayFoodDetail(data) {
    console.log(data)
    let meal = data.meals[0];
    // hidding search and food list sections
    itemList.style = 'display:none;';
    searchDiv.style = 'display:none;';
    // showing food details section
    foodDetail.style = 'display:flex';

    let template = `<div class="card">
                        <img class="card-img-top" src="${meal.strMealThumb}"/>
                        <h5 class="card-title text-center mt-2">${meal.strMeal}</h5>
                        <div class="card-body">
                            <h6>Ingredients</h6>
                            <ul class="mb-15" id="ingredients">`;
    
    // blank variable to store list item 
    let listOfIngredients = '';
    for (let i = 1; i <= 20; i++) {// in this API we have 20 ingredients 
        let indexOfIngredient = 'strIngredient' + i; 
        let indexOfMeasure = 'strMeasure' + i;

        // check if any ingredient is not null or empty
        if (meal[indexOfIngredient] != null && meal[indexOfIngredient].length > 0) { 
            listOfIngredients += `<li>${meal[indexOfMeasure]} ${meal[indexOfIngredient]} ${meal[indexOfIngredient].length}</li>`;
        }
    }
    template += listOfIngredients;
    template += `</ul></br><center><a class="mt-10 mb-10 btn btn-danger" href="#" onclick="back()">Back</a></center></div> </div>`;


    // adding template to html page
    foodDetail.innerHTML = template;
}

// function back
function back(){
    window.location.reload();
}






