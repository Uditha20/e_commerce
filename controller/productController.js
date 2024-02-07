import product from "../model/productModel.js";

const addProduct=async(req,res)=>{
    try{
        const productAdd=await product.create(req.body)
        return res.json(productAdd);
    }catch(err){
        console.log(err.message);
    }
}

export {addProduct};