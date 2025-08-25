const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:{ 
    type: String, 
    required: true
},
  email:{ 
    type: String, 
    required: true, 
    unique: true 
},
  password:{
    type: String, 
    required: true 
},
  profileImage:{ 
    type: String 
},
  isVerified:{ 
    type: Boolean, 
    default: false 
},
  verificationCode:{ 
    type: String }});

module.exports = mongoose.model("User", userSchema);
