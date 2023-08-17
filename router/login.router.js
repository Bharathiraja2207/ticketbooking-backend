import express from "express";
import {client} from '../index.js';
import bcrypt from "bcryptjs";
import { getuserbyname, hashpass } from "./createuser.service.js";
import  Jwt  from "jsonwebtoken";
const router=express.Router()



export async function genhashpassword(password){
    const no_of_rounds=10;
    const salt=await bcrypt.genSalt(no_of_rounds)
    const hashpassword=await bcrypt.hash(password,salt)
    // console.log(salt);
    // console.log(hashpassword);
    return hashpassword;
  }



// sign in
router.post("/signup",async function (request, response) {
    const {email,firstname,lastname,username,password}=request.body;
    const userfromdb=await getuserbyname(username)
    if(userfromdb){
        response.status(400).send({message:"user name already exist"})
    }
    else if(password.length<8){
        response.status(400).send({message:"password must be atleast 8 char"})
    }
    else{
        const hashpassword=await genhashpassword(password)
    // db.userid.insertmany(data)
         const result= await hashpass(email,firstname,lastname,username, hashpassword)
        response.send(result);
    }
   
  });




//   login
router.post("/login",async function (request, response) {
    const {username,password}=request.body;
    const userfromdb=await getuserbyname(username)
    console.log(userfromdb);
    if(!userfromdb){
        response.status(400).send({message:"invalid credential"})
    }
    else{
        const storedpassword=userfromdb.password;
        const ispasswordcheck=await bcrypt.compare(password,storedpassword)
        console.log(ispasswordcheck);
        if(ispasswordcheck){
            const token=Jwt.sign({id:userfromdb._id},process.env.SECREAT_KEY)
            response.send({message:"login successful",token:token})
        }
        else{
            response.status(400).send({message:"invalid credential"})
        }
    }
  });

  export default router;

