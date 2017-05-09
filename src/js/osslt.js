function getScore() {
  score = {'direct': {'correct':0, 'incorrect':0},
           'indirect': {'correct':0, 'incorrect':0},
           'news report':null,
           'opinion':null,
           'short':[]}
  return score
}


function countWords (section, question) {
  var response = document.getElementById("response-" + section + "-" + question);
  var matches = response.value.match(/[\w\d]+/gi);
  var count = matches ? matches.length : 0;
  return count
}


function markWritten(questionType, count) {
  var benchmarks = {"short":[35, 50, 60], 
                    "news report": [35, 50, 65, 100, 175, 250], 
                    "opinion": [45, 80, 115, 200, 300, 450]};
  var percentage = 0;
  var code = 0;
  if (questionType == 1){
    if (count <= benchmarks.short[0]) {
      percentage = 33 * (count/benchmarks.short[0]);
      if (10 < count) {
        code = 10;
      }
      else {
        code = 0
      }
    }
    else if (benchmarks.short[0] < count && count <= benchmarks.short[1]) {
      percentage = (33 * ((count - benchmarks.short[0])/(benchmarks.short[1]-benchmarks.short[0]))) + 33;
      code = 20;
    }
    else if (benchmarks.short[1] < count && count <= benchmarks.short[2]) {
      percentage = (33 * ((count - benchmarks.short[1])/(benchmarks.short[2]-benchmarks.short[1]))) + 66;
      code = 30;
    }
    else if (benchmarks.short[2] < count) {
      percentage = 100; 
      code = 30;
    }
  }
  else if (questionType == 2 || questionType == 3){
    var milestones = null;
    if (questionType == 2) {
      milestones = benchmarks["news report"];
    }
    else if (questionType == 3) {
      milestones = benchmarks.opinion;
    }

    if (count <= milestones[0]) {
      percentage = 16.5 * (count/milestones[0]);
      if (10 < count) {
        code = 10;
      }
      else {
        code = 0
      }
    }
    else if (milestones[0] < count && count <= milestones[1]) {
      percentage = (16.5 * ((count - milestones[0])/(milestones[1]-milestones[0]))) + 16.5;
      code = 20;
    }
    else if (milestones[1] < count && count <= milestones[2]) {
      percentage = (16.5 * ((count - milestones[1])/(milestones[2]-milestones[1]))) + 33;
      code = 30;
    }
    else if (milestones[2] < count && count <= milestones[3]) {
      percentage = (16.5 * ((count - milestones[2])/(milestones[3]-milestones[2]))) + 49.5;
      code = 40;
    }
    else if (milestones[3] < count && count <= milestones[4]) {
      percentage = (16.5 * ((count - milestones[3])/(milestones[4]-milestones[3]))) + 66;
      code = 50;
    }
    else if (milestones[4] < count && count <= milestones[5]) {
      percentage = (16.5 * ((count - milestones[4])/(milestones[5]-milestones[4]))) + 82.5;
      code = 60;
    }
    else if (milestones[5] < count) {
      percentage = 100; 
      code = 60;
    }
  }
  return {"percentage": percentage, "code": code}
}


function updateCount(section, question, questionType) {
  var wordCountBox = document.getElementById("wc-" + section + "-" + question);
  var count = countWords(section, question);
  wordCountBox.innerHTML = count;
  var arrow = document.getElementById("wc-arrow-" + section + "-" + question);
  var arrowMargin = markWritten(questionType, count).percentage;
  arrow.style.marginLeft = arrowMargin + "%"; 
}


function markMC(question, inputs, score) {
  var checkedAnswer = false;
  for (x=0; x<inputs.length; x++) {
    if (inputs[x].checked === true) {
      checkedAnswer = true;
      if (inputs[x].value === question.dataset.answer){
        score[question.dataset.subtype].correct++;
        question.classList.remove("incorrect");
        question.classList.add("correct");
      }
      else {
        score[question.dataset.subtype].incorrect++;
        question.classList.remove("correct");
        question.classList.add("incorrect");
      }
    }
  }
  if (checkedAnswer === false) {
    score[question.dataset.subtype].incorrect++;
    question.classList.remove("correct");
    question.classList.add("incorrect");
  }
}


