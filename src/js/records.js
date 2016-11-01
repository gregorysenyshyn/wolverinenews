function parseRecords (records) {
  var parsedRecords = [];
  for (var record=1; record < records.length; record+=1) {
    var currentRecord = {};
    if (records[record].values[5] !== undefined){
      currentRecord.type = records[record].values[0].formattedValue;
      currentRecord.event = records[record].values[1].formattedValue;
      currentRecord.result = records[record].values[2].formattedValue;
      currentRecord.first = records[record].values[3].formattedValue;
      currentRecord.last = records[record].values[4].formattedValue;
      currentRecord.staff = records[record].values[5].formattedValue;
      parsedRecords.push(currentRecord);
    }
  }
  return parsedRecords;
}


function initRecordRow (parsedRecord) {
  var row = document.createElement('div');
  row.className = 'pure-g';
  var recordsType = document.createElement('div');
  row.appendChild(recordsType);
  recordsType.className = 'pure-u-1-8';
  var recordsTypeLabel = document.createElement('span');
  recordsTypeLabel.appendChild(document.createTextNode(parsedRecord.type));
  recordsType.appendChild(recordsTypeLabel);

  
  var recordsEvent = document.createElement('div');
  row.appendChild(recordsEvent);
  recordsEvent.className = 'pure-u-1-4';
  var recordsEventLabel = document.createElement('span');
  recordsEventLabel.appendChild(document.createTextNode(parsedRecord.event));
  recordsEvent.appendChild(recordsEventLabel);

  var recordsName = document.createElement('div');
  row.appendChild(recordsName);
  recordsName.className = 'pure-u-1-4';
  var recordsNameLabel = document.createElement('span');
  var nameText = null;
  if ('first' in parsedRecord && 'last' in parsedRecord){
    nameText = parsedRecord.first + ' ' + parsedRecord.last;
  }
  else {
    nameText = 'Name';
  }
  recordsNameLabel.appendChild(document.createTextNode(nameText));
  recordsName.appendChild(recordsNameLabel);


  var recordsResult = document.createElement('div');
  row.appendChild(recordsResult);
  recordsResult.className = 'pure-u-1-8';
  var recordsResultLabel = document.createElement('span');
  var recordsResultText = null;
  if (parsedRecord.result !== undefined) {
    recordsResultText = document.createTextNode(parsedRecord.result);
    recordsResultLabel.appendChild(recordsResultText);
  }
  recordsResult.appendChild(recordsResultLabel);

  var recordsStaff = document.createElement('div');
  row.appendChild(recordsStaff);
  recordsStaff.className = 'pure-u-1-4';
  var recordsStaffLabel = document.createElement('span');
  var nameText = null;
  if ('first' in parsedRecord && 'last' in parsedRecord){
    staffText = parsedRecord.staff;
  }
  else {
    staffText = 'Staff Supervisor';
  }
  recordsStaffLabel.appendChild(document.createTextNode(staffText));
  recordsStaff.appendChild(recordsStaffLabel);
  
  return row;

}

function setRecords (response) {
  var recordBoard = document.getElementById('record-board');
  var recordsTable = document.createElement('div');
  recordsTable.className = 'pure-u-1';
  recordBoard.appendChild(recordsTable);
  var headerLabels = {type:'Type',
                      event: 'Event',
                      result: 'Result',
                      staff: 'Staff Supervisor'};
  var newRow = initRecordRow(headerLabels);
  newRow.id = 'records-header-row';
  recordsTable.appendChild(newRow);

  var parsedRecords = parseRecords(response['sheets'][0]['data'][0]['rowData']);
  for (record in parsedRecords) {
    newRow = initRecordRow(parsedRecords[record]);
    newRow.className = 'records-row';
    recordsTable.appendChild(newRow);
  }

}

getSheet(records, setRecords);

