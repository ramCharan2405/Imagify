import userModel from "../models/userModel";

export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;
        const user = await userModel.findById(userId)
        if (!user || !prompt) {
            return res.json({ sucess: false, message: 'Missing Details' })
        }
        if(user.creditBalance===0||userModel.creditBalance<0){
            return res.json({sucess:false,message:'No Credit Balance ',creditBalance:user.creditBalance})
        }
        
    } catch (error) {
        console.log(error.message)
        res.json({ sucess: false, message: error.message })
    }
}