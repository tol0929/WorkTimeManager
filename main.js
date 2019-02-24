/**
 * 一番始めに実行される
 */
function doGet(event) {
  Logger.log("doGet");
  // HTMLを返す
  var htmlTemplate = HtmlService.createTemplateFromFile("index");
  var htmlOutput = htmlTemplate.evaluate();
  
  htmlOutput
    .setTitle('シフトツール')
//    .setFaviconUrl('https://drive.google.com/uc?id=1Dyl1hjZSRJhhS_n2bBuASxZOKUI9a0At')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');

  return htmlOutput;
}

/**
 * main
 */
function main() {  
  // スプレッドシートのアクティブなシートを取得
  var sheet = SpreadsheetApp.getActiveSheet();
  
  // 塗りつぶしリセット
  sheet.getRange("D2:S22").setBackground("#FFF");
  
  // 従業員取得
  var employeeRange = sheet.getRange("A2:A32").getValues();
  var employees = new Array();

  for (var i = 0; i < employeeRange.length; i++) {
    if (employeeRange[i] != "") {
      employees[i] = employeeRange[i];
    }else{
      break;
    }
  }
  
  // 従業員の人数分シフト設定
  for (var i = 0; i < employees.length; i++) {
    var index = (i + 2);
    // 出勤・退勤時間
    var startTime = sheet.getRange("B" + index);
    var endTime = sheet.getRange("C" + index);
  
    // 塗りつぶす範囲を設定
    var range = sheet.getRange(setStartHour(startTime.getValue()) + index + ":" + setEndHour(endTime.getValue()) + index);
  
    // 背景色を変更
    range.setBackground("#FFFF00");
  }
}

/**
 * 従業員取得
 */
function getEmployee(){
  // スプレッドシートのアクティブなシートを取得
  var sheet = SpreadsheetApp.getActive().getSheetByName("2018_12");
  
  var employeeRange = sheet.getRange("A1:A50").getValues();

  var employees = new Array();
  var n = 0;

  for (var i = 0; i < employeeRange.length; i++) {
    if(i == (3*n + 9)){
      employees[n] = employeeRange[i];
      n++;
    }
  }
  return employees;
}

/**
 * 出勤時間を設定
 */
function setStartHour(time) {
  if(time == 8.0) { return "D"; }
  else if(time == 9.0) { return "E"; }
  else if(time == 10.0) { return "F"; }
  else if(time == 11.0) { return "G"; }
  else if(time == 12.0) { return "H"; }
  else if(time == 13.0) { return "I"; }
  else if(time == 14.0) { return "J"; }
  else if(time == 15.0) { return "K"; }
  else if(time == 16.0) { return "L"; }
  else if(time == 17.0) { return "M"; }
  else if(time == 18.0) { return "N"; }
  else if(time == 19.0) { return "O"; }
  else if(time == 20.0) { return "P"; }
  else if(time == 21.0) { return "Q"; }
  else if(time == 22.0) { return "R"; }
  else { 
    Logger.log("Error:出勤時間は8〜22時で入力してください");
  }
}

/**
 * 退勤時間を設定
 */
function setEndHour(time) {
  if(time == 8.0) { return "C"; }
  else if(time == 9.0) { return "D"; }
  else if(time == 10.0) { return "E"; }
  else if(time == 11.0) { return "F"; }
  else if(time == 12.0) { return "G"; }
  else if(time == 13.0) { return "H"; }
  else if(time == 14.0) { return "I"; }
  else if(time == 15.0) { return "J"; }
  else if(time == 16.0) { return "K"; }
  else if(time == 17.0) { return "L"; }
  else if(time == 18.0) { return "M"; }
  else if(time == 19.0) { return "N"; }
  else if(time == 20.0) { return "O"; }
  else if(time == 21.0) { return "P"; }
  else if(time == 22.0) { return "Q"; }
  else { 
    Logger.log("Error:退勤時間は8〜22時で入力してください"); 
  } 
}

/**
 * スプレッドシートにデータを書き込む
 */
function writeWorkData(name, workTimeData) {
//  var ui = SpreadsheetApp().getUi();
//  ui.alert("Hello World");
//  SpreadsheetApp.getUi().alert('Hello, world');

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("master");
  var employees = getEmployee();
  
  var rowIndex;
  
  for(var i = 0; i < employees.length; i++){
    if(name == employees[i]){
      rowIndex = i*3 + 10;
    }
  }
  i = 0;
  
  while(workTimeData[i] != null) {
    if(workTimeData[i] == "10-18"){
      sheet.getRange(rowIndex -1, i + 3).setValue("10");
      sheet.getRange(rowIndex, i + 3).setValue("18");
    }else if(workTimeData[i] == "10-15"){
      sheet.getRange(rowIndex - 1, i + 3).setValue("10");
      sheet.getRange(rowIndex, i + 3).setValue("15");
    }else if(workTimeData[i] == "10-16"){
      sheet.getRange(rowIndex - 1, i + 3).setValue("10");
      sheet.getRange(rowIndex, i + 3).setValue("16");
    }else if(workTimeData[i] == "absent"){
      // 入力内容を消去
      sheet.getRange(rowIndex - 1, i + 3).setValue("");
      sheet.getRange(rowIndex, i + 3).setValue("");
    }else{
      Logger.log("ラジオボタンの値が不正");
      return;
    }
    i++;
  }
}

/**
 * スプレッドシートに入力情報を保存
 */
function saveStatusToSpreadSheet(name, workTimeArray){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("saved_status");
  var date = new Date();
  var i = 1;
  var rowIndex;
  
  // 空白行を探す
  while(1){
    if(sheet.getRange(i, 1).getValue() == ""){
      rowIndex = i;
      break;
    }else{
      i++;
    }
  }
  // 名前入力
  sheet.getRange(rowIndex, 1).setValue(name);
  
  // 入力年月日・時刻を入力
  sheet.getRange(rowIndex, 2).setValue(getCurrentDate());  
  
  // ラジオボタンの状態を保存
  for(i = 0; i < workTimeArray.length; i++){
    sheet.getRange(rowIndex, i + 3).setValue(workTimeArray[i]);  
  }
}

/**
 * 現在年月日と時刻を取得
 */
function getCurrentDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var currentDate = year+"/"+ month + "/" + day +" " + hour + ":" + minute + ":" + second;
  return currentDate;
}

/**
 * スプレッドシートから保存状態を取ってくる
 */
function getSavedStatus(){
  var NAME_COLUMN = 1;
  var DATE_COLUMN = 2;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("saved_status");
  var name = [];
  var saveDate = [];
  var i = 0;
  while(sheet.getRange(i + 2, NAME_COLUMN).getValue() != ""){
    name[i] = sheet.getRange(i + 2, NAME_COLUMN).getValue();
    saveDate[i] = sheet.getRange(i + 2, DATE_COLUMN).getValue();
    i++;
  }
}