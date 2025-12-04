const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const EmployeeSchema = new mongoose.Schema({
name:String,
email:String,
role:String
});
const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);


router.get('/', async (req,res)=>{
const all = await Employee.find().limit(50);
res.json(all);
});


router.post('/', async (req,res)=>{
const e = new Employee(req.body);
await e.save();
res.json(e);
});


module.exports = router;
