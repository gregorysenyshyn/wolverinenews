var parsedAnnouncements = [];
var announcementResponses = 0;
var switcher = null;
var reloader = null;
var expectedResponses = 3;
var switchDelay = 10000;


function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}

function switchAnnouncements() {
  var currentAnnouncement = parsedAnnouncements[Math.floor(Math.random()*parsedAnnouncements.length)];
  if (currentAnnouncement.type === 'announcement') {
    if ('title' in currentAnnouncement) {
      document.getElementById('title').textContent = currentAnnouncement.title;
    }
    else {
      document.getElementById('title').textContent = '';
    }

    if ('body' in currentAnnouncement) {
      document.getElementById('body').textContent = currentAnnouncement.body;
    }
    else {
      document.getElementById('body').textContent = '';
    }

    if ('link' in currentAnnouncement) {
      document.getElementById('footer').textContent = currentAnnouncement.link;
    }
    else {
      document.getElementById('footer').textContent = '';
    }
  }

  else if (currentAnnouncement.type === 'record') {
    document.getElementById('title').textContent = 'Exceptional Wolverine' ;
    var recordTextBeginning = '<p>The current record for<br><span class="record-name">' + currentAnnouncement.eventName + '</span><br>';
    if (currentAnnouncement.result !== undefined) {
      var recordTextMiddle = ' is:<br><span class="record-result">'+ currentAnnouncement.result + '</span><br>set by:<br>';
    }
    else {
      var recordTextMiddle = ' is held by:<br>';
    }
    var recordTextEnd = '<span class="record-holder">' + currentAnnouncement.studentFirst + ' ' + currentAnnouncement.studentLast + '</span></p>';
    document.getElementById('body').innerHTML =  recordTextBeginning + recordTextMiddle + recordTextEnd;
    document.getElementById('footer').innerHTML = '<span>If you think you can beat ' + currentAnnouncement.studentFirst + '\'s result, see ' + currentAnnouncement.staff + '</span>'; 
  }

  else if (currentAnnouncement.type === 'team') {
    document.getElementById('title').textContent = currentAnnouncement.sport;
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    document.getElementById('body').innerHTML = '<p><span>Most Recent Game: ' + monthNames[currentAnnouncement.date.getMonth()] + ' ' + currentAnnouncement.date.getDate() + 
                                                '</span><br><br><span>WHSS ' + currentAnnouncement.score + ' ' + currentAnnouncement.opponent + '</span></p>';
    document.getElementById('footer').textContent = 'Listen carefully to announcements for updates on our next game!';
  }
}


function consider(potentialAnnouncement, today) {
  if (potentialAnnouncement.start <= today && today <= potentialAnnouncement.end) {

    if (potentialAnnouncement.end.getMonth() < potentialAnnouncement.start.getMonth()){
      //goes across year change
      if (today.getMonth() <= 6){
        if ((new Date(today.getFullYear()) - 1),
                      potentialAnnouncement.start.getMonth(),
                      potentialAnnouncement.start.getDate() <= today &&
             today <= new Date(today.getFullYear(),
                               potentialAnnouncement.start.getMonth(),
                               potentialAnnouncement.start.getDate())){
          return true;
        }
      }

      else if (today.getMonth() >= 8){
        if (new Date(today.getFullYear(),
                     potentialAnnouncement.start.getMonth(),
                     potentialAnnouncement.start.getDate()) <= today &&
             today <= new Date((today.getFullYear() + 1),
                                potentialAnnouncement.end.getMonth(),
                                potentialAnnouncement.end.getDate())){
          return true;
        }
      }
    }
    else {
      //Doesn't go across year change
      if (new Date(today.getFullYear(),
                   potentialAnnouncement.start.getMonth(),
                   potentialAnnouncement.start.getDate()) <= today &&
          today <= new Date(today.getFullYear(),
                            potentialAnnouncement.end.getMonth(),
                            potentialAnnouncement.end.getDate())) {
        return true;
      }
    }
  }
  return false;
}


function handleTeams (teamsResponse) {
  var indexData = teamsResponse.sheets[0].data[0].rowData;
  var currentTeams = [];
  for (var i = 1; i < indexData.length; i += 1) {
    if (indexData[i].values[1].formattedValue === 'Team' &&
        indexData[i].values[3].formattedValue === 'In Season') {
      currentTeams.push(indexData[i].values[0].formattedValue)
    }
  }
  var recentGames = [];
  for (i = 2; i < teamsResponse.sheets.length; i += 1) {
    if (currentTeams.indexOf(teamsResponse.sheets[i].properties.title) !== -1) {
      var sheetData = teamsResponse.sheets[i].data[0].rowData;
      for (var row in sheetData) {
        if (sheetData[row].values[1].formattedValue === 'Game Summary' && sheetData[row].values[0].formattedValue !== undefined) {
          var newGame = {};
          var dateArray = sheetData[row].values[0].formattedValue.split('/');
          newGame.type = 'team';
          newGame.date = new Date(Number(dateArray[2]), Number(dateArray[0] - 1), Number(dateArray[1]));
          newGame.sport = teamsResponse.sheets[i].properties.title;
          newGame.score = sheetData[row].values[3].formattedValue + ' - ' + sheetData[row].values[4].formattedValue;
          newGame.opponent = sheetData[row].values[5].formattedValue;
          recentGames.push(newGame);
        }
      }
    }
  }
  return recentGames;
}


