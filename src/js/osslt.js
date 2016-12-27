function getScore() {
  score = {'direct': {'correct':0, 'incorrect':0},
             'indirect': {'correct':0, 'incorrect':0}};
  return score
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
    var inputs = document.getElementsByName('question-' + section + '-' + i);
    var checkedAnswer = false;
    for (x=0; x<inputs.length; x++) {
      if (inputs[x].checked === true) {
        checkedAnswer = true;
        if (inputs[x].value === question.dataset.answer){
          score[question.dataset.type].correct++;
          question.classList.remove("incorrect");
          question.classList.add("correct");
        }
        else {
          score[question.dataset.type].incorrect++;
          question.classList.remove("correct");
          question.classList.add("incorrect");
        }
      }
    }
    if (checkedAnswer === false) {
      score[question.dataset.type].incorrect++;
      question.classList.remove("correct");
      question.classList.add("incorrect");
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


function markTest() {
  resetScore();
  window.alert("fix this, retard");
  // mark(section);
}
