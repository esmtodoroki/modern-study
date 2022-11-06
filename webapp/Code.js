//カウンター値を保存するスプレッドシートの定義
const SHEET_ID = '1P6GHIrw11mKkV0xcBEyLfcov9sQGygYouIq5zM2ScbA'
const SHEET_NAME = 'counter'

function doGet() {
  var template = HtmlService.createTemplateFromFile('index');
  var spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  var range = sheet.getRange('A1');
  var value = range.getValue();
  template.currentCounter = value;
  return template.evaluate();
}

//画面から受け取ったカウンター値をA1セルに保存する
function setSheetData(value) {
  var spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  var range = sheet.getRange('A1');
  range.setValue(value);
}

//A1セルのカウンター値を取得する
function getSheetData() {
  var spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  var range = sheet.getRange('A1');
  return range.getValue();
}
