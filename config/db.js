const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

const connect=()=>{
  const url = process.env.DBCONNECTION
mongoose.set('strictQuery', true)
mongoose.connect(url, {
   
useNewUrlParser: true, 
useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connection established.'))
.catch((error) => console.error("MongoDB connection failed:", error.message))
}
module.exports = connect;