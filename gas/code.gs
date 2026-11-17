/** @OnlyCurrentDoc */
// このスプレッドシートの1枚目のシートを読んで、JSON で返す
// A1：カードの見出し　A2 から下：1行ずつの中身
// （GAS のエディタに、このファイルの中身を貼って使う）
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const values = sheet
    .getRange('A1:A20')
    .getDisplayValues()
    .map(function (row) { return row[0]; })
    .filter(function (text) { return text !== ''; });

  const result = {
    title: values[0] || 'メモ',
    items: values.slice(1),
  };

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
