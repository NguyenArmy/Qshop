"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import GoogleButton from '../../../shared/widgets/header/components/google-button';

import {useForm} from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios ,{AxiosError} from 'axios';
type FormData={
    name: string;
    email: string;
    password: string;
};



const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showOtp, setShowOtp] = useState(false);
    const[canResend, setCanResend] = useState(true);
   const [timer, setTimer] = useState(60);
   const[otp, setOtp]= useState(["", "", "", ""])
   const [userData, setUserData] = useState<FormData | null>(null);
   const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const router = useRouter();
    const {register, handleSubmit, formState:{errors}} =  useForm<FormData>();
    const startResendTimer =() =>{
        const interval = setInterval(() =>{
           setTimer((prev) =>{
            if(prev <= 1){
                clearInterval(interval);
                setCanResend(true);
                return 0;
            }
            return prev -1;
           }) 

        },1000);
    }
    
    const signupMutation = useMutation({
        mutationFn: async(data: FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`, data);
           return response.data; 
        },
        onSuccess:(_, formData) =>{
            setUserData(formData);
            setShowOtp(true);
            setCanResend(false);
            setTimer(60);
          startResendTimer();
        },
        
    })
    const onSubmit = (data: FormData) =>{

    };
    //xử lý logic mã otp tự chuyển sang ô tiếp theo khi nhập
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
}
const resendOtp=() =>{

}


    

    
            
    

 
    return (
  <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
    <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
        Đăng kí
    </h1>
    <p className="text-center text-lg font-medium py-3 text-black">
        Trang chủ . Đăng kí
    </p>
    <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
            <h3 className="text-3xl font-semibold text-center mb-2">
                Đăng kí Eshop

            </h3>
            <p className="text-center text-gray-500 mb-4">
                Đã có tài khoản?{" "}
                <Link href={"/login"} className="text-blue-500">Đăng nhập</Link>




            </p>
            <GoogleButton/>
            <div className="flex items-center my-5 text-gray-500 text-sm">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3">hoặc Đăng nhập với Email</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>
            {!showOtp ?(
                <form onSubmit={handleSubmit(onSubmit)}>
                <label className="block text-gray-700 mb-1">
                    Tên đăng nhập
                </label>
                <input type="text"
                placeholder="nhập tên đăng nhập"
                className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                {...register("name",{
                    required: "Tên đăng nhập không được để trống",
                    
                })}
                
                />
                {errors.name && (
                    <p className="text-red-500 text-sm">
                       {String(errors.name.message)}
                    </p>
                )}
                 <label className="block text-gray-700 mb-1">
                    Email
                </label>
                <input type="email"
                placeholder="nhập email"
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
                <label className="block text-gray-700 mb-1">Mật khẩu</label>
                <div className="relative flex items-center">
                  <input type={passwordVisible ? "text" : "password"}
                    placeholder="tối thiểu 6 kí tự"
                    className="w-full p-2 pr-10 border border-gray-300 outline-0 !rounded mb-1"
                    {...register("password",{
                        required: "Mật khẩu không được để trống",
                        minLength:{
                                value: 6,
                              message: "Mật khẩu phải có ít nhất 6 kí tự"
                            }
                        })
                    } 
                    />
                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-3 flex items-center text-gray-500"
                        style={{ height: '38px' }}
                        >
                        {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                       {String(errors.password.message)}
                    </p>
                )}
                
                <button type="submit" 
                className="w-full text-lg cursor-pointer mt-4 bg-black text-white py-2 rounded-lg"
                 >Đăng Kí</button>
                 {serverError && <p className="text-red-500 text-sm mt-2 text-center">{serverError}</p>}
             
            </form>

            ) : (
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
                    className="w-full mt-6 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg">
                        Xác Nhận OTP

                    </button>
                    <p className="text-center text-sm mt-4">
                        {canResend ? (
                            <button
                            onClick={resendOtp}
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
                </div>

            )}

            
          

        </div>


    </div>
   
    </div>
  )
}

export default Signup;
