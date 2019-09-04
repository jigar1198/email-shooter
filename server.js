const express = require('express');
const app = express();
const path = require('path');
const csv = require('csv');
const parse = require('csv-parse');
const bodyParser = require('body-parser');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const mailHelper = require('./helpers/mailer');
const handlebars = require('handlebars');
const csvRecords = [];
let eventRegistrations = [];
let failedRecords = [];
const emailColIndexInCSV = 2;   
const nameColIndexInCSV = 1;  
const outCSVFile = path.join(__dirname, './files/error.csv');
const emailTemplate = 'registration-email.html';    
const senderEmailAddress = 'admin@mydomain.com';
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(fileUpload());


app.post('/send', urlencodedParser, function (req, res) {
  
  const emailVars = {
      name: req.body.organisationName,
      subject: req.body.subject,
      mailBody: req.body.body,
      organisation: req.body.organisationName,
      organisationEmail: req.body.email
  }

  const emailSubject = `${emailVars.name} - ${emailVars.subject}`;

  //CSV File
  let csvFileEmail = req.files.csvFileEmail;
  const csvFileEmailLocation = './files/' + csvFileEmail.name;
  csvFileEmail.mv(csvFileEmailLocation, function(err2) {
    if (err2)
      return res.status(500).send(err2);
      console.log('CSV file uploaded!');
  });


  // Attachment 
  let attachment = req.files.attachment;
  const attachmentLocation = './attachments/' + attachment.name;
  attachment.mv(attachmentLocation, function(err) {
    if (err)
      return res.status(500).send(err);
      console.log('Attachment uploaded!');
  });

  const sourceCSVFile = path.join(__dirname, csvFileEmailLocation);  

  const startExecution = async () => {
    await readCSVFile()
    await sendEmailsToTargetUsers(); 
    console.log('--- EMAILS SENT ---');
  }

  const readCSVFile = () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(sourceCSVFile)
            .pipe(parse({delimiter: ','}))
            .on('data', (csvRow) => {
                csvRecords.push(csvRow);        
            })
            .on('end', () => {
                resolve();
            });
    });
  }

  const writeCSVFile = (records) => {
    return new Promise((resolve, reject) => {
        try {
            csv.stringify(records, { header: true }, (err, output) => {
                if (err) throw err;
                fs.writeFile(outCSVFile, output, (err) => {
                  if (err) throw err;
                  console.log('csv file saved.');
                  resolve();
                });
            });
        } catch (ex) {
            console.log(ex);
            reject(ex);
        }
    });
  }

  const sendEmailsToTargetUsers = async () => {
    eventRegistrations = csvRecords;
    failedRecords = [csvRecords[0]]; //add header for failed records csv
    eventRegistrations.splice(0, 1);
    // uncomment the below chunk and put your email & name for testing
    // eventRegistrations = [{
    //     name: "Test User",
    //     email: 'test@test.com'
    // }];
    return new Promise(async (resolve, reject) => {
      try{
          const rawHtml = await mailHelper.readHTMLTemplate(__dirname + "/templates/" + emailTemplate);
          const template = handlebars.compile(rawHtml);
          for (let i = 0, len = eventRegistrations.length; i < len; ++i) {
              const registration = eventRegistrations[i];
              const replacements = {
                  userName: registration[nameColIndexInCSV],
                  companyName: emailVars.name,
                  mailBody: emailVars.mailBody,
                  organisation: emailVars.organisation,
                  organisationEmail: emailVars.organisationEmail
              };
  
              const htmlToSend = template(replacements);
              const mailOptions = {
                  from: senderEmailAddress,
                  to: registration[emailColIndexInCSV],
                  subject: emailSubject,
                  html: htmlToSend,
                  attachments: {  
                      filename: attachment.name,
                      path: attachmentLocation
                  }
              };

              let emailResponse = await mailHelper.sendMail(mailOptions);
              if (!emailResponse) {
                  failedRecords.push(eventRegistrations[i]);
              }
          }

          if(failedRecords.length > 1) {
              await writeCSVFile(failedRecords);
          }

          resolve();
      } catch (ex) {
          console.log(ex);
          reject(ex)
      }
        
    });
  }

  startExecution();
  res.send('Sending Emails - Check console for status..');


})


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})