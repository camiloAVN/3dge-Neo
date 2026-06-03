import { titleFont } from "@/config/fonts"
import Image from "next/image"
import Link from "next/link"


export const PageNotFound = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row w-full h-[500px] justify-center items-center">
        <div className="text-center text-gray-400 px-5 mx-5">
            <h2 className={`${titleFont.className} antialiased text-9xl`}>404</h2>
            <p className="font-semibold text-xl">Whoops! lo sentimos mucho</p>
            <p>
                <span>Puedes regresal al</span>
                <Link href="/" className="font-normal hover:underline transition-all ml-1.5 text-emerald-300">
                    Inicio
                </Link>
            </p>
        </div>
        <div className="px-5 mx-5">
            <Image
                src="/imgs/robot-404.png"
                alt="Robot"
                className="p-5 sm:p-0"
                width={550}
                height={550}
            />
        </div>
    </div>
  )
}
