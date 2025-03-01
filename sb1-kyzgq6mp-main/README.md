# UI Feedback Generator

A simple tool that generates UI feedback suggestions for designers to practice and improve their skills.

## Features

- Random UI feedback generation
- Email collection with Google Sheets integration
- Copy to clipboard functionality
- Responsive design

## Google Sheets Integration Setup

This application uses Google Apps Script to store collected emails in a Google Sheet. To set up this integration:

1. Create a new Google Sheet
2. Go to Extensions > Apps Script
3. Replace the code in the script editor with the contents of `public/google-apps-script.js`
4. Save the project with a name like "UI Feedback Email Collection"
5. Deploy the script as a web app:
   - Click "Deploy" > "New deployment"
   - Select type: "Web app"
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - Copy the web app URL
6. Update the fetch URL in `src/App.tsx` with your deployed script URL

## Security Considerations

- The Google Apps Script handles data validation server-side
- Emails are stored securely in your Google Sheet
- The sheet is only accessible to you as the owner
- No sensitive data is exposed in the client-side code

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```