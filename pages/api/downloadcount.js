import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    try {
        const client = await clientPromise;

        const db = client.db("designer");
        switch (req.method) {
            case "POST":
                let downloads = await db.collection("downloads").insertOne(req.body);
                res.status(201).json({ success: true, downloads });
                break;
            case "GET":
                const downs = await db.collection("downloads").find({}).toArray();
                res.status(200).json({ success: true, downloads: downs});
                break;
        }
    } catch (e) {

        res.json({ success: false, message: e.message })
    }
}