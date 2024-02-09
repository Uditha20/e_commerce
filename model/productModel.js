import mongoose  from "mongoose";

const products=new mongoose.Schema({
    productname:{
        type:String,
        required:[true,"please enter product name"]
    },
    price:{
        type:Number,
        required:[true,"please enter the price"]
    },
    item_count:{
        type:Number,
        required:[true,"how many items are add?"]
    },
    color:{
        type:String,
    },
    size:{
        type:String,
    },
    type:{
        type:String,
        required:[true,"enter the product category"]
    }
//  need to add the image field

})

const Product=mongoose.model('product',products);
export default Product;