var score = null;

function resetScore() {
  score = {'direct': {'correct':0, 'incorrect':0},
             'indirect': {'correct':0, 'incorrect':0}};
}

function mark(section){

  var sectionElement = document.getElementById('section' + section);
  var sectionLength = sectionElement.getElementsByTagName('li').length;
  for (var i=0; i<sectionLength; i++){
    var question = document.getElementById('question-' + section + '-' + i)
    var checkedAnswer = false;
    var inputs = question.getElementsByTagName('input');
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

  // var directScore = Math.round(score.direct.correct /
  //                     (score.direct.correct + score.direct.incorrect) * 100);
  // if (isNaN(directScore)){
  //   directScore = 'N/A';
  // }
  // else {
  //   directScore = directScore + '%';
  // }

  // var indirectScore = Math.round(score.indirect.correct /
  //                       (score.indirect.correct +
  //                        score.indirect.incorrect)*100);
  // if (isNaN(indirectScore)){
  //   indirectScore = 'N/A';
  // }
  // else {
  //   indirectScore = indirectScore + '%';
  // }

  // var totalScore = Math.round((score.direct.correct +
  //                              score.indirect.correct) /
  //                              (score.direct.correct +
  //                               score.direct.incorrect +
  //                               score.indirect.correct +
  //                               score.indirect.incorrect) * 100);
  // if (isNaN(totalScore)){
  //   totalScore = 'N/A';
  // }
  // else {
  //   totalScore = totalScore + '%';
  // }

  // document.getElementById('direct').innerHTML = (
  //   'Direct: ' +
  //   score.direct.correct +
  //   '/' +
  //   (score.direct.correct +
  //   score.direct.incorrect) +
  //   ' (' + directScore + ')'
  //   );
  // document.getElementById('indirect').innerHTML = (
  //   'Indirect: ' +
  //   score.indirect.correct +
  //   '/' +
  //   (score.indirect.correct +
  //   score.indirect.incorrect) +
  //   ' (' + indirectScore + ')'
  //   );
  // document.getElementById('total').innerHTML = (
  //   'Total: ' +
  //   (score.indirect.correct +
  //   score.direct.correct) +
  //   '/' +
  //   (score.direct.correct +
  //   score.direct.incorrect +
  //   score.indirect.correct +
  //   score.indirect.incorrect) +
  //   ' (' + totalScore + ')'
  //   );

  // $('#score').foundation('reveal', 'open');
  // $(document).foundation();

function markSection(section) {
  resetScore();
  mark(section);
}


function markTest() {
  resetScore();
  window.alert("fix this, retard");
  // mark(section);
}
