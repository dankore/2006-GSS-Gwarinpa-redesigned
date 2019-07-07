import Handlebars from "handlebars";

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
