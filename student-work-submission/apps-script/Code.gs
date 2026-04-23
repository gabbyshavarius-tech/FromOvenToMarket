const SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    var data = JSON.parse(e.postData.contents);
    var no = sheet.getLastRow();

    sheet.appendRow([
      no,
      data.nama   || "",
      data.kelas  || "",
      data.judul  || "",
      data.link   || "",
      data.deskripsi || "",
      new Date()
    ]);

    var output = ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

    return output;

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Submit via GET params: ?action=submit&nama=...
  if (e.parameter.action === "submit") {
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      var no = sheet.getLastRow();

      sheet.appendRow([
        no,
        e.parameter.nama      || "",
        e.parameter.kelas     || "",
        e.parameter.judul     || "",
        e.parameter.link      || "",
        e.parameter.deskripsi || "",
        new Date()
      ]);

      return ContentService
        .createTextOutput(JSON.stringify({ status: "success" }))
        .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Galeri: ?action=getAll
  if (e.parameter.action === "getAll") {
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      var rows = sheet.getDataRange().getValues();
      var data = [];

      for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        data.push({
          no:        row[0],
          nama:      row[1],
          kelas:     row[2],
          judul:     row[3],
          link:      row[4],
          deskripsi: row[5],
          tanggal:   row[6] ? Utilities.formatDate(new Date(row[6]), Session.getScriptTimeZone(), "dd MMM yyyy") : ""
        });
      }

      data.reverse();

      return ContentService
        .createTextOutput(JSON.stringify({ status: "success", data: data }))
        .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
