import { PostFiltering } from '@/app/ui/components/PostFiltering';
import LikeIcon from '@/app/ui/svg/LikeIcon';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { BookOpenCheck, Ellipsis, Eye, MessageSquare, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Page(): JSX.Element {
  return (
    <>
      <main className="flex flex-col items-center gap-y-8 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="w-full gap-4 flex items-center">
            <PostFiltering />
            <div className="relative md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] border-slate-300 border-2"
                placeholder="article, utilisateur..."
                type="search"
              />
            </div>
          </div>
          <Button
            size="lg"
            variant="default"
            className="bg-transparent text-secondary-foreground border-2 border-primary rounded-3xl hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="mr-2" />
            Ecrire un article
          </Button>
        </div>
        <section className="w-full">
          <div className="h-44 p-4 shadow-lg">
            <div className="flex gap-6">
              <Image className="w-64 h-36 cursor-pointer" src="/kayak.jpg" width={600} height={500} alt="kayak" />
              <div className="h-full max-w-[624px]">
                <h2 className="truncate cursor-pointer hover:text-slate-400">
                  Pourquoi doit-on courir dans les escaliers ?
                </h2>
                <div className="flex items-center gap-6">
                  <p>
                    Par{' '}
                    <Link
                      href="simon"
                      className="font-medium text-accent underline underline-offset-2 max-w-32 truncate"
                    >
                      Simon Pang
                    </Link>
                    , <span>Mar 14 fevrier</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge className="w-16 flex items-center justify-center">course</Badge>
                    <Badge className="w-16 text-center items-center justify-center">santé</Badge>
                    <Badge className="w-16 text-center items-center justify-center">habitude</Badge>
                  </div>
                </div>
                <p className="font-extralight text-slate-950 leading-5 text-ellipsis overflow-hidden">
                  Courir dans les escaliers c’est cool parce que blabalab machin oui et aussi parce que je sais pas quoi
                  dire oui oui ok cool asoefijc a efcijsa cfjas fcoasijfc oaisjf coisjafc oiajsfoicjas ofcijas oficj
                  as...
                </p>
              </div>
              <div className="w-full flex flex-col justify-between">
                <div className="flex justify-end w-full">
                  <Link href="/">
                    <Ellipsis />
                  </Link>
                </div>
                <div className="w-full flex justify-end items-center gap-4">
                  <div className="flex items-center gap-1 font-medium text-sm">
                    <span>124</span>
                    <div>
                      <LikeIcon />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 font-medium text-sm">
                    <span>44</span>
                    <div>
                      <MessageSquare />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 font-medium text-sm">
                    <span>5325</span>
                    <div>
                      <BookOpenCheck />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
