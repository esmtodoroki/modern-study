function doGet() {
    return HtmlService.createTemplateFromFile('index').evaluate();
}

//カウンター値を保存するスプレッドシートの定義
const SHEET_ID = '1P6GHIrw11mKkV0xcBEyLfcov9sQGygYouIq5zM2ScbA'
const SHEET_NAME = 'counter'

//画面から受け取ったカウンター値をA1セルに保存する
function setSheetData(value) {
  var spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  var range = sheet.getRange('A1');
  range.setValue(value);
}
