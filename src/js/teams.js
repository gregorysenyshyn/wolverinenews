function parseSheet (sheet) {
  var parsedPosts = [];
  for (var record=1; record < sheet.data[0].rowData.length; record+=1) {
    var currentRecord = {};
    if (sheet.data[0].rowData[record].values[0].formattedValue !== undefined) {
      var dateArray = sheet.data[0].rowData[record].values[0].formattedValue.split('/');
      currentRecord.date = new Date(dateArray[2], dateArray[0], dateArray[1]);
      if (sheet.data[0].rowData[record].values[2].formattedValue){
        currentRecord.author = sheet.data[0].rowData[record].values[2].formattedValue;
      }
      if (sheet.data[0].rowData[record].values[1].formattedValue === 'Game Summary') {
        currentRecord.type = 'score';
        currentRecord['our score'] = sheet.data[0].rowData[record].values[3].formattedValue;
        currentRecord['their score'] = sheet.data[0].rowData[record].values[4].formattedValue;
        currentRecord['their name'] = sheet.data[0].rowData[record].values[5].formattedValue;
      }
      else if (sheet.data[0].rowData[record].values[1].formattedValue === 'Blog Post') {
        currentRecord.type = 'news';
      }
      currentRecord.headline = sheet.data[0].rowData[record].values[6].formattedValue;
      currentRecord.body = sheet.data[0].rowData[record].values[7].formattedValue;
      if (sheet.data[0].rowData[record].values[8] !== undefined && sheet.data[0].rowData[record].values[9] !== undefined) {
        currentRecord['link title'] = sheet.data[0].rowData[record].values[8].formattedValue;
        currentRecord['link destination'] = sheet.data[0].rowData[record].values[9].formattedValue;
      }
      parsedPosts.push(currentRecord);
    }
  }
  return parsedPosts;
}

function parseTeamBoard (values) {
  var teamBoardData = {};
  teamBoardData.name = values[0].formattedValue;
  teamBoardData.type = values[1].formattedValue;
  teamBoardData.practice = values[2].formattedValue;
  teamBoardData['current status'] = values[3].formattedValue;
  teamBoardData.teacher = values[4].formattedValue;
  return teamBoardData;
}

