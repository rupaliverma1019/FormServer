const express = require("express");

const { default: mongoose } = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 4040;
app.use(express.json())
app.use(cors());

//Connection for database
mongoose.connect("mongodb://127.0.0.1:27017/crudoperation")
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err.message))

//create table
const schemaData = mongoose.Schema({
    name: String,
    mobile: String,
    designation: String,
    address: String,
    email: String,





}, {
    timestamps: true
})

const userModel = mongoose.model("user", schemaData)



//for read data
//http://localhost:4040/
app.get('/', async(req, res) => {
    try {
        const data = await userModel.find({});
        res.json({ success: true, data: data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//for create data
//http://localhost:4040/create

app.post("/create", async(req, res) => {
    try {
        console.log("Attempting to save data...");

        const { name, mobile, ...rest } = req.body;

        // Validate name length
        if (name.length < 3) {
            return res.status(400).json({ success: false, message: "Name should be at least 3 characters long" });
        }

        // // Validate mobile number length (assuming it's a string)
        // if (mobile.length !== 10) {
        //     return res.status(400).json({ success: false, message: "Phone number should be exactly 10 characters long" });
        // }

        const data = new userModel({ name, mobile, ...rest });
        await data.save();
        res.json(req.body);
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// update data
//http://localhost:4040/update
app.put("/update", async(req, res) => {
    console.log("data update successfully");
    const { _id, ...rest } = req.body;

    try {
        const updatedUser = await userModel.findByIdAndUpdate(_id, rest, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// api for delete
//http://localhost:4040/delete/id
app.delete("/delete/:id", async(req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await userModel.findByIdAndRemove(userId);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});




app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});