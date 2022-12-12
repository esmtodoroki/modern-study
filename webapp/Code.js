//カウンター値を保存するスプレッドシートの定義
const SHEET_ID = '1P6GHIrw11mKkV0xcBEyLfcov9sQGygYouIq5zM2ScbA'
const SHEET_NAME = 'counter'

//CloudSQL接続情報
const CONNECTION_NAME = 'esm-gcp-study:us-central1:modern-study'
const DATABASE_NAME = 'web_counter_esmtodoroki'
const USER_NAME = 'esm'
const PASSWORD = 'esm'
const URL = 'jdbc:google:mysql://' + CONNECTION_NAME + '/' + DATABASE_NAME
const CONNECTION = Jdbc.getCloudSqlConnection(URL, USER_NAME, PASSWORD)
const EXECUTE_QUERY = CONNECTION.createStatement().executeQuery

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

//カウンター値保存用テーブルにレコードを新規作成する（初回登録）
function insertNewRecord(value) {
  var statement = CONNECTION.prepareStatement('INSERT INTO counter_table (id, counter) values (1, ?)');
  statement.setInt(1, value);
  statement.executeUpdate();
  
  statement.close();
  CONNECTION.close();
}

//カウンター値保存用テーブルのレコードを更新する
function updateRecord(value) {
  var statement = CONNECTION.prepareStatement('UPDATE counter_table SET counter=? WHERE id=1');
  statement.setInt(1, value);
  statement.executeUpdate();

  statement.close();
  CONNECTION.close();
}

//カウンター値保存用テーブルのレコード（カウンター値）を取得する
function readRecord() {
  var results = EXECUTE_QUERY('SELECT * FROM counter_table WHERE id = 1');
  results.next();
  var currentCounter = results.getInt('counter');
  return currentCounter;
}

//カウンター値保存用テーブルのレコード数を取得する
// （初回登録の判定に使用）
function countRecord() {
  var results = EXECUTE_QUERY('SELECT COUNT(*) cnt FROM counter_table');
  results.next();
  var rowCount = results.getInt('cnt');
  return rowCount;
}