function initTeam (name) {
  var teamsPanel = document.getElementById('teams-panel');
  while (teamsPanel.firstChild) {
    teamsPanel.removeChild(teamsPanel.firstChild);
  }
  var titleContainer = document.createElement('div');
  titleContainer.id = 'title-container';
  teamsPanel.appendChild(titleContainer);
  var linkBack = document.createElement('button');
  linkBack.onclick = function() {populateAllTeams(responseSheet);};
  linkBack.appendChild(document.createTextNode('<< Back to all teams'));
  titleContainer.appendChild(linkBack);
  var teamNameContainer = document.createElement('div');
  teamNameContainer.className = 'team-name';
  titleContainer.appendChild(teamNameContainer);
  var teamName = document.createElement('span');
  teamNameContainer.appendChild(teamName);
  for (var sheet in responseSheet.sheets) {
    if (responseSheet.sheets[sheet].properties.title === name) {
      var currentSheet = responseSheet.sheets[sheet];
      teamName.appendChild(document.createTextNode(currentSheet.properties.title));
      var blogContainer = document.createElement('div');
      blogContainer.id = 'team-blog-container';
      blogContainer.className = 'team-container';
      teamsPanel.appendChild(blogContainer);
      var blogHeader = document.createElement('div');
      blogHeader.className = 'team-blog-header';
      blogContainer.appendChild(blogHeader);
      var blogHeaderText = document.createElement('h2');
      blogHeaderText.appendChild(document.createTextNode('News'));
      blogHeader.appendChild(blogHeaderText);
      var scoreBoard = document.createElement('div');
      scoreBoard.id = 'team-scoreboard-container';
      scoreBoard.className = 'team-container';
      teamsPanel.appendChild(scoreBoard);
      
      var teamsPanelHeader = document.createElement('div');
      scoreBoard.appendChild(teamsPanelHeader);
      var teamsPanelHeaderText = document.createElement('h2');
      teamsPanelHeader.appendChild(teamsPanelHeaderText);
      teamsPanelHeaderText.appendChild(document.createTextNode('Games'));
      var teamsScoreboard = document.createElement('div');
      teamsScoreboard.className = 'teams-scoreboard panel';
      scoreBoard.appendChild(teamsScoreboard);

      var parsedPosts = parseSheet(currentSheet);
      for (var post=0; post<parsedPosts.length; post++) { 
        if (parsedPosts[post].type === 'score') {
          var scoresContainer = document.createElement('div');
          teamsScoreboard.appendChild(scoresContainer);
          if (post !==0) {
            scoresContainer.appendChild(document.createElement('hr'));
          }
          var gameScore = document.createElement('div');
          gameScore.className = 'team-scoreboard-game-result';
          scoresContainer.appendChild(gameScore);
          var gameDate = document.createElement('p');
          gameDate.className = 'teams-game-date';
          gameDate.appendChild(document.createTextNode(parsedPosts[post].date.getFullYear() + '/' + parsedPosts[post].date.getMonth() + '/' + parsedPosts[post].date.getDate()));
          gameScore.appendChild(gameDate);

          var scoreLine = document.createElement('div');
          scoreLine.className = 'teams-score-line';
          gameScore.appendChild(scoreLine);
          var ourName = document.createElement('span');
          ourName.className = 'teams-scoreboard-school';
          ourName.appendChild(document.createTextNode('WHSS'));
          scoreLine.appendChild(ourName);

          var gameScoreOurScore = document.createElement('div');
          gameScoreOurScore.className = 'teams-scoreboard-our-score';
          gameScoreOurScore.appendChild(document.createTextNode(parsedPosts[post]['our score']));
          scoreLine.appendChild(gameScoreOurScore);

          var gameScoreSpacer = document.createElement('div');
          gameScoreSpacer.className = 'teams-scoreboard-spacer';
          gameScoreSpacer.appendChild(document.createTextNode('-'));
          scoreLine.appendChild(gameScoreSpacer);

          var gameScoreTheirScore = document.createElement('div');
          gameScoreTheirScore.className = 'teams-scoreboard-their-score';
          gameScoreTheirScore.appendChild(document.createTextNode(parsedPosts[post]['their score']));
          scoreLine.appendChild(gameScoreTheirScore);

          var theirName = document.createElement('span');
          theirName.className = 'teams-scoreboard-school teams-scoreboard-their-name';
          theirName.appendChild(document.createTextNode(parsedPosts[post]['their name']));
          scoreLine.appendChild(theirName);
        }
        var blogPost = document.createElement('div');
        blogPost.className = 'team-blog-post panel';
        blogContainer.appendChild(blogPost);
        var blogPostTitle = document.createElement('div');
        var blogPostTitleText = document.createElement('h3');
        blogPostTitleText.appendChild(document.createTextNode(parsedPosts[post].headline));
        blogPostTitle.appendChild(blogPostTitleText);
        blogPost.appendChild(blogPostTitle);

        if (parsedPosts[post].type === 'score') {
          var blogPostScore = document.createElement('div');
          var blogPostTextNode = document.createTextNode('WHSS ' + parsedPosts[post]['our score'] + ' - ' + parsedPosts[post]['their score'] + ' ' + parsedPosts[post]['their name']);
          var blogPostScoreText = document.createElement('span');
          blogPostScoreText.appendChild(blogPostTextNode);
          blogPostScoreText.className = 'team-blog-score';
          blogPostScore.appendChild(blogPostScoreText);
          blogPost.appendChild(blogPostScore);
        }

        var blogPostByline = document.createElement('div');
        var bylineString = null; 
        if (parsedPosts[post].author) {
          bylineString = document.createTextNode(parsedPosts[post].date.getFullYear() + '/' + parsedPosts[post].date.getMonth() + '/' + parsedPosts[post].date.getDate() + ' - By: ' + parsedPosts[post].author);
        }
        else {
          bylineString = document.createTextNode(parsedPosts[post].date.getFullYear() + '/' + parsedPosts[post].date.getMonth() + '/' + parsedPosts[post].date.getDate());
        }
        var blogPostBylineText = document.createElement('span');
        blogPostBylineText.appendChild(bylineString);
        blogPostByline.appendChild(blogPostBylineText);
        blogPost.appendChild(blogPostByline);

        var blogPostBody = document.createElement('div');
        var blogPostBodyText = document.createElement('p');
        blogPostBodyText.appendChild(document.createTextNode(parsedPosts[post].body));
        blogPostBody.appendChild(blogPostBodyText);
        blogPost.appendChild(blogPostBody);

        if ('link title' in parsedPosts[post] && 'link destination' in parsedPosts[post]) {
          var blogPostLink = document.createElement('div');
          var blogPostLinkText = document.createElement('a');
          blogPostLinkText.appendChild(document.createTextNode(parsedPosts[post]['link title']));
          blogPostLinkText.href = parsedPosts[post]['link destination'];
          blogPostLink.appendChild(blogPostLinkText);
          blogPost.appendChild(blogPostLink);
        }
      }
    }
  }
}


