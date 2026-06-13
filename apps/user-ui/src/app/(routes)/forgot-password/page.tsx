"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import GoogleButton from '../../../shared/widgets/header/components/google-button';

import {useForm} from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import {toast} from 'react-hot-toast';
type FormData={
    email: string;
    password: string;
};

 
const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState(["","","",""]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
 const inputRefs = useRef <(HTMLInputElement | null)[]>([]);
  const [canResend, setCanResend] = useState(false);

    const [serverError, setServerError] = useState<string | null>(null);

    const router = useRouter();
    const {register, handleSubmit, formState:{errors}} =  useForm<FormData>();
    //hàm bắt đầu đếm ngược thời gian để gửi lại OTP
    const startResendTimer=() =>{
      setCanResend(false);
      setTimer(60);
      const interval = setInterval(() =>{
        setTimer((prev) =>{
          if(prev <=1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev -1;
        });
      }, 1000);
    };
    const requestOtpMutation = useMutation({
      mutationFn: async({email}: {email: string}) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/request-password-user`,{email});
         return response.data;
      },
      onSuccess: (_, {email}) => {
        setUserEmail(email);
        setStep("otp");
        startResendTimer();
        setServerError(null);
        setCanResend(false);


      },
      onError: (error: AxiosError) => {
        const errorMessage = (error.response?.data as {message: string})?.message || "Đã có lỗi xảy ra(OTP). Vui lòng thử lại.";
        setServerError(errorMessage);
      }

    });
    const verifyOtpMutation = useMutation({
      mutationFn: async() =>{
        if(!userEmail) return;
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,{email:userEmail,otp:otp.join("")})
      return response.data;
      },
      onSuccess: () => {
        setStep("reset");
        setServerError(null);
      },
      onError: (error: AxiosError) => {
        const errorMessage = (error.response?.data as {message: string})?.message || "Đã có lỗi xảy ra(OTP). Vui lòng thử lại.";
        setServerError(errorMessage);
      }
     
      
    });
    const resetPasswordMutation = useMutation({
      mutationFn: async({password} : {password: string}) =>{
        if(!password) return;
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`, {email: userEmail, newPassword:password} );
        return response.data;
      },
      onSuccess: () => {
        setStep("email");
        toast.success("Đổi mật khẩu thành công!");
      
    
        setServerError(null);
        router.push("/login");
      }
    });
    //xử lý OTP
    const handleOtpChange = (index: number, value: string) => {
        // Cho phép giá trị rỗng "" (khi xóa) hoặc chỉ 1 chữ số từ 0-9
        if (value !== "" && !/^[0-9]$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        //tự động chuyển sang ô tiếp theo khi nhập
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const  handleOtpKeyDown = (index: number, e:React.KeyboardEvent<HTMLInputElement>) =>{
        if(e.key== "Backspace" && !otp[index] && index >0){
            inputRefs.current[index -1]?.focus();
        }
    };
    
    const onSubmitEmail = ({email} : {email: string}) =>{
      requestOtpMutation.mutate({email});
    }
    const onSubmitPassword = ({password} : {password: string}) =>{
      resetPasswordMutation.mutate({password});
    }






    return (
  <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
    <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
        Quên mật khẩu
    </h1>
    <p className="text-center text-lg font-medium py-3 text-black">
        Trang chủ . Quên mật khẩu
    </p>
    <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          {step === "email" && (
             <>
             <h3 className="text-3xl font-semibold text-center mb-2">
                Đăng nhập Eshop

            </h3>
            <p className="text-center text-gray-500 mb-4">
                Quay lại?{" "}
                <Link href={"/login"} className="text-blue-500">Đăng nhập</Link>




            </p>


            <form onSubmit={handleSubmit(onSubmitEmail)}>
                <label className="block text-gray-700 mb-1">
                    Email
                </label>
                <input type="email"
                placeholder="Nhập email của bạn"
                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                {...register("email",{
                    required: "Email không được để trống",
                    pattern:{
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "địa chỉ email không hợp lệ"
                        }
                    })
                }

                />
                {errors.email && (
                    <p className="text-red-500 text-sm">
                       {String(errors.email.message)}
                    </p>
                )}




                <button type="submit"
                className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg mt-4"
                  disabled={requestOtpMutation.isPending}
                 >
                  {requestOtpMutation.isPending ? "Đang gửi yêu cầu..." : "Xác nhận"}
                 </button>
                 {serverError && <p className="text-red-500 text-sm mt-2 text-center">{serverError}</p>}

            </form>

             </>
          )}
          {step === "otp" && (
            <div>
                                <h3 className="text-xl font-semibold text-center mb-4">
                                    Xác thực OTP
                                </h3>
                                <div className="flex justify-center items-center gap-6">
                                    {otp.map((digit, idx) =>(
                                        <input type="text" key={idx} ref={(el) =>{
                                            if(el) inputRefs.current[idx] = el;
                                        }}
                                        maxLength={1}
                                        className="w-12 h-12 text-center border border-gray-500 outline-none !rounded"
                                        value={digit}
                                        onChange = {(e) => handleOtpChange(idx, e.target.value)}
                                        onKeyDown = {(e) => handleOtpKeyDown(idx, e)}
            
                                        />
            
                                    ))}
            
            
                                </div>
                                <button type="submit"
                                className="w-full mt-6 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg"
                                disabled={verifyOtpMutation.isPending}
                                onClick={() => verifyOtpMutation.mutate()}
                                >
                                    {verifyOtpMutation.isPending ? "Đang xác thực OTP..." : "Xác thực OTP"}
            
                                </button>
                                <p className="text-center text-sm mt-4">
                                    {canResend ? (
                                        <button
                                        onClick={()=>requestOtpMutation.mutate({email : userEmail!})}
                                        className="text-blue-500 cursor-pointer underline">
                                            Gửi lại mã OTP
                                            </button>
                                    ) : (
                                        <button
                                        className="text-gray-500 cursor-pointer underline">
                                            Vui lòng chờ {timer} giây
                                            </button>
                                    )
                                    }
            
            
                                </p>
                                {serverError && <p className="text-red-500 text-sm mt-2 text-center">{serverError}</p>}
                               
                            </div>
            
          )}
          {step === "reset" && (
            <>
            <h3 className="text-center text-xl font-semibold mb-4">Thiết lập lại mật khẩu</h3>
            <form onSubmit={handleSubmit(onSubmitPassword)}>
              <label className= "block text-gray-700 mb-1">
                Mật khẩu mới
              </label>
             {/* tiếp tục ngày mai ở đây */}
              

            </form>
            
            </>
            
          )}
            
        </div>


    </div>

    </div>
  )
}

export default ForgotPassword;
