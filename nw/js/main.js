// init variables
var lottoHeader = document.getElementById("lotto_header");
var lottoPrices = document.getElementById("lotto_prices");


function clickEvent(buttonID) {
  var request = new XMLHttpRequest();

  // Load the JSON object
  // (For some reason I had errors when using 'http://localhost:8080')
  //request.open('GET', 'http://localhost:8080');
  request.open('GET', 'http://192.168.99.100:8080');

  request.onload = function() {
    var data = JSON.parse(request.responseText);
    var lottoObject = getLottoInformation(buttonID, data);

    lottoHeader.innerHTML = "";
    lottoPrices.innerHTML = "";
    showRelevantInformation(lottoObject);
  };
  request.onerror = function() {
    console.log("Connection error");
  };
  request.send();
}

function showRelevantInformation(lottoObject) {
  for (var key in lottoObject) {
    if (lottoObject.hasOwnProperty(key)) {
      switch (key) {
        case "name":
          addToHeader(lottoObject[key]);
          break;
        case "days":
          if (lottoObject[key].length > 0)
            addToHeader(lottoObject[key][0].name);
          break;
        case "quickpick_sizes":
          printQuickpickSizes(lottoObject[key]);
          break;
        case "lottery":
          addToHeader(lottoObject[key].name);
          break;
        case "draw":
          printDrawInformation(lottoObject[key]);
          break;
        case "draws":
          printDrawAndPrizePool(lottoObject[key]);
          break;
        case "game_types":
          printGameTypesAndPrices(lottoObject[key]);
          break;
      }
    }
  }
}

// wraps the input with appropriate html so the user
// can expand or collapse the content
function wrapWithExpandableTitle(title, content, id) {
  var string ="<p><a href=\"#!\" id=\"" + id + "_arrows" + "\" class=\"arrows\""+
              "onclick=\"expandCollapse('" + id + "')\">&#43;</a><b>" + title +
      "</b><div id=\"" + id + "\" style=\"display:none\">" + content + "</div>";
  return string;
}

function printDrawInformation(object) {
  addToHeader("Upcoming Draw No. " + object.draw_number + " drawn on "
                      + object.draw_date.substring(0,10));

  for (i = 0; i < object.offers.length; i++) {
    string = "$" + object.offers[i].price.amount + " for " +
                  object.offers[i].num_tickets;
    if (object.offers[i].num_tickets == 1) {
      string += " entry.";
    }
    else {
      string += " entries."
    }
    addToHeader(string);
  }
}

function printQuickpickSizes(object) {
  var htmlString = "Quickpicks are available for ";
  for (i = 0; i < object.length; i++) {
    if (i == 0)
      htmlString += object[i];
    else if (i < object.length - 1){
      htmlString += ", " + object[i];
    }
    else {
      htmlString += " and " + object[i] + " games.";
    }
  }
  addToPrices(htmlString);
}

function printGameTypesAndPrices(object) {
  for (i = 0; i < object.length; i++) {
    var content = "<p>" + object[i].description + "</p>";
    var title = object[i].name;


    // loop through object to get content (desc, prices)
    for (ii = 0; ii < object[i].game_offers.length; ii++) {
      var subtitle = object[i].game_offers[ii].name;
      var subcontent = "<p>" + object[i].game_offers[ii].description + "</p>";
      subcontent += "<p>Price: $" + object[i].game_offers[ii].price.amount +"</p>";
      var id = (i+1)*100 + ii ;
      content += wrapWithExpandableTitle(subtitle, subcontent, id);
    }

    addToPrices(wrapWithExpandableTitle(title, content, i));
  }
}

function printDrawAndPrizePool(object) {
  addToHeader("Upcoming Draw No. " + object[0].draw_no +
              ": Prize Pool of $" + object[0].prize_pool.amount +
              " drawn on " + object[0].date.substring(0,10));
}

// print the input within a tag
function addToHeader(string) {
  lottoHeader.insertAdjacentHTML('beforeend', "<p>" + string + "</p>");
}

function addToPrices(string) {
  lottoPrices.insertAdjacentHTML('beforeend', "<p>" + string + "</p>");
}

// on button click .. show the information for that lottery
function getLottoInformation(name, object) {
  for (i = 0; i < object.result.length; i++) {
    if (object.result[i].key == name)
      return object.result[i];
  }
  return null;
}

// expand or collapse the div
function expandCollapse(id) {
  var e = document.getElementById(id);
  var f = document.getElementById(id + "_arrows");
  if (e.style.display == 'none') {
    e.style.display = 'block';
    f.innerHTML = '&#45;';
  }
  else {
    e.style.display = 'none';
    f.innerHTML = '&#43;';
  }
}
