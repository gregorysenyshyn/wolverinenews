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
  var linkBackContainer = document.createElement('div');
  linkBackContainer.className = 'pure-u-1';
  var linkBack = document.createElement('button');
  linkBack.className = 'pure-button-active';
  linkBack.href = "#";
  linkBack.onclick = function() {populateAllTeams(responseSheet);};
  linkBackContainer.appendChild(linkBack);
  linkBack.appendChild(document.createTextNode('<< Back to all teams'));
  teamsPanel.appendChild(linkBackContainer);
  for (var sheet in responseSheet.sheets) {
    if (responseSheet.sheets[sheet].properties.title === name) {
      var currentSheet = responseSheet.sheets[sheet];
      var parsedPosts = parseSheet(currentSheet);
      var teamNameContainer = document.createElement('div');
      teamsPanel.appendChild(teamNameContainer);
      teamNameContainer.className = 'pure-u-1 team-name';
      var teamName = document.createElement('h2');
      teamName.appendChild(document.createTextNode(currentSheet.properties.title));
      teamNameContainer.appendChild(teamName);
      var blogContainer = document.createElement('div');
      blogContainer.className = 'pure-u-1 pure-u-lg-2-3';
      blogContainer.id = 'blog-container';
      teamsPanel.appendChild(blogContainer);
      var blogHeader = document.createElement('div');
      blogHeader.className = 'pure-u-1 team-blog-header';
      blogContainer.appendChild(blogHeader);
      var blogHeaderText = document.createElement('h2');
      blogHeaderText.appendChild(document.createTextNode('News'));
      blogHeader.appendChild(blogHeaderText);
      blogHeader.appendChild(document.createElement('hr'));
      var scoreBoard = document.createElement('div');
      scoreBoard.className = 'pure-u-1 pure-u-lg-1-3';
      scoreBoard.id = 'team-score-container';
      teamsPanel.appendChild(scoreBoard);
      
      var teamsPanelHeader = document.createElement('div');
      scoreBoard.appendChild(teamsPanelHeader);
      var teamsPanelHeaderText = document.createElement('h2');
      teamsPanelHeader.appendChild(teamsPanelHeaderText);
      teamsPanelHeaderText.appendChild(document.createTextNode('Games'));

      for (var post in parsedPosts) { 
        if (parsedPosts[post].type === 'score') {
          
          var scoresContainer = document.createElement('div');
          scoresContainer.className = 'pure-g';
          scoreBoard.appendChild(scoresContainer);
          var gameScore = document.createElement('div');
          gameScore.className = 'pure-u-1 pure-u-lg-1 team-scoreboard-game-result';
          scoresContainer.appendChild(gameScore);
          var gameDate = document.createElement('h4');
          gameDate.appendChild(document.createTextNode(parsedPosts[post].date.getFullYear() + '/' + parsedPosts[post].date.getMonth() + '/' + parsedPosts[post].date.getDate()));
          gameScore.appendChild(gameDate);
          
          var ourName = document.createElement('span');
          ourName.className = 'index-scoreboard-school';
          ourName.appendChild(document.createTextNode('WHSS'));
          gameScore.appendChild(ourName);

          var gameScoreScores = document.createElement('span');
          gameScoreScores.className = 'index-scoreboard-score';
          var ourScore = parsedPosts[post]['our score'];
          var theirScore = parsedPosts[post]['their score'];
          gameScoreScores.appendChild(document.createTextNode(ourScore + ' - ' + theirScore));
          gameScore.appendChild(gameScoreScores);

          var theirName = document.createElement('span');
          theirName.className = 'index-scoreboard-school';
          theirName.appendChild(document.createTextNode(parsedPosts[post]['their name']));
          gameScore.appendChild(theirName);
        }
        var blogPost = document.createElement('div');
        blogPost.className = 'pure-g team-blog-post';
        blogContainer.appendChild(blogPost);
        var blogPostTitle = document.createElement('div');
        blogPostTitle.className = 'pure-u-1';
        var blogPostTitleText = document.createElement('h2');
        blogPostTitleText.appendChild(document.createTextNode(parsedPosts[post].headline));
        blogPostTitle.appendChild(blogPostTitleText);
        blogPost.appendChild(blogPostTitle);

        if (parsedPosts[post].type === 'score') {
          var blogPostScore = document.createElement('div');
          blogPostScore.className = 'pure-u-1';
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
        blogPostByline.className = 'pure-u-1';
        var blogPostBylineText = document.createElement('span');
        blogPostBylineText.appendChild(bylineString);
        blogPostByline.appendChild(blogPostBylineText);
        blogPost.appendChild(blogPostByline);

        var blogPostBody = document.createElement('div');
        blogPostBody.className = 'pure-u-1';
        var blogPostBodyText = document.createElement('p');
        blogPostBodyText.appendChild(document.createTextNode(parsedPosts[post].body));
        blogPostBody.appendChild(blogPostBodyText);
        blogPost.appendChild(blogPostBody);

        if ('link title' in parsedPosts[post] && 'link destination' in parsedPosts[post]) {
          var blogPostLink = document.createElement('div');
          blogPostLink.className = 'pure-u-1';
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
  var link = document.createElement('a');
  link.className = 'pure-u-1 pure-u-md-1-2 pure-u-lg-1-3';
  link.href = "#";
  link.onclick = function(){initTeam(teamBoardData.name);};
  var teamBoardContainer = document.createElement('div');
  teamBoardContainer.className = 'team-board-container';
  link.appendChild(teamBoardContainer);
  var teamBoard = document.createElement('div');
  teamBoardContainer.appendChild(teamBoard);
  teamBoard.className = 'team-board';
  var teamBoardTitle = document.createElement('h2');
  teamBoard.appendChild(teamBoardTitle);
  teamBoardTitle.appendChild(document.createTextNode(teamBoardData.name));
  var teamBoardCoachContainer = document.createElement('div');
  teamBoardCoachContainer.className = 'pure-u-1 team-board-coach-container';
  var coachName = document.createElement('span');
  teamBoardCoachContainer.appendChild(coachName);
  coachName.appendChild(document.createTextNode(teamBoardData.teacher));
  teamBoard.appendChild(teamBoardCoachContainer);
  var teamBoardStatusContainer = document.createElement('div');
  teamBoardStatusContainer.className = 'pure-u-1';
  var teamBoardStatus = document.createElement('span');
  teamBoardStatusContainer.appendChild(teamBoardStatus);
  teamBoardStatus.className = 'teams-status';
  teamBoard.appendChild(teamBoardStatusContainer);
  teamBoardStatus.appendChild(document.createTextNode(teamBoardData['current status']));
  
  if (teamBoardData['current status'] !== 'Season Finished') {
    var teamBoardPracticeTimeContainer = document.createElement('div');
    if (teamBoardData['current status'] !== 'Tryouts') {
      var teamBoardPracticeTitle = document.createElement('span');
      teamBoardPracticeTimeContainer.appendChild(document.createElement('br'));
      teamBoardPracticeTitle.appendChild(document.createTextNode('Practices'));
      teamBoardPracticeTimeContainer.appendChild(teamBoardPracticeTitle);
    }
    
    teamBoardPracticeTimeContainer.appendChild(document.createElement('br'));
    var teamBoardPracticeTime = document.createElement('span');
    teamBoardPracticeTime.appendChild(document.createTextNode(teamBoardData.practice));
    teamBoardPracticeTimeContainer.appendChild(teamBoardPracticeTime);
    teamBoard.appendChild(teamBoardPracticeTimeContainer);
  }
  return link;
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

