import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">


   <div>
      <Link href={"/"}>
      <span className="text-3xl font-[500]">QShop</span>
      </Link>
     
        </div>
         <div className="w-[50%] relative">
          <input type="text" placeholder="tìm kiếm sản phẩm..." 
          className="w-full px-4 font-Poppins font-medium border-[2.5px] border-[#3489FF] outline-none h-[55px]"
          />


      </div>



    </div>
       </div>


    
  )
}

export default Header