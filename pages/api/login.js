import clientPromise from "../../lib/mongodb";

export default async function handler(req, res, next) {
  try{
  const client = await clientPromise;
  const db = client.db("designer");
  switch (req.method) {
    case "POST":
      
      let User = await db.collection("users").findOne({email:req.body.email})
      
      if(!User) return res.status(404).json({ success: false, message: 'No user found with this mail!' });
 
        if(User.password===req.body.password){
          delete User['password']
            res.status(201).json({ success: true, user: User });
        }else{
            res.status(401).json({ success: false, message: 'Invalid Email or Password!' });
        }
      
      break;
  }
}catch(e){
  res.json({ success: false, message:e.message })
}
}