function mark(section, score){
  var sectionElement = document.getElementById('section' + section);
  var questionCount = 0;
  for (node in sectionElement.childNodes) {
    if (sectionElement.childNodes[node].nodeName === "LI") {
      questionCount++;
    }
  }
  for (var i=0; i<questionCount; i++){
    var question = document.getElementById('question-' + section + '-' + i)

    var mcQuestionTypes = ["normal", "identification", "combination", "insertion"];
    if (mcQuestionTypes.indexOf(question.dataset.type) > -1) {
      var inputs = document.getElementsByName('question-' + section + '-' + i);
      markMC(question, inputs, score);
    }
    else {
      var count = countWords(section, i);
      if (question.dataset.type === "short") {
        var shortCode = markWritten(1, count).code;
        if (shortCode != null) {
          var sectionName = (section + 1) + "-" + (i + 1);
          var scoreObject = {};
          scoreObject[sectionName] = shortCode;
          score.short.push(scoreObject);
        }
      }
      else if (question.dataset.type === "news report") {
        score["news report"] = markWritten(2, count).code;
      }
      else if (question.dataset.type === "opinion") {
        score["opinion"] = markWritten(3, count).code;
      }
    }
  }
}

function calculateScores (score) {
  var directScore = Math.round(score.direct.correct /
                      (score.direct.correct + score.direct.incorrect) * 100);
  if (isNaN(directScore)){
    directScore = 'N/A';
  }
  else {
    directScore = directScore + '%';
  }

  var indirectScore = Math.round(score.indirect.correct /
                        (score.indirect.correct +
                         score.indirect.incorrect)*100);
  if (isNaN(indirectScore)){
    indirectScore = 'N/A';
  }
  else {
    indirectScore = indirectScore + '%';
  }

  var totalScore = Math.round((score.direct.correct +
                               score.indirect.correct) /
                               (score.direct.correct +
                                score.direct.incorrect +
                                score.indirect.correct +
                                score.indirect.incorrect) * 100);
  if (isNaN(totalScore)){
    totalScore = 'N/A';
  }
  else {
    totalScore = totalScore + '%';
  }

  document.getElementById('direct-score').innerHTML = (
    'Direct: ' +
    score.direct.correct +
    '/' +
    (score.direct.correct +
    score.direct.incorrect) +
    ' (' + directScore + ')'
    );
  document.getElementById('indirect-score').innerHTML = (
    'Indirect: ' +
    score.indirect.correct +
    '/' +
    (score.indirect.correct +
    score.indirect.incorrect) +
    ' (' + indirectScore + ')'
    );
  document.getElementById('total-score').innerHTML = (
    'Total: ' +
    (score.indirect.correct +
    score.direct.correct) +
    '/' +
    (score.direct.correct +
    score.direct.incorrect +
    score.indirect.correct +
    score.indirect.incorrect) +
    ' (' + totalScore + ')'
    );
  var shortList = document.getElementById('short-score');
  while (shortList.firstChild) {
    shortList.removeChild(shortList.firstChild)
  }
  if (score.short.length > 0) {
    var shortHeading = document.createElement("h3");
    shortHeading.innerHTML = "Short Writing";
    shortList.append(shortHeading);
    for (x=0;x<score.short.length;x++) {
      var shortScore = document.createElement("p");
      var scoreKey = Object.keys(score.short[x])[0];
      shortScore.innerHTML = scoreKey + ": Code " + score.short[x][scoreKey];
      shortList.appendChild(shortScore);
    }
  }
  var newsDiv = document.getElementById('news-score');
  while (newsDiv.firstChild) {
    newsDiv.removeChild(newsDiv.firstChild)
  }
  if (score["news report"] != null) {
    var newsHeading = document.createElement("h3");
    newsHeading.innerHTML = "News Report";
    newsDiv.append(newsHeading);
    var newsScore = document.createElement("p");
    newsScore.innerHTML = "Code " + score["news report"];
    newsDiv.append(newsScore);
  }
  var opinionDiv = document.getElementById('opinion-score');
  while (opinionDiv.firstChild) {
    opinionDiv.removeChild(opinionDiv.firstChild)
  }
  if (score["opinion"] != null) {
    var opinionHeading = document.createElement("h3");
    opinionHeading.innerHTML = "Opinion";
    opinionDiv.append(opinionHeading);
    var opinionScore = document.createElement("p");
    opinionScore.innerHTML = "Code " + score["opinion"];
    opinionDiv.append(opinionScore);
  }
}

function hideModal() {
  var modal = document.getElementById('score-modal')
  modal.style.display = 'none';
}


function showScores() {
  var modal = document.getElementById('score-modal')
  modal.style.display = 'flex';
  window.onclick = function(event) {
    if (event.target == modal) {
      hideModal();
    }
  }
}


function markSection(section) {
  var score = getScore();
  mark(section, score);
  calculateScores(score);
  showScores();
}


function markTest(sectionCount) {
  var score = getScore();
  for (var i=0; i<sectionCount; i++) {
    mark(i, score);
  }
  calculateScores(score);
  showScores();
}
