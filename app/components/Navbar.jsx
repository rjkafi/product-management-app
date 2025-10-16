import Link from "next/link";
import { FaRegUser } from "react-icons/fa";


const Navbar = () => {
    return (
        <>
            <div className="navbar  shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center w-full">
                        <div className="navbar-start">                    
                            <a href="">
                              Product Manager
                            </a>
                        </div>
                        <div className="navbar-end ">                       
                            {/* Profile Icon */}
                            <Link href="/profile">
                                <FaRegUser className="text-xl md:text-2xl lg:text-3xl" />
                            </Link>
                        </div>

                    </div>

                </div>

            </div>

        </>
    );
};

export default Navbar;