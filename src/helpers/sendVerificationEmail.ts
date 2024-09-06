import {resend} from '@/lib/resend';
import  VerificationEmail  from '../../emails/verificationEmails';
import { ApiResponse } from '@/types/apiResponse';

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({
                username,otp:verifyCode
            }),
        });
        return {success:true,message:"Verification email sent"};
}
    catch(err){
        console.log("Error sending verification email",err);
        return {success:false,message:"Error sending verification email"};
    }
}