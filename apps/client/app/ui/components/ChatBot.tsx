import ChatBot from 'react-chatbotify';
import type { Params } from 'react-chatbotify';

import React from 'react';

const AthlonixBot = () => {
  const optionsPrincipales = ['Informations sur les sports', 'Adhésion', 'Événements à venir', 'Nous contacter', 'FAQ'];
  const sports = ['Football', 'Basketball', 'Natation', 'Tennis', 'Athlétisme'];
  const flow = {
    debut: {
      message:
        "Bonjour et bienvenue sur le chatbot de l'Association Multisport ! Comment puis-je vous aider aujourd'hui ?",
      transition: { duration: 1000 },
      path: 'montrer_options',
    },
    montrer_options: {
      message: "Veuillez choisir l'une des options suivantes :",
      options: optionsPrincipales,
      path: 'traiter_options',
    },
    demander_encore: {
      message: 'Y a-t-il autre chose que je puisse faire pour vous ?',
      options: optionsPrincipales,
      path: 'traiter_options',
    },
    entree_inconnue: {
      message: "Désolé, je n'ai pas compris votre demande. Pourriez-vous choisir parmi les options suivantes ?",
      options: optionsPrincipales,
      path: 'traiter_options',
    },
    traiter_options: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: Params) => {
        switch (params.userInput) {
          case 'Informations sur les sports':
            await params.injectMessage('Nous proposons divers sports. Lequel vous intéresse ?');
            return 'infos_sports';
          case 'Adhésion':
            await params.injectMessage("Nous avons plusieurs formules d'adhésion. Quelle catégorie vous intéresse ?");
            return 'infos_adhesion';
          case 'Événements à venir':
            await params.injectMessage(
              "Nous avons plusieurs événements prévus. Quel type d'événement vous intéresse ?",
            );
            return 'infos_evenements';
          case 'Nous contacter':
            await params.injectMessage(
              'Vous pouvez nous joindre par email à info@associationmultisport.fr ou par téléphone au 01 23 45 67 89. Nos bureaux sont ouverts du lundi au vendredi, de 9h à 18h.',
            );
            return 'repeter';
          case 'FAQ':
            await params.injectMessage('Voici quelques questions fréquemment posées. Laquelle vous intéresse ?');
            return 'montrer_faq';
          default:
            return 'entree_inconnue';
        }
      },
    },
    infos_sports: {
      message: 'Sur quel sport souhaitez-vous des informations ?',
      options: sports,
      path: 'fournir_infos_sport',
    },
    fournir_infos_sport: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: Params) => {
        let info = '';
        switch (params.userInput) {
          case 'Football':
            info =
              'Nous proposons du football pour tous les âges et niveaux. Les entraînements ont lieu les mardis et jeudis. Voulez-vous plus de détails sur un aspect particulier ?';
            return 'details_football';
          case 'Basketball':
            info =
              'Notre programme de basketball comprend des ligues récréatives et compétitives. Nous avons aussi des créneaux de jeu libre le week-end. Que voulez-vous savoir de plus ?';
            return 'details_basketball';
          case 'Natation':
            info =
              "Nous disposons d'une piscine olympique et proposons des cours de natation, des créneaux de nage libre, et des équipes de compétition. Quel aspect vous intéresse ?";
            return 'details_natation';
          case 'Tennis':
            info =
              'Nos installations de tennis comprennent des courts intérieurs et extérieurs. Nous proposons des leçons, des tournois et des opportunités de jeu social. Que souhaitez-vous savoir ?';
            return 'details_tennis';
          case 'Athlétisme':
            info =
              'Notre section athlétisme couvre toutes les disciplines, du sprint au fond, en passant par les lancers et les sauts. Quelle discipline vous intéresse particulièrement ?';
            return 'details_athletisme';
        }
        await params.injectMessage(info);
        return 'repeter';
      },
    },
    details_football: {
      message: 'Que voulez-vous savoir sur notre programme de football ?',
      options: ["Horaires d'entraînement", "Catégories d'âge", 'Équipement nécessaire', 'Coût'],
      path: 'repondre_details_football',
    },
    repondre_details_football: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: Params) => {
        let reponse = '';
        switch (params.userInput) {
          case "Horaires d'entraînement":
            reponse =
              'Les entraînements ont lieu les mardis et jeudis, de 18h à 20h pour les adultes, et de 17h à 18h30 pour les jeunes.';
            break;
          case "Catégories d'âge":
            reponse = 'Nous avons des équipes pour les U8, U10, U12, U14, U16, U18 et seniors (hommes et femmes).';
            break;
          case 'Équipement nécessaire':
            reponse =
              'Il vous faut des chaussures de foot à crampons, des protège-tibias, des shorts et un maillot. Nous fournissons les ballons.';
            break;
          case 'Coût':
            reponse =
              "L'adhésion annuelle pour le football est de 200€ pour les adultes et 150€ pour les jeunes, comprenant l'assurance et la licence.";
            break;
        }
        await params.injectMessage(reponse);
        return 'demander_encore_football';
      },
    },
    demander_encore_football: {
      message: "Voulez-vous d'autres informations sur le football ?",
      options: ['Oui', 'Non'],
      path: (params: Params) => (params.userInput === 'Oui' ? 'details_football' : 'repeter'),
    },
    // Ajoutez des sections similaires pour les autres sports

    infos_adhesion: {
      message: "Quelle formule d'adhésion vous intéresse ?",
      options: ['Individuelle', 'Famille', 'Entreprise', 'Étudiant'],
      path: 'fournir_infos_adhesion',
    },
    fournir_infos_adhesion: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: Params) => {
        let info = '';
        switch (params.userInput) {
          case 'Individuelle':
            info =
              "L'adhésion individuelle coûte 50€/mois et donne accès à toutes nos installations et à des réductions sur les cours et événements. Voulez-vous plus de détails ?";
            return 'details_adhesion_individuelle';
          case 'Famille':
            info =
              "L'adhésion famille coûte 100€/mois pour jusqu'à 4 membres de la même famille. Elle inclut l'accès à toutes les installations et des réductions sur les activités pour enfants. Souhaitez-vous en savoir plus ?";
            return 'details_adhesion_famille';
          case 'Entreprise':
            info =
              'Nous proposons des formules sur mesure pour les entreprises. Cela peut inclure des créneaux réservés, des cours collectifs, etc. Voulez-vous être contacté par notre service commercial ?';
            return 'contact_adhesion_entreprise';
          case 'Étudiant':
            info =
              "L'adhésion étudiant est à 30€/mois sur présentation d'une carte étudiante valide. Elle donne accès à toutes nos installations. Avez-vous des questions ?";
            return 'details_adhesion_etudiant';
        }
        await params.injectMessage(info);
        return 'repeter';
      },
    },
    // Ajoutez des sections pour les détails de chaque type d'adhésion

    infos_evenements: {
      message: 'Voici nos prochains événements. Lequel vous intéresse ?',
      options: ['Course caritative', 'Tournoi de tennis', 'Journée portes ouvertes', 'Stage multisports enfants'],
      path: 'fournir_infos_evenement',
    },
    fournir_infos_evenement: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: Params) => {
        let info = '';
        switch (params.userInput) {
          case 'Course caritative':
            info =
              "Notre course caritative annuelle aura lieu le 15 juillet. Les fonds récoltés iront à l'association 'Sport pour Tous'. Voulez-vous des détails sur l'inscription ?";
            return 'details_course_caritative';
          case 'Tournoi de tennis':
            info =
              "Le tournoi de tennis d'été se déroulera du 5 au 7 août. Il est ouvert à tous les niveaux. Souhaitez-vous connaître les catégories ou les tarifs ?";
            return 'details_tournoi_tennis';
          case 'Journée portes ouvertes':
            info =
              'Notre journée portes ouvertes aura lieu le 3 septembre. Vous pourrez essayer gratuitement tous nos sports. Voulez-vous le programme détaillé ?';
            return 'details_portes_ouvertes';
          case 'Stage multisports enfants':
            info =
              'Nous organisons un stage multisports pour les enfants de 6 à 12 ans pendant les vacances scolaires. Voulez-vous connaître les dates et tarifs ?';
            return 'details_stage_enfants';
        }
        await params.injectMessage(info);
        return 'repeter';
      },
    },
    // Ajoutez des sections pour les détails de chaque événement

    montrer_faq: {
      message: 'Choisissez une question :',
      options: [
        'Quels sont vos horaires ?',
        'Proposez-vous une garderie ?',
        'Puis-je inviter des amis ?',
        'Comment annuler mon abonnement ?',
      ],
      path: 'repondre_faq',
    },
    repondre_faq: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params: Params) => {
        let reponse = '';
        switch (params.userInput) {
          case 'Quels sont vos horaires ?':
            reponse =
              'Nos installations sont ouvertes de 6h à 22h, sept jours sur sept. Certaines activités ont des horaires spécifiques, consultables sur notre site web.';
            break;
          case 'Proposez-vous une garderie ?':
            reponse =
              'Oui, nous offrons un service de garderie pour les enfants de 3 à 10 ans, du lundi au vendredi de 17h à 20h, et le samedi de 9h à 12h. Le tarif est de 5€ par heure.';
            break;
          case 'Puis-je inviter des amis ?':
            reponse =
              "Les membres peuvent inviter jusqu'à 2 amis par visite pour une somme modique de 10€ par invité. Chaque invité peut venir jusqu'à 3 fois par an.";
            break;
          case 'Comment annuler mon abonnement ?':
            reponse =
              "Pour annuler votre abonnement, vous devez nous envoyer un email à resiliation@associationmultisport.fr ou vous présenter à l'accueil. Un préavis d'un mois est requis.";
            break;
        }
        await params.injectMessage(reponse);
        return 'demander_autre_question';
      },
    },
    demander_autre_question: {
      message: 'Avez-vous une autre question ?',
      options: ['Oui', 'Non'],
      path: (params: Params) => (params.userInput === 'Oui' ? 'montrer_faq' : 'repeter'),
    },
    repeter: {
      transition: { duration: 3000 },
      path: 'demander_encore',
    },
  };
  return (
    <ChatBot
      options={{ theme: { embedded: true }, chatHistory: { storageKey: 'bot_association_multisport' } }}
      flow={flow}
    />
  );
};

export default AthlonixBot;
