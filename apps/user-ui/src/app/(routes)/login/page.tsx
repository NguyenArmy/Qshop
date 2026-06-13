"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import GoogleButton from '../../../shared/widgets/header/components/google-button';

import {useForm} from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
type FormData={
    email: string;
    password: string;
};



const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
    const {register, handleSubmit, formState:{errors}} =  useForm<FormData>();

      const loginMutation = useMutation({
        mutationFn: async (data: FormData) => {
           const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-user`,data, {withCredentials: true} );
           return response.data;
        },
        onSuccess:(data) =>{
          setServerError(null);
          router.push("/");
        },
        onError:(error: AxiosError) =>{
          const errorMessage=(error.response?.data as {message: string}) ?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
          setServerError(errorMessage);
        }
      });

    ;
    const onSubmit = (data: FormData) =>{
      loginMutation.mutate(data);
    };


    return (
  <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
    <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
        Đăng nhập
    </h1>
    <p className="text-center text-lg font-medium py-3 text-black">
        Trang chủ . Đăng nhập
    </p>
    <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
            <h3 className="text-3xl font-semibold text-center mb-2">
                Đăng nhập Eshop

            </h3>
            <p className="text-center text-gray-500 mb-4">
                Chưa có tài khoản?{" "}
                <Link href={"/signup"} className="text-blue-500">Đăng kí</Link>




            </p>
            <GoogleButton/>
            <div className="flex items-center my-5 text-gray-500 text-sm">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3">hoặc Đăng nhập với Email</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label className="block text-gray-700 mb-1">
                    Email
                </label>
                <input type="email"
                placeholder="anhquan109380@gmail.com"
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
                <div className="flex justify-between items-center my-3">
                  <label className="flex items-center text-gray-600">
                    <input type="checkbox" className="mr-2" checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    />
                    Ghi nhớ đăng nhập
                  </label>
                  <Link href={"/forgot-password"} className="text-blue-500 text-sm font-medium">
                    Quên mật khẩu?
                  </Link>
                </div>
                <button type="submit"
                className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
                  disabled={loginMutation.isPending}
                 >
                  {loginMutation?.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                 </button>
                 {serverError && <p className="text-red-500 text-sm mt-2 text-center">{serverError}</p>}

            </form>


        </div>


    </div>

    </div>
  )
}

export default Login
