
import express from "express"; // "type": "module"
import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import moviesidRouter from './router/moviesid.router.js';
// import useridRouter from './router/userid.router.js'; //we can change name
import signinRouter from './router/login.router.js';
import forgetRouter from './router/forgetpassword.router.js';
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from 'nodemailer'
import QRCode from 'qrcode'
// import cors from "cors";

// import bcrypt   from ' bcrypt'
dotenv.config()
const app = express();

// console.log(process.env.mongo_url)

const PORT = process.env.PORT;
// const mongo_url = 'mongodb://127.0.0.1';
const mongo_url =(process.env.mongo_url)
export const client = new MongoClient(mongo_url);
await client.connect();
  console.log('mongo is connected!!');

 app.use(cors ())
 app.use(bodyParser.json());
 app.use(express.json())

  
app.get("/", function (request, response) {
  response.send(" this is get page🙋‍♂️, 🌏 🎊✨🤩");
});

         
//post TICKRT
app.post("/ticket",async function (request, response) {
  const data=request.body;
  console.log(data);
   const result= await client
      .db("b42mongo")
     .collection("vikram2")
      .insertMany(data)
  response.send(result);
});


  app.post('/all/update-items',async (req, res) => {
    // Get the item names to update from the request body
    const {itemNames,email} = req.body
    console.log(itemNames)
    console.log(email)
    try{
      
   const book= await client
   .db("b42mongo")
   .collection("bookticket")
   .updateMany( { name: { $in: itemNames }}, {  $set: { status: 'done' } }) 
      if (!itemNames) {
        console.log('Error updating items:');
        res.status(500).send('Error updating items');
        return;
      }
      
      console.log('Updated items:',itemNames);
      
      const imagePath = 'data:image/png;base64,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';   
      const qrData = itemNames;  // Replace with your desired data
      const qrCodeImage = await QRCode.toDataURL(qrData);
    

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'ticket booked',
        text: `seat number ${itemNames}...`,
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeImage.split(';base64,').pop(),  // Remove the data URI prefix
            encoding: 'base64'
          },
          // {
          //   filename: 'image.png',
          //   path: imagePath  // Path to the image you want to embed in the QR code
          // }
        ]
      };
      await transporter.sendMail(mailOptions);
  //  res.json({ message: 'OTP sent successfully'});
  res.status(200).send('Items updated successfullyyyy');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
      // client.close();
    });


    // rrr
    
  app.post('/all/rrr1/update-items',async (req, res) => {
    // Get the item names to update from the request body
    const {itemNames,email} = req.body
    console.log(itemNames)
    console.log(email)
    try{
      
   const book= await client
   .db("b42mongo")
   .collection("rrr1")
   .updateMany( { name: { $in: itemNames }}, {  $set: { status: 'done' } }) 
      if (!itemNames) {
        console.log('Error updating items:');
        res.status(500).send('Error updating items');
        return;
      }
      
      console.log('Updated items:',itemNames);
      
      const imagePath = 'data:image/png;base64,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';   
      const qrData = itemNames;  // Replace with your desired data
      const qrCodeImage = await QRCode.toDataURL(qrData);
    

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'ticket booked',
        text: `seat number ${itemNames}...TIME:9:00pm`,
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeImage.split(';base64,').pop(),  // Remove the data URI prefix
            encoding: 'base64'
          },
          // {
          //   filename: 'image.png',
          //   path: imagePath  // Path to the image you want to embed in the QR code
          // }
        ]
      };
      await transporter.sendMail(mailOptions);
  //  res.json({ message: 'OTP sent successfully'});
  res.status(200).send('Items updated successfullyyyy');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
      // client.close();
    });

    // rrr2
    
  app.post('/all/rrr2/update-items',async (req, res) => {
    // Get the item names to update from the request body
    const {itemNames,email} = req.body
    console.log(itemNames)
    console.log(email)
    try{
      
   const book= await client
   .db("b42mongo")
   .collection("rrr2")
   .updateMany( { name: { $in: itemNames }}, {  $set: { status: 'done' } }) 
      if (!itemNames) {
        console.log('Error updating items:');
        res.status(500).send('Error updating items');
        return;
      }
      
      console.log('Updated items:',itemNames);
      
      const imagePath = 'data:image/png;base64,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';   
      const qrData = itemNames;  // Replace with your desired data
      const qrCodeImage = await QRCode.toDataURL(qrData);
    

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'ticket booked',
        text: `seat number ${itemNames}...Movie:RRR TIME:9:00pm`,
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeImage.split(';base64,').pop(),  // Remove the data URI prefix
            encoding: 'base64'
          },
          // {
          //   filename: 'image.png',
          //   path: imagePath  // Path to the image you want to embed in the QR code
          // }
        ]
      };
      await transporter.sendMail(mailOptions);
  //  res.json({ message: 'OTP sent successfully'});
  res.status(200).send('Items updated successfullyyyy');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
      // client.close();
    });

    // vikram1
    
  app.post('/all/vikram1/update-items',async (req, res) => {
    // Get the item names to update from the request body
    const {itemNames,email} = req.body
    console.log(itemNames)
    console.log(email)
    try{
      
   const book= await client
   .db("b42mongo")
   .collection("vikram1")
   .updateMany( { name: { $in: itemNames }}, {  $set: { status: 'done' } }) 
      if (!itemNames) {
        console.log('Error updating items:');
        res.status(500).send('Error updating items');
        return;
      }
      
      console.log('Updated items:',itemNames);
      
      const imagePath = 'data:image/png;base64,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';   
      const qrData = itemNames;  // Replace with your desired data
      const qrCodeImage = await QRCode.toDataURL(qrData);
    

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'ticket booked',
        text: `seat number ${itemNames}...Movie:vikram TIME:9:00am`,
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeImage.split(';base64,').pop(),  // Remove the data URI prefix
            encoding: 'base64'
          },
          // {
          //   filename: 'image.png',
          //   path: imagePath  // Path to the image you want to embed in the QR code
          // }
        ]
      };
      await transporter.sendMail(mailOptions);
  //  res.json({ message: 'OTP sent successfully'});
  res.status(200).send('Items updated successfullyyyy');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
      // client.close();
    });

    // vikram2
    
  app.post('/all/update-items',async (req, res) => {
    // Get the item names to update from the request body
    const {itemNames,email} = req.body
    console.log(itemNames)
    console.log(email)
    try{
      
   const book= await client
   .db("b42mongo")
   .collection("vikram2")
   .updateMany( { name: { $in: itemNames }}, {  $set: { status: 'done' } }) 
      if (!itemNames) {
        console.log('Error updating items:');
        res.status(500).send('Error updating items');
        return;
      }
      
      console.log('Updated items:',itemNames);
      
      const imagePath = 'data:image/png;base64,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';   
      const qrData = itemNames;  // Replace with your desired data
      const qrCodeImage = await QRCode.toDataURL(qrData);
    

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'ticket booked',
        text: `seat number ${itemNames}...Movie:vikram TIME:9:00pm`,
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeImage.split(';base64,').pop(),  // Remove the data URI prefix
            encoding: 'base64'
          },
          // {
          //   filename: 'image.png',
          //   path: imagePath  // Path to the image you want to embed in the QR code
          // }
        ]
      };
      await transporter.sendMail(mailOptions);
  //  res.json({ message: 'OTP sent successfully'});
  res.status(200).send('Items updated successfullyyyy');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
      // client.close();
    });

  
    app.get("/all/allticket",async function (request, response) {
      const room_booking= await client
      .db("b42mongo")
   .collection("bookticket")
      .find({})
      .toArray();
        response.send(room_booking);
        });

        // rrr
        app.get("/all/rrr1/allticket",async function (request, response) {
          const room_booking= await client
          .db("b42mongo")
       .collection("rrr1")
          .find({})
          .toArray();
            response.send(room_booking);
            });

            app.get("/all/rrr2/allticket",async function (request, response) {
              const room_booking= await client
              .db("b42mongo")
           .collection("rrr2")
              .find({})
              .toArray();
                response.send(room_booking);
                });
  // vikram
  app.get("/all/vikram1/allticket",async function (request, response) {
    const room_booking= await client
    .db("b42mongo")
 .collection("vikram1")
    .find({})
    .toArray();
      response.send(room_booking);
      });
      app.get("/all/vikram2/allticket",async function (request, response) {
        const room_booking= await client
        .db("b42mongo")
     .collection("vikram2")
        .find({})
        .toArray();
          response.send(room_booking);
          });
  


app.use("/users",signinRouter);
app.use("/moviesid",moviesidRouter);
app.use("/",forgetRouter);
// app.use("/userid",useridRouter);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

