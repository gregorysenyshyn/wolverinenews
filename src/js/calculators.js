var algorithms = {
 'Brzycki' : {'1': 1, '2': 0.95, '3': 0.9, '4': 0.88, '5': 0.86, '6': 0.83, '7': 0.8, '8': 0.78, '9': 0.76, '10': 0.75, '11': 0.72, '12': 0.7},
 'Baechle' : {'1': 100, '2': 0.95, '3': 0.93, '4': 0.9, '5': 0.87, '6': 0.85, '7': 0.83, '8': 0.8, '9': 0.77, '10': 0.75, '12': 0.67, '15': 0.65},
 'dos Remedios' : {'1': 1, '2': 0.9, '3': 0.90, '4': 0.87, '5': 0.85, '6': 0.82, '8': 0.75, '10': 0.7, '12': 0.65, '15': 0.6}
};

var wilksCoefficients = {

  'male': {'a': -216.0475144,
           'b': 16.2606339,
           'c': -0.002388645,
           'd': -0.00113732,
           'e': 7.01863 * Math.pow(10,-6),
           'f': -1.291 * Math.pow(10,-8)
          },

  'female': {'a': 594.31747775582,
             'b': -27.23842536447,
             'c': 0.82112226871,
             'd': -0.00930733913,
             'e': 4.731582 * Math.pow(10,-5),
             'f': -9.054 * Math.pow(10,-8)
            }

};

function update1rmAlgo() {
  var algoSelector = document.getElementById('one-rm-algo-select');
  var algoValue = algoSelector.options[algoSelector.selectedIndex].value;
  var repSelector = document.getElementById('one-rm-rep-select');
  while (repSelector.firstChild) {
    repSelector.removeChild(repSelector.firstChild);
  }
  if (algoValue === '0') {
    algo = 'Brzycki';
  }
  else if (algoValue === '1') {
    algo = 'Baechle';
  }
  else if (algoValue === '2') {
    algo = 'dos Remedios';
  }
  for (item in algorithms[algo]) {
    var newOption = document.createElement('option');
    newOption.value = algorithms[algo][item];
    newOption.appendChild(document.createTextNode(item));
    repSelector.appendChild(newOption);
  }
}

function oneRmCalc () {
  var repSelector = document.getElementById('one-rm-rep-select');
  var repsModifier = repSelector.options[repSelector.selectedIndex].value;

  var weight = document.getElementById('one-rm-weight').value;
  var oneRm = Math.round(Number(weight)/Number(repsModifier));

  var oneRmResult = document.getElementById('one-rm-result');
  while (oneRmResult.firstChild) {
    oneRmResult.removeChild(oneRmResult.firstChild);
  }
  var oneRmResultIntroText = document.createElement('h2');
  oneRmResultIntroText.appendChild(document.createTextNode('Your One-Rep Max Is:'));
  oneRmResult.appendChild(oneRmResultIntroText);
  oneRmResult.appendChild(document.createTextNode(oneRm));

}

function wilksCalc () {
  var sexSelect = document.getElementById('wilks-sex-select');
  var sex = sexSelect.options[sexSelect.selectedIndex].value;

  var wilksUnits = document.querySelector('input[name="wilks-units"]:checked').value;

  var bodyweight = null;
  if (wilksUnits === 'lbs') {
    bodyweight = Number(document.getElementById('wilks-bodyweight').value) / 2.2;
  }
  else {
    bodyweight = Number(document.getElementById('wilks-bodyweight').value);
  }

  var weight = null;
  if (wilksUnits === 'lbs') {
    weight = Number(document.getElementById('wilks-weight-lifted').value) / 2.2;
  }
  else {
    weight = Number(document.getElementById('wilks-weight-lifted').value);
  }

  var coefficients = wilksCoefficients[sex];
  var wilksCoefficient = 500 / (coefficients.a + 
                                coefficients.b * bodyweight +  
                                coefficients.c * Math.pow(bodyweight,2)+ 
                                coefficients.d * Math.pow(bodyweight,3)+
                                coefficients.e * Math.pow(bodyweight,4)+
                                coefficients.f * Math.pow(bodyweight,5));

  var wilks = Math.round(weight * wilksCoefficient);

  var wilksResult = document.getElementById('wilks-result');
  while (wilksResult.firstChild) {
    wilksResult.removeChild(wilksResult.firstChild);
  }
  var wilksResultIntroText = document.createElement('h2');
  wilksResultIntroText.appendChild(document.createTextNode('Your Wilks Score Is:'));
  wilksResult.appendChild(wilksResultIntroText);
  wilksResult.appendChild(document.createTextNode(wilks));

}
update1rmAlgo();
