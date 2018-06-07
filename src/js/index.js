function parseTeamSheet (sheet) {
  var currentRecord = {};
  for (var record=1; record < sheet.data[0].rowData.length; record+=1) {
    if (sheet.data[0].rowData[record].values[1].formattedValue === 'Game Summary') {
      var dateArray = sheet.data[0].rowData[record].values[0].formattedValue.split('/');
      currentRecord.date = new Date(dateArray[2], dateArray[0], dateArray[1]);
      currentRecord.type = sheet.data[0].rowData[record].values[1].formattedValue;
      if (sheet.data[0].rowData[record].values[2].formattedValue !== undefined) {
        currentRecord.author = sheet.data[0].rowData[record].values[2].formattedValue;
      }
      if (currentRecord.type === 'Game Summary') {
        currentRecord.type = 'score';
        currentRecord['our score'] = sheet.data[0].rowData[record].values[3].formattedValue;
        currentRecord['their score'] = sheet.data[0].rowData[record].values[4].formattedValue;
        currentRecord['their name'] = sheet.data[0].rowData[record].values[5].formattedValue;
      }
        currentRecord.headline = sheet.data[0].rowData[record].values[6].formattedValue;
        currentRecord.body = sheet.data[0].rowData[record].values[7].formattedValue;
        if (sheet.data[0].rowData[record].values.length === 9){
          currentRecord['link title'] = sheet.data[0].rowData[record].values[8].formattedValue;
          currentRecord['link destination'] = sheet.data[0].rowData[record].values[9].formattedValue;
        }
      return currentRecord;
    }
  }
}

function populateScoreboard(response) {
  var scoreContainers = document.getElementsByClassName('index-scoreboard-container');
  var indexSheet = null;
  for (var sheet in response.sheets) {
    var currentSheet = response.sheets[sheet];
    if (currentSheet.properties.title === 'Index') {
      indexSheet = response.sheets[sheet];
    }
    else if (currentSheet.properties.title !== 'Template') {
      for (var row=1;row < indexSheet.data[0].rowData.length; row+=1) {
        if (indexSheet.data[0].rowData[row].values[0].formattedValue !== undefined) {
          if (indexSheet.data[0].rowData[row].values[0].formattedValue === currentSheet.properties.title &&
              indexSheet.data[0].rowData[row].values[1].formattedValue === 'Team'){
            var parsedPost = parseTeamSheet(currentSheet);
            for (var x = 0; x < scoreContainers.length; x += 1) {
              var currentSB = scoreContainers[x];
              var gameScoresContainer = document.createElement('div');
              currentSB.appendChild(gameScoresContainer);
              var gameScore = document.createElement('div');
              gameScore.className = 'index-scoreboard-game-result';
              gameScoresContainer.appendChild(gameScore);
              var gameTitle = document.createElement('h3');
              gameTitle.className = 'index-gamescore-title';
              gameTitle.appendChild(document.createTextNode(currentSheet.properties.title));
              gameScore.appendChild(gameTitle);
              var gameDate = document.createElement('h4');
              gameDate.appendChild(document.createTextNode(parsedPost.date.getFullYear() + '/' + parsedPost.date.getMonth() + '/' + parsedPost.date.getDate()));
              gameScore.appendChild(gameDate);

              var ourName = document.createElement('span');
              ourName.className = 'index-scoreboard-school';
              ourName.appendChild(document.createTextNode('WHSS'));
              gameScore.appendChild(ourName);

              var gameScoreScores = document.createElement('span');
              gameScoreScores.className = 'index-scoreboard-score';
              gameScoreScores.appendChild(document.createTextNode(parsedPost['our score'] + ' - ' + parsedPost['their score']));
              gameScore.appendChild(gameScoreScores);

              var theirName = document.createElement('span');
              theirName.className = 'index-scoreboard-school';
              theirName.appendChild(document.createTextNode(parsedPost['their name']));
              gameScore.appendChild(theirName);
            }
            break;
          }
        }
      }
    }
  }
}


function populateBlog(response) {
  var blog = document.getElementById('index-blog-body');
  while (blog.firstChild) {
    blog.removeChild(blog.firstChild);
  }
  var blogBorder = document.createElement('div');
  blogBorder.className = 'panel';
  blog.appendChild(blogBorder);
  for (var i = 1; i < response.sheets[0].data[0].rowData.length; i += 1) {
    var currentEntry = response.sheets[0].data[0].rowData[i];
    var blogEntry = document.createElement('div');
    blogEntry.className = 'index-blog-entry';
    blogBorder.appendChild(blogEntry);
    var blogTitle = document.createElement('h3');
    blogEntry.appendChild(blogTitle);
    blogTitle.appendChild(document.createTextNode(currentEntry.values[1].formattedValue));
    var blogByline = document.createElement('span');
    blogEntry.appendChild(blogByline);
    var blogDate = currentEntry.values[0].formattedValue;
    var blogAuthor = currentEntry.values[2].formattedValue;
    blogByline.appendChild(document.createTextNode(blogDate + ' - By: ' + blogAuthor));
    var blogBody= document.createElement('p');
    blogEntry.appendChild(blogBody);
    blogBody.appendChild(document.createTextNode(currentEntry.values[3].formattedValue));
    if (currentEntry.values.length > 4) {
      var blogLink = document.createElement('a');
      blogLink.href = currentEntry.values[5].formattedValue;
      blogLink.appendChild(document.createTextNode(currentEntry.values[4].formattedValue));
      blogEntry.appendChild(blogLink);
    }
  }
}

function initDisplay () {
  var scoreboard = document.getElementById('index-scoreboard-body');
  while (scoreboard.firstChild) {
    scoreboard.removeChild(scoreboard.firstChild);
  }
  var scoreboardBorder = document.createElement('div');
  scoreboardBorder.className = 'index-scoreboard-container panel';
  scoreboard.appendChild(scoreboardBorder);
}

initDisplay();
getSheet(teams, populateScoreboard);
getSheet(blog, populateBlog);
