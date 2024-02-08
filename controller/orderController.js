import order from "../model/order.js";


const addOrder=async(req,res)=>{
    try{
        const { user, items, totalPrice } = req.body;
        const addOrder=await order.create({user,items,totalPrice});
        return res.json(addOrder);

    }catch(err){
        console.log(err.message);
    }
}

const editOrder=async(req,res)=>{
    
}

const getOrderWithProductDetails=async(req,res)=>{
    try{
        const orderDetails=await order.findById(req.params.id).populate('items.product').exec();

        return res.json(orderDetails);
    }catch(err){
        console.log(err.message)
    }
}

export {addOrder,getOrderWithProductDetails}