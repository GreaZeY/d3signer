import clientPromise from "../../lib/mongodb";
import { ObjectId } from 'mongodb'

const collection = 'designs';

export default async function handler(req, res) {



    try {
        const client = await clientPromise;

        const db = client.db("designer");
        switch (req.method) {
            case "POST":
                let newDesign = await db.collection(collection).insertOne(req.body);
                {
                    const designs = await db.collection(collection).find({}).toArray();
                    if (newDesign.acknowledged) return res.status(201).json({ success: true, design: req.body, designs:designs });
                }
                throw new Error('An Error Occurred!')

            case "GET":
                const designs = await db.collection(collection).find({}).toArray();
                res.status(200).json({ success: true, designs });
                break;

            case "DELETE":
                console.log(req.query, req.body)
                let design = await db.collection(collection).deleteOne({ _id: ObjectId(req.query.id) });
                if (design.deletedCount !== 0) {
                    const designs = await db.collection(collection).find({}).toArray();
                    res.status(200).json({ success: true, designs });
                    return
                }
                throw new Error("Couldn't find your design!")
        }
    } catch (e) {

        res.json({ success: false, message: e.message })
    }
}