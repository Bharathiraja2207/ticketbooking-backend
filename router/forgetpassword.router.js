import express from "express";
import nodemailer from 'nodemailer'
import { client } from '../index.js';
import { genhashpassword } from "./login.router.js";
const router = express.Router()


router.post('/reset-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Check if user exists
      const user = await client
      .db("bookmyshowpass")
      .collection("bookmyshowpass")
      .findOne({email:email });
      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }
  
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Save OTP to database
      const users = await client
      .db("bookmyshowpass")
      .collection("bookmyshowpass")
      .updateOne( {email: email}, { $set: { otp:otp} })

      // Send OTP to user's email
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
        subject: 'Reset Password',
        text: `Your OTP is ${otp}`
      };
  
      await transporter.sendMail(mailOptions);
  
      // Create JWT token
    //   const token = abcdefgh
  
      res.json({ message: 'OTP sent successfully'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  

  router.post('/update-password', async (req, res) => {
    const { email, otp, password } = req.body;
  
    try {
      // Verify OTP
      const user =  await client
      .db("bookmyshowpass")
      .collection("bookmyshowpass")
      .findOne({email:email })
      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }
  
      if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Hash password
      // Update password and OTP
      const hashpassword = await genhashpassword(password)
      const users = await client
      .db("bookmyshowpass")
      .collection("bookmyshowpass")
      .updateOne({email: email}, { $set: { password:hashpassword,otp:''} })
  
      res.json({ message: 'Password updated successfully' });
    }  catch (error) {
              console.log(error);
              return res.status(500).send('Internal Server Error');
            }
          });
  
  



export default router