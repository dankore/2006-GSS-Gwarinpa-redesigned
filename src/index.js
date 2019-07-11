const request = new XMLHttpRequest();
request.open("GET", "https://dankore.github.io/gss-2006-json/2006.json");

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    var data = JSON.parse(request.responseText);
    createHTML(data);
  } else {
    document
      .getElementById("set-container")
      .insertAdjacentHTML(
        "beforeend",
        "We connected to the server, but it returned an error."
      );
  }
};

request.onerror = function() {
  document
    .getElementById("set-container")
    .insertAdjacentHTML(
      "beforeend",
      "Apologies! We connected to the server, but it returned an error. Refresh the page or try again later."
    );
};

request.send();

function createHTML(setData) {
  const rawTemplate = document.getElementById("setTemplate").innerHTML;
  const compiledTemplate = Handlebars.compile(rawTemplate);
  const generatedHTML = compiledTemplate(setData);

  const setContainer = document.getElementById("set-container");
  setContainer.innerHTML = generatedHTML;
}

Handlebars.registerHelper("calculateUntillBirthDay", function(dob) {
  function daysIntoYear(date) {
    return (
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
        Date.UTC(date.getFullYear(), 0, 0)) /
      24 /
      60 /
      60 /
      1000
    );
  }

  //Get input
  const arr = dob.split(" ");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const arr1 = arr[0];
  const arr2 = parseInt(arr[1], 10);

  const monthStr = months.indexOf(arr1);

  const currentDate = new Date();
  const futureDate = new Date(0, monthStr, arr2);
  const futureDays = daysIntoYear(futureDate);
  const numberOfDaysToDate = daysIntoYear(currentDate);

  const daysRemaining = futureDays - numberOfDaysToDate;

  if (daysRemaining < 0) {
    return daysRemaining + 365 + " days to birthday";
  } else if (daysRemaining === 0) {
    return "Today is birthday 🎂";
  } else {
    return daysRemaining + " days to birthday";
  }
});

// Seach Button
const search = document.getElementById("search");
const searchDisplay = document.getElementById("search-display");

// const endpoint =
//   "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";
const endpoint = "https://dankore.github.io/gss-2006-json/2006-noset.json";
const storeSearchContainer = [];

fetch(endpoint)
  .then(blob => blob.json())
  .then(dataFromSearch => {
    storeSearchContainer.push(...dataFromSearch);
  });

function findMatches(word, storeSearchContainer) {
  return storeSearchContainer.filter(searchedItem => {
    const regex = new RegExp(word, "gi");
    return searchedItem.name.match(regex) || searchedItem.state.match(regex);
  });
}

// Cancel button toggle
const cancelButton = document.querySelector(".cancel-button");
const body = document.querySelector("body");
const clearIcon = document.querySelector(".clear-icon");

// body.addEventListener("click", toggle);
// body.addEventListener("click", emptySearchBox);
search.addEventListener("input", toggle);
cancelButton.addEventListener("click", toggle);
cancelButton.addEventListener("click", emptySearchBox);

clearIcon.addEventListener("click", emptySearchBoxByIcon);

function emptySearchBoxByIcon() {
  search.value = "";
  if (search.value === "") {
    cancelButton.classList.add("active-cancel-button");
    clearIcon.classList.remove("clear-icon-active");
  }
}

function emptySearchBox() {
  search.value = "";
  cancelButton.classList.remove("active-cancel-button");
  clearIcon.classList.remove("clear-icon-active");
}

function toggle(e) {
  e.preventDefault();
  if (search.value !== "") {
    cancelButton.classList.add("active-cancel-button");
    searchDisplay.innerHTML = ` `;
    clearIcon.classList.add("clear-icon-active");
  } else {
    cancelButton.classList.remove("active-cancel-button");
    clearIcon.classList.remove("clear-icon-active");
    searchDisplay.innerHTML = ` `;
  }
}

// Display matches
search.addEventListener("input", displayMatches);
function displayMatches() {
  if (search.value === "") {
    searchDisplay.innerHTML = ` `;
  } else {
    const matchArray = findMatches(this.value, storeSearchContainer);

    const html = matchArray
      .map(item => {
        const regex = new RegExp(this.value, "gi");
        const name = item.name.replace(
          regex,
          `<span class="hl">${this.value}</span>`
        );
        // const livesIn = item.state.replace(
        //   regex,
        //   `<span class="hl">${this.value}</span>`
        // );
        const classOf = item.class.replace(
          regex,
          `<span class="hl">${this.value}</span>`
        );
        return `
      <ul>
          <li>
           <p class="returnedSearch"> ${name}, ${classOf} </p>
          </li>
      </ul>
      `;
      })
      .join("");
    searchDisplay.innerHTML = html;
  }
}
