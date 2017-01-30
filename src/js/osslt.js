function getScore() {
  score = {'direct': {'correct':0, 'incorrect':0},
             'indirect': {'correct':0, 'incorrect':0}};
  return score
}


function updateCount(section, question, questionType) {
  var benchmarks = {"short":[35, 50, 60], 
                    "news report": [35, 50, 65, 100, 175, 250], 
                    "opinion": [45, 80, 115, 200, 300, 450]};
  var response = document.getElementById("response-" + section + "-" + question);
  var arrow = document.getElementById("wc-arrow-" + section + "-" + question);
  var matches = response.value.match(/[\w\d]+/gi);
  var count = matches ? matches.length : 0;
  var wordCount = document.getElementById("wc-" + section + "-" + question);
  wordCount.innerHTML = count;
  var arrowMargin = null;
  if (questionType == 1){
    if (count <= benchmarks.short[0]) {
      arrowMargin = 33 * (count/benchmarks.short[0]);
    }
    else if (benchmarks.short[0] < count && count <= benchmarks.short[1]) {
      arrowMargin = (33 * ((count - benchmarks.short[0])/(benchmarks.short[1]-benchmarks.short[0]))) + 33;
    }
    else if (benchmarks.short[1] < count && count <= benchmarks.short[2]) {
      arrowMargin = (33 * ((count - benchmarks.short[1])/(benchmarks.short[2]-benchmarks.short[1]))) + 66;
    }
    else if (benchmarks.short[2] < count) {
      arrowMargin = 100; 
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
      arrowMargin = 16.5 * (count/milestones[0]);
    }
    else if (milestones[0] < count && count <= milestones[1]) {
      arrowMargin = (16.5 * ((count - milestones[0])/(milestones[1]-milestones[0]))) + 16.5;
    }
    else if (milestones[1] < count && count <= milestones[2]) {
      arrowMargin = (16.5 * ((count - milestones[1])/(milestones[2]-milestones[1]))) + 33;
    }
    else if (milestones[2] < count && count <= milestones[3]) {
      arrowMargin = (16.5 * ((count - milestones[2])/(milestones[3]-milestones[2]))) + 50;
    }
    else if (milestones[3] < count && count <= milestones[4]) {
      arrowMargin = (16.5 * ((count - milestones[3])/(milestones[4]-milestones[3]))) + 66.5;
    }
    else if (milestones[4] < count && count <= milestones[5]) {
      arrowMargin = (16.5 * ((count - milestones[4])/(milestones[5]-milestones[4]))) + 83.5;
    }
    else if (milestones[5] < count) {
      arrowMargin = 100; 
    }
  }
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

    var mcQuestionTypes = ["normal", "identification", "combination"];
    if (mcQuestionTypes.indexOf(question.dataset.type) > -1) {
      var inputs = document.getElementsByName('question-' + section + '-' + i);
      markMC(question, inputs, score);
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

  document.getElementById('direct').innerHTML = (
    'Direct: ' +
    score.direct.correct +
    '/' +
    (score.direct.correct +
    score.direct.incorrect) +
    ' (' + directScore + ')'
    );
  document.getElementById('indirect').innerHTML = (
    'Indirect: ' +
    score.indirect.correct +
    '/' +
    (score.indirect.correct +
    score.indirect.incorrect) +
    ' (' + indirectScore + ')'
    );
  document.getElementById('total').innerHTML = (
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
}

function showScores() {
  var modal = document.getElementById('score-modal')
  modal.style.display = 'flex';
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
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
