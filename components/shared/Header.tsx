import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <h1 className=" text-3xl" >AIR NEWS</h1>
        <div className="flex  w-32  justify-end gap-3">
        <SignedIn>
            <UserButton afterSignOutUrl="/" />
           
          </SignedIn> 
      <SignedOut>
        <Button asChild className="rounded-full " size="lg">
        <Link href="/sign-in"> 
        Login
        </Link>
        </Button>
      </SignedOut>
      </div>
        
      </div>
        
    </header>
  );
};

export default Header;