function initTeamBoard (teamBoardData) {
  var teamBoardContainer = document.createElement('div');
  teamBoardContainer.className = 'team-board-container';
  var teamBoard = document.createElement('div');
  teamBoard.className = 'team-board panel';
  teamBoardContainer.appendChild(teamBoard);
  teamBoard.onclick = function(){initTeam(teamBoardData.name);};
  var teamBoardTitle = document.createElement('h3');
  teamBoard.appendChild(teamBoardTitle);
  teamBoardTitle.appendChild(document.createTextNode(teamBoardData.name));
  var teamBoardCoachContainer = document.createElement('div');
  teamBoardCoachContainer.className = 'team-board-coach-container';
  var coachName = document.createElement('span');
  teamBoardCoachContainer.appendChild(coachName);
  coachName.appendChild(document.createTextNode(teamBoardData.teacher));
  teamBoard.appendChild(teamBoardCoachContainer);
  var teamBoardStatusContainer = document.createElement('div');
  var teamBoardStatus = document.createElement('h4');
  teamBoardStatusContainer.appendChild(teamBoardStatus);
  teamBoard.appendChild(teamBoardStatusContainer);
  teamBoardStatus.appendChild(document.createTextNode(teamBoardData['current status']));
  
  if (teamBoardData['current status'] !== 'Season Finished') {
    var teamBoardPracticeTimeContainer = document.createElement('div');
    if (teamBoardData['current status'] !== 'Tryouts') {
      var teamBoardPracticeTitle = document.createElement('h4');
      teamBoardPracticeTitle.className = 'nomargin';
      teamBoardPracticeTimeContainer.appendChild(document.createElement('br'));
      teamBoardPracticeTitle.appendChild(document.createTextNode('Practices'));
      teamBoardPracticeTimeContainer.appendChild(teamBoardPracticeTitle);
    }
    
    teamBoardPracticeTimeContainer.appendChild(document.createElement('br'));
    var teamBoardPracticeTime = document.createElement('span');
    teamBoardPracticeTime.className = 'team-board-practice-time';
    teamBoardPracticeTime.appendChild(document.createTextNode(teamBoardData.practice));
    teamBoardPracticeTimeContainer.appendChild(teamBoardPracticeTime);
    teamBoard.appendChild(teamBoardPracticeTimeContainer);
  }
  return teamBoardContainer;
}

function populateAllTeams (responseSheet) {
  var teamsPanel = document.getElementById('teams-panel');
  while (teamsPanel.firstChild) {
    teamsPanel.removeChild(teamsPanel.firstChild);
  }

  for (var sheet in responseSheet.sheets) {
    var currentSheet = responseSheet.sheets[sheet];
    if (currentSheet.properties.title === 'Index') { 
      for (var i=1; i < currentSheet.data[0].rowData.length; i+=1) {
        if (currentSheet.data[0].rowData[i].values[0].formattedValue !== undefined) {
          var teamBoardData = parseTeamBoard(currentSheet.data[0].rowData[i].values);
          var currentTeamBoardValues = initTeamBoard(teamBoardData);
          teamsPanel.appendChild(currentTeamBoardValues);
        }
      }
    }
  }
}

function setSheet (response) {
  responseSheet = response;
  populateAllTeams(responseSheet);
}

var responseSheet = null;
getSheet(teams, setSheet);

