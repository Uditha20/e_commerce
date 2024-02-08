import mongoose  from "mongoose";

const products=new mongoose.Schema({
    productname:{
        type:String,
        require:[true,"please enter product name"]
    },
    price:{
        type:Number,
        require:[true,"please enter the price"]
    },
    item_count:{
        type:Number,
        require:[true,"how many items are add?"]
    },
    color:{
        type:String,
    },
    size:{
        type:String,
    },
    type:{
        type:String,
        require:[true,"enter the product category"]
    }
//  need to add the image field

})

const Product=mongoose.model('product',products);
export default Product;