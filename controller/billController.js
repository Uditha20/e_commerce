import bill from "../model/billModel.js";

const addBill=async(req,res)=>{
    try{
        const billDetails=await bill.create(req.body);
        return res.json(billDetails)

    }catch(err){
        console.log(err.message)
    }
}

export {addBill};