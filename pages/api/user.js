import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try{
  const client = await clientPromise;

  const db = client.db("designer");
  switch (req.method) {
    case "POST":
      console.log(req.body)
      let user = await db.collection("users").findOne({email:req.body.email});
      if(user) return res.status(409).json({success:false, message: 'A user is already registered with this mail!' });
      
      let newUser = await db.collection("users").insertOne(req.body);
      res.status(201).json({success:true, user: newUser });
      break;
    case "GET":
      const users = await db.collection("users").find({}).toArray();
      res.status(200).json({success:true,  users });
      break;
  }
}catch(e){

  res.json({ success: false, message:e.message })
}
}