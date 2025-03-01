// This file is for reference only and should be deployed to Google Apps Script
// It is not used directly in the React application

/**
 * Google Apps Script to handle form submissions and store data in Google Sheets
 * Deploy this as a web app with "Execute as: Me" and "Who has access: Anyone"
 */

// The doGet function handles GET requests
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'The API is working!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// The doPost function handles POST requests
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.email) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Email is required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get the active spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Emails') || ss.insertSheet('Emails');
    
    // Check if headers exist, if not add them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Email', 'Timestamp', 'Date Added']);
    }
    
    // Format the timestamp for better readability
    const timestamp = data.timestamp || new Date().toISOString();
    const formattedDate = new Date().toLocaleString();
    
    // Append the data to the sheet
    sheet.appendRow([data.email, timestamp, formattedDate]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Email saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log the error and return an error response
    console.error('Error processing request:', error);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}