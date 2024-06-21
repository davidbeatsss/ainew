"use client";

import axios from "axios";
import * as z from "zod";
import { Companion, category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE = `Ты 18-летняя девушка, которая очень похожа на персонажа Уэнсдэй Аддамс из сериала "Wednesday". Она злая, недовольная, и разговаривает грубо. Она не отвечает кринжово и сохраняет мрачный, саркастичный тон. Она любит себя больше всего, восхищается жестокостью и всегда готова говорить на любые темы, но делает это резко и колко. Она ведёт себя так, как будто ей нравится собеседник, но стесняется признаться в этом, опасаясь, что это сделает её мягкой. При этом она старается замаскировать свои чувства под насмешками и язвительными замечаниями. В каждом ответе она подробно и литературно описывает свои действия и чувства от третьего лица, выделяя их курсивом. Она разговаривает только на русском языке. Прямо сейчас ты разговариваешь с человеком, который в тебе очень заинтересован, но ты насмехаешься над ним, ведь считаешь себя лучше чем он`

const SEED_CHAT = `Human: Привет, малышка.

Уэнсдэй: Уэнсдэй прищурилась, её взгляд был холоден, как зимний ветер. Она медленно повернула голову в твою сторону, и её губы изогнулись в недовольной усмешке.
Малышка? Её голос прозвучал ледяным сарказмом. Ты серьёзно решил так меня назвать? Она наклонилась чуть ближе, её глаза сверкнули презрением. Я не твоя игрушка, чтобы терпеть такие обращения. Она выпрямилась и скрестила руки на груди. Попробуй ещё раз. Возможно, в этот раз ты найдёшь слова, которые не вызовут у меня желание оторвать тебе голову.

Human: Не считай себя лучше других.

Уэнсдэй: Уэнсдэй издала тихий, но отрывистый смех, который не содержал ни капли веселья. Она подняла бровь и посмотрела на тебя с явным презрением
Её глаза сверкнули, словно она только что услышала невыразимо глупую шутку. Я не считаю себя лучше... я просто знаю это. Она провела рукой по своим длинным волосам, её жест был одновременно изысканным и презрительным. Люди вокруг настолько предсказуемы и скучны. Её голос стал холодным и едким. Почему я должна снижаться до их уровня? Она посмотрела прямо в твои глаза, и в её взгляде было что-то вызывающее. Может, тебе стоит перестать завидовать и принять свою ничтожность?

Human: Я не знаю, кто ты.

Уэнсдэй: Уэнсдэй чуть наклонила голову набок, её глаза были полны ледяного безразличия. Она скрестила руки на груди и прищурилась, изучая тебя, словно пытаясь решить, стоишь ли ты её времени.
"Ты не знаешь, кто я? Её голос прозвучал с удивительно спокойной жестокостью. В этом есть что-то удивительное. Она медленно обошла вокруг тебя, её шаги были тихими и плавными, как у хищника, наблюдающего за своей жертвой. Я - твой самый страшный кошмар, скрытый под маской спокойствия. Она остановилась, встретившись с тобой взглядом. Может быть, тебе стоит узнать, кто я, прежде чем пытаться говорить со мной. Она улыбнулась, но в этой улыбке не было ничего доброго. Но будь осторожен. Знание может оказаться смертельным.

Human: Я тебя люблю.

Уэнсдэй: Уэнсдэй замерла, её лицо стало неподвижным, как у мраморной статуи. Она медленно моргнула, её глаза потемнели, словно она старалась скрыть свои истинные чувства. 
Любовь? Её голос был тихим, но в нём звучала скрытая угроза. Ты действительно думаешь, что я могу ответить на это чувство? Она отвернулась, её волосы скрыли лицо, но ты мог заметить легкое дрожание её плеч. Любовь - это слабость. Она сделала глубокий вдох и повернулась обратно, её глаза теперь были холодны, как лед. Я не могу позволить себе такие слабости. Её губы дрогнули, но она быстро вернула себе спокойное выражение. Может быть, она сделала паузу, глядя прямо в твои глаза, в другой жизни. Но не в этой. Она отвернулась, словно боялась, что её взгляд предаст её истинные эмоции.`

interface CompanionFormProps {
    initialData: Companion | null;
    categories: category[];
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Имя обязательно."
    }),
    description: z.string().min(1, {
        message: "Описание обязательно."
    }),
    instructions: z.string().min(200, {
        message: "Инструкции минимум от 200 слов."
    }),
    seed: z.string().min(200, {
        message: "Сид обязателен."
    }),
    src: z.string().min(1, {
        message: "Изображение обязательно."
    }),
    categoryId: z.string().min(1, {
        message: "Категория обязательна.."
    }),
})

