const errorFunction=(error , req,res,next)=>{
res.status(error.statusCode || 500).json({
    "status" : "fail",
    "error" : error.message || "server error",
})
}

module.exports = errorFunction;