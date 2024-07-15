import type { Database } from '@repo/types';
import { Resend } from 'resend';
import { supabase } from './supabase.js';

type location = Database['public']['Tables']['ADDRESSES']['Row'];
type user = Database['public']['Tables']['USERS']['Row'];

async function getApprovedMembers(): Promise<user[] | null> {
  const selectedRoles = ['MEMBER'];
  const { data, error } = await supabase
    .from('USERS')
    .select('*, roles:ROLES!inner(id, name)')
    .filter('deleted_at', 'is', null)
    .eq('status', 'approved')
    .in('roles.name', selectedRoles);

  if (error) {
    return null;
  }

  return data;
}

export async function sendNewAssemblyEmail(name: string, date: string, location: location | null) {
  const resend = new Resend(process.env.RESEND_KEY);

  if (!resend.emails) {
    throw new Error('Emails feature is not enabled');
  }

  const members = await getApprovedMembers();
  if (!members) {
    return;
  }

  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const address =
    location === null
      ? 'En ligne'
      : `${location?.number} ${location?.road}, ${location?.city} ${location?.postal_code}`;

  for (const member of members) {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: member.email,
      subject: 'ATHLONIX - Nouvelle Assemblée Générale',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Nouvelle Assemblée Générale : ${name}</h2>
            <p>Cher(e) ${member.first_name},</p>
            <p>Nous avons le plaisir de vous informer qu'une nouvelle assemblée générale a été ajoutée au planning :</p>
            <ul>
              <li><strong>Date :</strong> ${formattedDate}</li>
              <li><strong>Lieu :</strong> ${address}</li>
            </ul>
            <p>Votre présence est importante pour notre association. Si vous ne pouvez pas assister à cette assemblée, merci de nous en informer dès que possible.</p>
            <p>Cordialement,<br>L'équipe d'Athlonix</p>
          </body>
        </html>
      `,
    });
  }
}

export async function sendWelcomeEmail(user: { email: string; first_name: string }) {
  const resend = new Resend(process.env.RESEND_KEY);

  if (!resend.emails) {
    throw new Error('Emails feature is not enabled');
  }

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: user.email,
    subject: 'Bienvenue chez Athlonix !',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Bienvenue chez Athlonix !</h2>
          <p>Cher(e) ${user.first_name},</p>
          <p>Nous sommes ravis de vous accueillir au sein de notre association sportive. Votre compte a été créé avec succès.</p>
          <h3>Prochaines étapes :</h3>
          <ol>
            <li>Complétez votre profil en ligne</li>
            <li>Explorez notre calendrier d'événements</li>
            <li>Prenez connaissance de nos activités et cours proposés</li>
            <li>Souscrivez à notre abonnement annuel pour devenir membre officiel</li>
          </ol>
          <p>Si vous avez des questions, n'hésitez pas à contacter notre équipe de support à support@votre-association.fr.</p>
          <p>Nous vous souhaitons une excellente expérience parmi nous !</p>
          <p>Sportivement,<br>L'équipe d'Athlonix</p>
        </body>
      </html>
    `,
  });
}
