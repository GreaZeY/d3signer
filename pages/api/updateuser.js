import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try{
  const client = await clientPromise;

  const db = client.db("designer");
  switch (req.method) {
    case "PUT":
      console.log(req.body)
      let updatedUser = await db.collection("users").updateOne({"email":req.body.userData.email},{
          $set:req.body.userData
      },
      {
       
    });
      res.status(201).json({success:true, data: updatedUser,message:'Profile Updated Sucessfully' });
      break;
 
  }
}catch(e){

  res.json({ success: false, message:e.message })
}
}