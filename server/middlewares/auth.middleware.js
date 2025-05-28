var jwt = require('jsonwebtoken');

const authMiddleware=(req,res,next)=>{
     let token=req.headers.authorization.split(" ")[1]
     if(!token){
        res.status(401).json({msg:"token not found please login again"})
     }else{
        var decoded=jwt.verify(token,'shhhhh')
       console.log("decoded",decoded)

       if(decoded){
        req.user=decoded.userId
        next()
       }else{
        res.status(401).json({msg:"Login failed please try again later"})
       }
     }
}
module.exports=authMiddleware