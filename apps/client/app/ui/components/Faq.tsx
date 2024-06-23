import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/components/ui/accordion';
import { Card, CardContent } from '@repo/ui/components/ui/card';

export default function FAQ() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="shadow-lg w-[550px]">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold">Questions fréquentes</h2>
          <Accordion className="w-full mt-4" type="multiple">
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:underline-none">
                Je suis débutant sur la plus part des sports, puis-je m'inscrire ?
              </AccordionTrigger>
              <AccordionContent>
                Oui, bien sûr ! Athlonix est une association multisport qui souhaite promouvoir le sport pour tous. Peu
                importe votre niveau, vous êtes le bienvenu.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="hover:underline-none">
                Comment puis-je devenir membre de l'association ?
              </AccordionTrigger>
              <AccordionContent>
                Pour devenir membre, il vous suffit de remplir le formulaire d'inscription disponible sur notre site
                web. Une fois votre demande validée, vous pourrez accéder à l'ensemble de nos activités.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="hover:underline-none">
                Comment puis-je m'inscrire à une activité ?
              </AccordionTrigger>
              <AccordionContent>
                Une fois membre de l'association, vous pouvez vous inscrire à une activité directement depuis notre site
                web. Il vous suffit de vous connecter à votre compte et de choisir l'activité qui vous intéresse.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="hover:underline-none">
                Je ne suis pas membre, puis-je participer à une activité ?
              </AccordionTrigger>
              <AccordionContent>
                Oui, certaines de nos activités sont ouvertes au public. Vous pouvez consulter notre calendrier pour
                connaître les événements ouverts à tous.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="hover:underline-none">
                Comment puis-je contacter le support ?
              </AccordionTrigger>
              <AccordionContent>
                Vous pouvez contacter notre support par email à l'adresse suivante : <br />
                <a href="mailto:athlonix@gmail.com" className="text-blue-600">
                  athlonix@gmail.com
                </a>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