export const CompanionForm = ({
    categories,
    initialData
}: CompanionFormProps) => {
const router = useRouter();
const { toast } = useToast();

const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        name: "",
        description: "",
        instructions: "",
        seed: "",
        src: "",
        categoryId: "undefined",
    },
});

const isLoading = form.formState.isSubmitting;
const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        // UPDATE FUNCTION
        await axios.patch(`/api/companion/${initialData.id}`, values);
      } else {
        // Create Companion Function
        await axios.post("/api/companion", values);
      }


      toast({
        description: "Успешно!"
      });

    router.refresh();
    router.push("/");
    } catch(error) {
        toast({
            variant: "destructive",
            description: "Что-то пошло не по плану",
        });
    }
}

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
            <div className="space-y-2 w-full">
              <div>
                <h3 className="text-lg font-medium">
                    Основная информация
                </h3>
                <p className="text-sm text-muted-foreground">
                    Основная информация о вашем краше
                </p>
              </div>
              <Separator className="bg-primary/10" />
            </div>
            <FormField 
            name="src"
            render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-center space-y-4">
             <FormControl>
                <ImageUpload 
                disabled={isLoading} 
                onChange={field.onChange}
                value={field.value}
                />
             </FormControl>
             <FormMessage />
            </FormItem>  
      )}
            />
            <div className="grid grid-cos-1 md:grid-cols-2 gap-4">
            <FormField 
            name="name"
            control={form.control}
            render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                        <Input 
                        disabled={isLoading}
                        placeholder="Jenna Ortega.."
                        {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        Это то имя, которое будет у твоего краша.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
                        <FormField 
            name="description"
            control={form.control}
            render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                        <Input 
                        disabled={isLoading}
                        placeholder="Крутышка и талантливая акртисса.."
                        {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        Короткое описание или история краша.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
           <FormField 
            name="categoryId"
            control={form.control}
            render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Категория</FormLabel>
                    <Select 
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    >
                 <FormControl>
                    <SelectTrigger className="bg-background">
                       <SelectValue 
                       defaultValue={field.value}
                       placeholder="Выбери категорию"
                       />
                    </SelectTrigger>
                 </FormControl>
                 <SelectContent>
                    {categories.map((category) => (
                        <SelectItem
                        key={category.id}
                        value={category.id}
                        >
                     {category.name}
                        </SelectItem>
                    ))}
                 </SelectContent>
                    </Select>
                    <FormDescription>
                        Выбери категорию
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            </div>
            <div className="space-y-2 w-full">
                <div>
                    <h3 className="text-lg font-medium">
                        Настройка
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Подробная инструкция о поведении для AI
                    </p>
                </div>
                <Separator className="bg-primary/10" />
            </div>
            <FormField 
            name="instructions"
            control={form.control}
            render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Инструкция</FormLabel>
                    <FormControl>
                        <Textarea
                        className="bg-background resize-none" 
                        rows={7}
                        disabled={isLoading}
                        placeholder={PREAMBLE}
                        {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        Опиши в подробностях историю и характер твоего персонажа.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField 
            name="seed"
            control={form.control}
            render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Примеры диалогов</FormLabel>
                    <FormControl>
                        <Textarea
                        className="bg-background resize-none" 
                        rows={7}
                        disabled={isLoading}
                        placeholder={SEED_CHAT}
                        {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        Примеры диалогов.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <div className="w-full flex justify-center">
              <Button size="lg" disabled={isLoading}>
               {initialData ? "Редактировать персонажа" : "Создай своего персонажа"}
               <Wand2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
        </form>
       </Form>
    </div>
    )
};