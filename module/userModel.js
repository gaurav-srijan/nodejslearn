const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name :{
        type  : String,
        required : [true, "Enter Name"]
    },
    email: {
        type: String,
        required : [true, "Enter email"],
        unique : true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },    

      role:{
        type : String,
        enum :[ "User", "Publisher"],
        default : "User",
      }
      ,
      password :{
        type  : String,
        required : [true, "Enter Password"],
        minlength : 6,
        select : false
    },
    resetPassworkToken : String,
    resetPassworkExpire : Date,
    createAt:{
        type : Date , 
        default : Date.now
    }


})

//bcrypt paaword
userSchema.pre('save' , async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});
//token genrate
userSchema.methods.getSignedJwtToken = function(){
    return jsonwebtoken.sign({id : this._id} , "dcdcdcdcfuvnu" , {
        expiresIn : 10000
    })

}
//match password
userSchema.methods.verifyPassword = function(enterpassword){
    return bcrypt.compare(enterpassword , this.password)
    }      

    //assign resetPassworkToken
    userSchema.methods.resetToken= function(){
            const refresh = crypto.randomBytes(20).toString('hex');
            console.log("refresh" , refresh)
            //hast token to rest refresh field
            this.resetPassworkToken = crypto.createHash('sha256').update(refresh).digest('hex');

    //expire token
    this.resetPassworkExpire = Date.now() + 10 * 60 * 1000;
    return refresh;

    } 
module.exports = mongoose.model('user' ,userSchema )

