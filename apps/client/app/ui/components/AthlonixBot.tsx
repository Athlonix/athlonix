'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import type { Params } from 'react-chatbotify';

const ChatBot = lazy(() => import('react-chatbotify'));

const AthlonixBot = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const mainOptions = ['Informations sur les sports', 'Adhésion', 'Événements à venir', 'Nous contacter', 'FAQ'];
  const flow = {
    start: {
      message: "Bienvenue sur le chatbot de l'Association Multisport ! Comment puis-je vous aider aujourd'hui ?",
      transition: { duration: 1000 },
      path: 'show_options',
    },
    show_options: {
      message: "Veuillez choisir l'une des options suivantes :",
      options: mainOptions,
      path: 'process_options',
    },
    prompt_again: {
      message: 'Y a-t-il autre chose que je puisse faire pour vous ?',
      options: mainOptions,
      path: 'process_options',
    },
    unknown_input: {
      message: "Je suis désolé, je n'ai pas compris. Pourriez-vous choisir l'une des options suivantes ?",
      options: mainOptions,
      path: 'process_options',
    },
    process_options: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: Params) => {
        switch (params.userInput) {
          case 'Informations sur les sports':
            await params.injectMessage(
              'Nous proposons divers sports comme le football, le basketball, la natation et le tennis. Sur quel sport souhaitez-vous en savoir plus ?',
            );
            return 'sports_info';
          case 'Adhésion':
            await params.injectMessage(
              "Nos options d'adhésion comprennent des formules individuelles, familiales et entreprises. Souhaitez-vous plus de détails sur les tarifs et les avantages ?",
            );
            return 'membership_info';
          case 'Événements à venir':
            await params.injectMessage(
              "Nous avons plusieurs événements à venir, dont une course caritative et un tournoi de tennis. Je peux vous fournir plus d'informations si vous êtes intéressé.",
            );
            return 'events_info';
          case 'Nous contacter':
            await params.injectMessage(
              'Vous pouvez nous joindre à info@associationmultisport.com ou nous appeler au 01 23 45 67 89. Nos heures de bureau sont du lundi au vendredi, de 9h à 17h.',
            );
            return 'repeat';
          case 'FAQ':
            await params.injectMessage('Voici quelques questions fréquemment posées. Veuillez en choisir une :');
            return 'show_faq';
          default:
            return 'unknown_input';
        }
      },
    },
    sports_info: {
      message: 'Sur quel sport souhaitez-vous des informations ?',
      options: ['Football', 'Basketball', 'Natation', 'Tennis'],
      path: 'provide_sport_info',
    },
    provide_sport_info: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: Params) => {
        let info = '';
        switch (params.userInput) {
          case 'Football':
            info =
              "Nous proposons des ligues de football pour tous les âges et niveaux. Les séances d'entraînement ont lieu les mardis et jeudis.";
            break;
          case 'Basketball':
            info =
              'Notre programme de basketball comprend des ligues récréatives et compétitives. Nous avons aussi des créneaux de gym ouverte les week-ends.';
            break;
          case 'Natation':
            info =
              "Nous disposons d'une piscine olympique et proposons des cours de natation, des créneaux de nage libre et des équipes de natation compétitive.";
            break;
          case 'Tennis':
            info =
              'Nos installations de tennis comprennent des courts intérieurs et extérieurs. Nous proposons des leçons, des tournois et des opportunités de jeu social.';
            break;
        }
        await params.injectMessage(info);
        return 'repeat';
      },
    },
    membership_info: {
      message:
        "Nos options d'adhésion sont les suivantes :\n1. Individuelle : 50€/mois\n2. Famille : 100€/mois\n3. Entreprise : Tarifs personnalisés\nToutes les adhésions incluent l'accès aux installations et des réductions sur les cours et événements.",
      path: 'repeat',
    },
    events_info: {
      message:
        "Événements à venir :\n1. Course caritative annuelle - 15 juillet\n2. Tournoi de tennis d'été - 5-7 août\n3. Journée familiale - 3 septembre\nSouhaitez-vous vous inscrire à l'un de ces événements ?",
      options: ['Oui', 'Non'],
      path: 'event_registration',
    },
    event_registration: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: Params) => {
        if (params.userInput === 'Oui') {
          await params.injectMessage(
            'Excellent ! Veuillez visiter notre site web à www.associationmultisport.com/evenements pour vous inscrire.',
          );
        } else {
          await params.injectMessage(
            "Pas de problème. Faites-moi savoir si vous avez besoin d'autres informations sur nos événements.",
          );
        }
        return 'repeat';
      },
    },
    show_faq: {
      message: 'Choisissez une question :',
      options: [
        'Quels sont vos horaires ?',
        "Proposez-vous un service de garde d'enfants ?",
        'Puis-je amener des invités ?',
      ],
      path: 'answer_faq',
    },
    answer_faq: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: Params) => {
        let answer = '';
        switch (params.userInput) {
          case 'Quels sont vos horaires ?':
            answer = 'Nos installations sont ouvertes de 6h à 22h, sept jours sur sept.';
            break;
          case "Proposez-vous un service de garde d'enfants ?":
            answer =
              "Oui, nous proposons des services de garde d'enfants pour les membres pendant les heures de pointe.";
            break;
          case 'Puis-je amener des invités ?':
            answer = "Les membres peuvent amener jusqu'à 2 invités par visite moyennant des frais modiques.";
            break;
        }
        await params.injectMessage(answer);
        return 'repeat';
      },
    },
    repeat: {
      transition: { duration: 3000 },
      path: 'prompt_again',
    },
  };
  return (
    <>
      {isLoaded && (
        <Suspense fallback={<div>Loading...</div>}>
          <ChatBot
            options={{
              botBubble: {
                avatar:
                  'https://www.francetvinfo.fr/pictures/KI83JKIWxYVA8ng-cUtYxM6l-z8/1200x1200/2016/08/23/shrek-5.jpg',
                showAvatar: true,
              },
              header: {
                avatar:
                  'https://www.francetvinfo.fr/pictures/KI83JKIWxYVA8ng-cUtYxM6l-z8/1200x1200/2016/08/23/shrek-5.jpg',
                title: 'Shrek le sportif',
              },
              chatButton: {
                icon: 'https://www.francetvinfo.fr/pictures/KI83JKIWxYVA8ng-cUtYxM6l-z8/1200x1200/2016/08/23/shrek-5.jpg',
              },
              theme: {},
              tooltip: { text: "Besoin d'aide ?" },
              chatHistory: { storageKey: 'example_faq_bot' },
            }}
            flow={flow}
          />
        </Suspense>
      )}
    </>
  );
};

export default AthlonixBot;
