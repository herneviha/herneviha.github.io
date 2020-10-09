window.addEventListener("load", (e) => {
  initThemeChange();
  fetchMenu().then((restaurants) => {
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
};

const renderMenu = (restaurants) => {
  restaurants.data.forEach((restaurant) => {
    if (restaurant.title === "Chemicum") {
      restaurant.menuData.menus.forEach((item) => {
        if (notAlreadyPassed(item.date)) {
          document.getElementById(
            "menu"
          ).innerHTML += `<section id="${item.date}"><h2 class="date">${item.date}</h2></section>`;
          item.data.forEach((data, i) => {
            if (data.ingredients != "_" && data.ingredients != "") {
              let ingredients = highlightAllergens(data.ingredients);
              document.getElementById(
                item.date
              ).innerHTML += `<div class="food_container"><h3 class="name">${data.name}</h3><p class="ingredients">${ingredients}</p></div>`;
            }
          });
        }
      });
    }
  });
};

const notAlreadyPassed = (daydata) => {
  const date = new Date();
  if (
    parseInt(daydata.substring(3, 5)) < date.getDate() &&
    parseInt(daydata.substring(6, 8)) === date.getMonth() + 1
  ) {
    return false;
  } else if (parseInt(daydata.substring(6, 8)) < date.getMonth() + 1) {
    return false;
  }
  return /Ma|Ti|Ke|To|Pe/.test(daydata);
};

const getSectionId = () => {
  const date = new Date();
  const weekDays = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"];
  if (date.getDay() === 6) {
    date.setDate(date.getDate() + 2);
  } else if (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }
  return `${weekDays[date.getDay()]} ${date
    .getDate()
    .toString()
    .padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.`;
};

const highlightAllergens = (ingredients) => {
  allergens = /herne|linss(e|i)|pa(v|p)u|pähkin(ä|ö)/;
  const listOfIngredients = ingredients.split(",");

  let result = [];
  for (let i = 0; i < listOfIngredients.length; i++) {
    if (allergens.test(listOfIngredients[i].toLocaleLowerCase())) {
      result.push(`<mark>${listOfIngredients[i]}</mark>`);
    } else {
      result.push(listOfIngredients[i]);
    }
  }
  return result.join();
};

function initThemeChange() {
  var c = 0;
  var themeLink = document.getElementById("theme");
  var themeSelector = document.getElementById("theme_selector");
  themeSelector.addEventListener("click", () => {
    themeLink.setAttribute("href", "themes/" + changeTheme() + ".css");
  });
  document.addEventListener("keydown", function (e) {
    if (e.which == 80) {
      setInterval(createRandomTheme, 200);
      c = c + 1;
      console.log("SEIZURE WARNING" + "!".repeat(c));
    }
  });
}
function changeTheme() {
  var themes = ["original", "dosish", "paper", "nacho", "hotpink", "ovikoodi"];
  var random = Math.floor(Math.random() * themes.length);
  while (
    document.getElementById("theme").attributes.href.value ===
    "themes/" + themes[random] + ".css"
  ) {
    random = Math.floor(Math.random() * themes.length);
  }
  return themes[random];
}

function createRandomTheme() {
  const CSSvariables = [
    "--main-bg-color",
    "--section-bg-color",
    "--title-font-color",
    "--main-font-color",
    "--mark-bg-color",
    "--mark-color",
    "--button-bg-color",
  ];
  for (var i = 0; i < CSSvariables.length; i++) {
    document.documentElement.style.setProperty(
      CSSvariables[i],
      "#" + Math.floor(Math.random() * 16777215).toString(16)
    );
  }
}