function handleRecords (recordsResponse) {
  var rawAnnouncements = recordsResponse.sheets[0].data[0].rowData;
  var currentAnnouncements = [];
  for (var item = 1; item < rawAnnouncements.length; item += 1) {
    if (rawAnnouncements[item].values.length > 1 && rawAnnouncements[item].values[0].formattedValue) {
      var newAnnouncement = {};
      newAnnouncement.type = 'record';
      if (rawAnnouncements[item].values[0].formattedValue === 'Open') {
        newAnnouncement.eventName = rawAnnouncements[item].values[1].formattedValue;
      }
      else if (rawAnnouncements[item].values[0].formattedValue === 'Male') {
        newAnnouncement.eventName = "Boys\' " + rawAnnouncements[item].values[1].formattedValue;
      }
      else if (rawAnnouncements[item].values[0].formattedValue === 'Female') {
        newAnnouncement.eventName = "Girls\' " + rawAnnouncements[item].values[1].formattedValue;
      }
      newAnnouncement.result = rawAnnouncements[item].values[2].formattedValue;
      newAnnouncement.studentFirst = rawAnnouncements[item].values[3].formattedValue;
      newAnnouncement.studentLast = rawAnnouncements[item].values[4].formattedValue;
      newAnnouncement.staff = rawAnnouncements[item].values[5].formattedValue;
      currentAnnouncements.push(newAnnouncement);
    }
  }
  return currentAnnouncements;
}


function handleAnnouncements(announcementResponse) {
  var rawAnnouncements = announcementResponse.sheets[0].data[0].rowData;
  var currentAnnouncements = [];
  var today = new Date();
  for (var item in rawAnnouncements) {
    if (rawAnnouncements[item].values[0].formattedValue && rawAnnouncements[item].values[0].formattedValue !== 'Start Year') {
      var potentialAnnouncement = {};
      potentialAnnouncement.start = new Date(rawAnnouncements[item].values[0].formattedValue,
                                             Number(rawAnnouncements[item].values[1].formattedValue) - 1,
                                             rawAnnouncements[item].values[2].formattedValue
                                             );
      potentialAnnouncement.end = new Date(rawAnnouncements[item].values[3].formattedValue,
                                           Number(rawAnnouncements[item].values[4].formattedValue) - 1,
                                           rawAnnouncements[item].values[5].formattedValue
                                           );
      if (consider(potentialAnnouncement, today)) {
        var newAnnouncement = {}
        newAnnouncement.type = 'announcement';
        if (rawAnnouncements[item].values[6] && rawAnnouncements[item].values[6].formattedValue !== undefined) {
          newAnnouncement.title = rawAnnouncements[item].values[6].formattedValue;
        }
        
        if (rawAnnouncements[item].values[7] && rawAnnouncements[item].values[7].formattedValue !== undefined) {
          newAnnouncement.body = rawAnnouncements[item].values[7].formattedValue;
        }

        if (rawAnnouncements[item].values[8] && rawAnnouncements[item].values[8].formattedValue !== undefined) {
          newAnnouncement.link = rawAnnouncements[item].values[8].formattedValue;
        }

        currentAnnouncements.push(newAnnouncement);
      }
    }
  }
  return currentAnnouncements;
}

function appendResponse (response) {
  for (item in response) {
    parsedAnnouncements.push(response[item]);
  }
}

function checkCompletion() {
  announcementResponses += 1;
  if (announcementResponses === expectedResponses) {
    window.clearInterval(switcher);
    window.clearTimeout(reloader);
    switchAnnouncements();
    switcher = window.setInterval(switchAnnouncements, switchDelay);
    reloader = window.setTimeout(getData, 3600000);
  }
}

function getSheet (sheetId, callback) {
  return new Promise (
    function (resolve, reject) {   
      var req = new XMLHttpRequest();
      req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
          resolve(callback(JSON.parse(req.responseText)));
        }
        else if ( req.readyState === 4 && req.status !== 200 ) {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function () {
        reject(Error('Network Error'));
      }
      req.open('GET', 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetId + '?key=' + API_KEY + '&includeGridData=true', true);
      req.send();
    }
  );
}


function getData () {
  announcementResponses = 0;
  getSheet(announcements, handleAnnouncements).then( 
    function (response) { appendResponse(response );}
  ).then(
    function(response) { checkCompletion(); }
  );

  getSheet(records, handleRecords).then(
    function (response) { appendResponse(response );}
  ).then(
    function(response) { checkCompletion(); }
  );

  getSheet(teams, handleTeams).then(
    function (response) { appendResponse(response );}
  ).then(
    function(response) { checkCompletion(); }
  );
}


unloadScrollBars();
getData();

//Twitter stuff

function handleTweets (response) {
  var twitterFeed = document.getElementById('twitter-feed');
  while (twitterFeed.firstChild) {
    twitterFeed.removeChild(twitterFeed.firstChild);
  }
  var twitterList = document.createElement('ul');
  twitterFeed.appendChild(twitterList);
  for (var tweet in response) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = response[tweet];
    var tweetText = tempDiv.getElementsByClassName('tweet')[0].textContent;
    var timeText = tempDiv.getElementsByClassName('timePosted')[0].textContent.slice(10);
    var currentItem = document.createElement('li');
    currentItem.appendChild(document.createTextNode(timeText + ' - ' + tweetText));
    twitterList.appendChild(currentItem);
  }
}

var twitterConfig = {
  "id": '676811488053616644',
  "maxTweets": 10,
  "customCallback": handleTweets,
};

twitterFetcher.fetch(twitterConfig);
