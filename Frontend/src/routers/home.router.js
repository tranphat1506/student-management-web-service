const express = require('express');
const router = express.Router();
const path = require('path')
router.get('/',(req,res)=>{
    return res.redirect('/home')
})
router.get(['/home','/homepage'], (req,res)=>{
    return res.render('home')
})
router.post("/header",(req,res)=>{
    return res.render('header2')
})
module.exports = router;