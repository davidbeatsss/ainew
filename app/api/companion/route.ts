import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { companionId: string } }
) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = body;

        // Проверяем наличие пользователя и username вместо firstName
        if (!user || !user.id || !user.username) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Проверяем наличие всех необходимых полей в запросе
        if (!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Создаем companion в базе данных используя Prisma
        const companion = await prismadb.companion.create({
            data: {
                categoryId,
                userId: user.id,
                userName: user.username, // Здесь используем user.username вместо user.firstName
                src,
                name,
                description,
                instructions,
                seed
            }
        });

        // Возвращаем успешный ответ с созданным companion
        return NextResponse.json(companion);
    } catch (error) {
        console.error("[COMPANION_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}