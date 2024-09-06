import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import userModel from "@/model/User";

export async function POST(request:Request){
    await dbConnect();
    try{
        const{Username,email,password}=await request.json();
        const existingUserVerifiedbyUsername = await userModel.findOne({ Username, isVerified: true });

        if(existingUserVerifiedbyUsername){
            return Response.json({
                success:false,
                message:"Username is Already Taken"
            },
            {
                status:400
            }
            );  
        }
        const existingUserbyEmail= await userModel.findOne({email})
        const verifyCode=Math.floor(100000+Math.random()*900000).toString();
        if(existingUserbyEmail){
            if(existingUserbyEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User Already Exists"
                },
                {
                    status:400
                }
                );
            }
            else{
                const hashedPwd = await bcrypt.hash(password,10)
                existingUserbyEmail.password=hashedPwd;
                existingUserbyEmail.verifyCode=verifyCode;
                existingUserbyEmail.verifyCodeExpire= new Date(Date.now()+3600000)
                await existingUserbyEmail.save();
            }
        }
        else{
            const hashedPwd = await bcrypt.hash(password,10)
            const ExpiryDate = new Date()
            ExpiryDate.setMinutes(ExpiryDate.getHours()+1)

            const user = new userModel({
                Username,
                password: hashedPwd,
                email,
                verifyCode,
                verifyCodeExpire:ExpiryDate,
                isAcceptingMessages:true,
                isVerified :false,
                messages:[]
            })
            await user.save();
        }

        const emailResponse = await sendVerificationEmail(email,Username,verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },
            {
                status:500
            }
            );
        }
        return Response.json({
            success:true,
            message:'User registered successfully Verify Email to login'
        },
        {
            status:201
        }
        );
    }
    catch(err){
        console.log("Error registering user",err)
        return Response.json({
            success:false,
            message:"Error registering user"
        },
        {
            status:500
        }
        );
    }
}