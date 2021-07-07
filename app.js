const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://admin:admin@cluster0.6n6fm.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
const itemsSchema=new mongoose.Schema({
  name:{
    type:String,
    require:[true,"Name not specified cannot add empty item ⚠⚠⚠"]
  }
});
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
  name:"Welcome to your todo list"
});
const item2=new Item({
  name:"Hit the + button to add more items"
});
const item3=new Item({
  name:"<-- Hit this to delete an item"
});
const defaultItems=[item1,item2,item3];
// Item.insertMany(defaultItems,function(err){
//   if(err) throw err;
//   else{
//     console.log("Successfully added the items");
//   }
// });
app.get("/", function(req, res) {
  Item.find({},function(err,foundItems){
    if(err) throw err;
    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err) throw err;
        else{
          console.log("Successfully added the items");
        }
      });
      res.redirect("/");
    }
    else{
      const day = date.getDate();
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
  });
});
app.post("/", function(req, res){
  const itemName=req.body.newItem;
  const newItem=new Item({
    name:itemName
  });
  newItem.save();
  res.redirect("/");
});
app.post("/delete",function(req,res){
  const toDelete=req.body.checkbox;
  Item.findByIdAndRemove(toDelete,function(err){
    if(err) throw err;
    else{
      console.log("Item deleted successfully");
      res.redirect("/");
    };
  });
});
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
