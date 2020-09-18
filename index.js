window.addEventListener('load', (e) => {
    fetchMenu().then(restaurants => {
        renderMenu(restaurants);
    });
});

const fetchMenu = () => {
    const json = axios
      .get("https://unicafe.fi/wp-json/swiss/v1/restaurants")
      .catch((error) => {
        console.log(error);
      });
    return json;
}

const renderMenu = (restaurants) => {
    restaurants.data.forEach((restaurant) => {
      if (restaurant.title === "Chemicum") {
        restaurant.menuData.menus.forEach((item) => {
          document.getElementById(
            "menu"
          ).innerHTML += `<section id="${item.date}"><h2 class="date">${item.date}</h2></section>`;
          item.data.forEach((data, i) => {
            if (data.ingredients != "_" && data.ingredients != "") {
                let ingredients = highlightAllergens(data.ingredients)
                document.getElementById(
                  item.date
                ).innerHTML += `<div class="food_container"><h3 class="name">${data.name}</h3><p class="ingredients">${ingredients}</p></div>`;
            }
          });
        });
      }
    });
    const sectionId = getSectionId();
    document.getElementById(sectionId).scrollIntoView();
  }

const getSectionId = () => {
    const date = new Date();
    const weekDays = ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'];
    return `${weekDays[date.getDay()]} ${date.getDate()}.${(date.getMonth()+1).toString().padStart(2, '0')}.`;
}

const highlightAllergens = (ingredients) => {
    const allergens = ['herne', 'linssi', 'papu', 'pähkinä'];
    const listOfIngredients = ingredients.split(',');
    
    let result = [];
    for(let i = 0; i < listOfIngredients.length; i++) {
        for(let j = 0; j < allergens.length; j++) {
            if(listOfIngredients[i].toLowerCase().includes(allergens[j].toLocaleLowerCase())) {
               result.push(`<mark>${listOfIngredients[i]}</mark>`);
               break;
            }
            else if(j + 1 === allergens.length){
                result.push(listOfIngredients[i]);
            }
        }
    }
    return result.join();
}
