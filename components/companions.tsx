import { Companion } from "@prisma/client";
import Image from "next/image";
import { number } from "zod";
import { Card, CardFooter, CardHeader, CardContent } from "./ui/card"; // Подключаем CardContent
import Link from "next/link";
import { MessagesSquare } from "lucide-react";

interface CompanionProps {
    data: (Companion & {
        _count: {
            messages: number
        }
    })[];
}

export const Companions = ({
    data
}: CompanionProps) => {
   if (data.length === 0) {
    return (
        <div className="pt-10 flex flex-col items-center justify-center space-y-3">
           <div className="relative w-60 h-60">
               <Image 
               fill
               className="grayscale"
               alt="Empty"
               src="/empty.png"
               />
           </div>
           <p className="text-sm text-muted-foreground">
            Такого персонажа нет.. Попробуй создать!
           </p>
        </div>
    )
   }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 pb-10">
            {data.map((item) => (
                <Card
                 key={item.id}
                 className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
                >
                <Link href={`/chat/${item.id}`}>
                {/* Увеличиваем высоту изображения */}
                <div className="relative w-full h-40 overflow-hidden rounded-t-xl">
                    <Image 
                      src={item.src}
                      fill
                      className="object-cover"
                      alt="Companion"
                    />
                </div>
                {/* Добавляем больше места для содержимого */}
                <CardContent className="p-4 space-y-2">
                  <p className="font-medium text-center text-lg">
                    {item.name}
                  </p>
                  <p className="text-xs text-center text-muted-foreground">
                   {item.description}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between text-xs text-muted-foreground p-5">
                   <p className="lowercase">
                    @{item.userName}
                   </p>
                   <div className="flex items-center">
                     <MessagesSquare className="w-3 h-3 mr-2" />
                     {item._count.messages}
                   </div>
                </CardFooter>
                </Link>
                </Card>
            ))}
        </div>
    );
}
