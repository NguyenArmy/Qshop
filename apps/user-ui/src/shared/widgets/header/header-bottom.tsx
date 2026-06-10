'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlignLeft, ChevronDown } from 'lucide-react';
import ProfileIcon from '../../../assets/svgs/profile-icon';
import HeartIcon from '../../../assets/svgs/heart-icon';
import CartIcon from '../../../assets/svgs/cart-icon';
import { navItems } from '../../../configs/constants';

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`w-full transition-all duration-300 ${isSticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg" : "relative"}`}>
      <div className={`w-[80%] relative m-auto flex items-center justify-between ${isSticky ? 'pt-3' : "py-0"}`}>

        {/* All dropdowns */}
        <div 
          className={`w-[260px] ${isSticky && '-mb-2'} cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#4273FF]`}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="white" />
            <span className="text-white font-medium">All Departments</span>
          </div>
          <ChevronDown color="white"/>
        </div>

        {/* Dropdown menu */}
        {show && (
          <div className={`absolute left-0 ${isSticky ? "top-[70px]" : "top-[50px]"} w-[260px] h-[400px] bg-[#f5f5f5]`}>
            {/* Dropdown items go here */}
          </div>
        )}

        {/* navigation links */}
        <div className="flex items-center">
          {navItems.map((i: NavItemsTypes, index: number) => (
            <Link 
              className="px-5 font-medium text-lg"
              href={i.href}
              key={index}
            >
              {i.title}
            </Link>
          ))}
        </div>

        {/* User profile & action links when Sticky, or a placeholder to keep navigation links centered */}
        {isSticky ? (
          <div className="flex items-center gap-8 w-[260px] justify-end">
            <div className="flex items-center gap-2">
              <Link 
                href={"/login"}
                className="border-2 w-[50px] flex items-center justify-center rounded-full border-gray-300 h-[50px]"
              >
                <ProfileIcon />
              </Link>
              <Link href={"/login"}>
                <span className="block font-medium">Xin chào,</span>
                <span className="font-semibold">Đăng nhập</span>
              </Link>
            </div>

            <div className="flex items-center gap-5">
              <Link href={"/wishlist"} className="relative inline-flex">
                <HeartIcon/>
                <div className='w-6 h-6 border-2 border-white bg-red-400 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]'>
                  <span className="text-white font-medium text-sm">0</span>
                </div>
              </Link>
              <Link href={"/cart"} className="relative inline-flex">
                <CartIcon/>
                <div className='w-6 h-6 border-2 border-white bg-red-400 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]'>
                  <span className="text-white font-medium text-sm">10+</span>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-[260px]" />
        )}

      </div>
    </div>
  );
}

export default HeaderBottom;