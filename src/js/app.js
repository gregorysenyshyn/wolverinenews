function getSheet (sheetId, callback) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      callback(JSON.parse(req.responseText));
    }
  };
  req.open('GET', 'https://sheets.googleapis.com/v4/spreadsheets/' + sheetId + '?key=' + API_KEY + '&includeGridData=true', true);
  req.send();
}

