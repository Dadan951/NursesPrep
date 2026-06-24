import { Link } from 'react-router-dom';

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">{title}</h2>
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">{children}</div>
    </section>
  );
}

export default function CGU() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Retour à l'accueil
          </Link>
          <span className="text-xs text-slate-400">Dernière mise à jour : juin 2026</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-4">
            Document légal
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Conditions Générales d'Utilisation</h1>
          <p className="text-slate-500 text-sm">
            En utilisant la plateforme Nurses Prép, vous acceptez les présentes conditions générales d'utilisation.
            Veuillez les lire attentivement avant de créer votre compte.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">

          <Section title="1. Présentation de la plateforme">
            <p>
              Nurses Prép (ci-après « la Plateforme ») est une application web de préparation aux études infirmières,
              accessible à l'adresse <strong>nursesprep.fr</strong>, éditée par Nurses Prép, dont le contact est
              disponible à l'adresse <a href="mailto:contact@nursesprep.fr" className="text-blue-600 underline">contact@nursesprep.fr</a>.
            </p>
            <p>
              La Plateforme propose des outils pédagogiques (quiz, flashcards, fiches de cours, annales, base médicaments)
              destinés aux étudiants en Institut de Formation en Soins Infirmiers (IFSI) en France.
            </p>
          </Section>

          <Section title="2. Acceptation des conditions">
            <p>
              L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU.
              Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la Plateforme.
            </p>
            <p>
              Nurses Prép se réserve le droit de modifier les présentes CGU à tout moment.
              Les modifications prennent effet dès leur publication sur la Plateforme.
              L'utilisation continue de la Plateforme après modification vaut acceptation des nouvelles CGU.
            </p>
          </Section>

          <Section title="3. Inscription et compte utilisateur">
            <p>
              Pour accéder aux fonctionnalités de la Plateforme, vous devez créer un compte en fournissant
              une adresse e-mail valide et un mot de passe, ou vous connecter via votre compte Google.
            </p>
            <p>
              Vous vous engagez à fournir des informations exactes, à maintenir votre mot de passe confidentiel,
              et à notifier immédiatement Nurses Prép de toute utilisation non autorisée de votre compte.
            </p>
            <p>
              Vous devez avoir au moins <strong>15 ans</strong> pour créer un compte. Si vous avez entre 15 et 18 ans,
              vous devez avoir obtenu l'autorisation de votre représentant légal.
            </p>
            <p>
              Un compte est strictement personnel et ne peut pas être partagé ou cédé à un tiers.
            </p>
          </Section>

          <Section title="4. Offres et abonnements">
            <p><strong>Offre Starter (gratuite)</strong> — Accès limité à 20 quiz, 30 flashcards, 1 exercice théorique, 1 cours et 1 fiche de révision par mois calendaire. Sans engagement.</p>
            <p><strong>Offre Étudiant (9,99 € / mois)</strong> — Accès illimité aux quiz, flashcards, cours et fiches. Renouvellement mensuel automatique.</p>
            <p><strong>Offre Étudiant Pro (14,99 € / mois)</strong> — Accès illimité à toutes les fonctionnalités, incluant la génération de fiches et de quiz par IA, les annales complètes, et le support prioritaire. Renouvellement mensuel automatique.</p>
            <p>
              Les paiements sont traités de façon sécurisée par <strong>Stripe</strong>. Nurses Prép ne stocke aucune
              donnée bancaire. Les tarifs s'entendent TTC.
            </p>
            <p>
              Vous bénéficiez d'un <strong>droit de rétractation de 14 jours</strong> à compter de la date de souscription,
              conformément à l'article L221-18 du Code de la consommation, sauf si vous avez commencé à utiliser
              les fonctionnalités premium (accès immédiat après paiement).
            </p>
          </Section>

          <Section title="5. Résiliation et remboursement">
            <p>
              Vous pouvez résilier votre abonnement à tout moment depuis votre espace personnel, rubrique « Abonnement ».
              La résiliation prend effet à la fin de la période d'abonnement en cours — aucun remboursement proratisé
              n'est effectué pour la période restante.
            </p>
            <p>
              Nurses Prép se réserve le droit de suspendre ou de supprimer un compte en cas de violation des présentes CGU,
              sans préavis ni remboursement.
            </p>
          </Section>

          <Section title="6. Propriété intellectuelle">
            <p>
              L'ensemble des contenus de la Plateforme (textes, fiches, questions, illustrations, code source, logo)
              est la propriété exclusive de Nurses Prép ou de ses partenaires et est protégé par le droit d'auteur français.
            </p>
            <p>
              Toute reproduction, distribution, modification ou utilisation commerciale de ces contenus sans autorisation
              écrite préalable est strictement interdite.
            </p>
            <p>
              Les contenus que vous générez via l'IA à partir de vos propres cours vous appartiennent.
              Nurses Prép conserve un droit d'usage anonymisé à des fins d'amélioration du service.
            </p>
          </Section>

          <Section title="7. Comportement utilisateur">
            <p>En utilisant la Plateforme, vous vous engagez à ne pas :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Utiliser la Plateforme à des fins illégales ou non autorisées</li>
              <li>Tenter d'accéder sans autorisation aux systèmes de la Plateforme</li>
              <li>Partager votre compte avec d'autres personnes</li>
              <li>Revendre ou redistribuer les contenus de la Plateforme</li>
              <li>Publier des contenus injurieux, diffamatoires ou contraires aux bonnes mœurs dans les groupes</li>
              <li>Utiliser des robots ou scripts pour accéder automatiquement à la Plateforme</li>
            </ul>
          </Section>

          <Section title="8. Disponibilité du service">
            <p>
              Nurses Prép s'efforce d'assurer la disponibilité de la Plateforme 24h/24, 7j/7.
              Cependant, des interruptions pour maintenance, mises à jour ou raisons techniques peuvent survenir.
              Nurses Prép ne saurait être tenu responsable des préjudices liés à une indisponibilité temporaire.
            </p>
          </Section>

          <Section title="9. Limitation de responsabilité">
            <p>
              Les contenus pédagogiques de la Plateforme sont fournis à titre indicatif et ne constituent pas
              un avis médical ou professionnel. Nurses Prép ne garantit pas l'exhaustivité, l'exactitude ou
              l'adéquation des contenus à votre situation spécifique.
            </p>
            <p>
              La responsabilité de Nurses Prép ne saurait être engagée en cas d'échec aux examens ou concours IFSI.
            </p>
          </Section>

          <Section title="10. Loi applicable et juridiction">
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution amiable,
              les tribunaux compétents du ressort du siège social de Nurses Prép seront seuls compétents.
            </p>
            <p>
              Pour tout contact : <a href="mailto:contact@nursesprep.fr" className="text-blue-600 underline">contact@nursesprep.fr</a>
            </p>
          </Section>

        </div>

        {/* Footer link */}
        <div className="mt-8 text-center">
          <Link to="/confidentialite" className="text-sm text-blue-600 hover:underline">
            Lire aussi notre Politique de confidentialité →
          </Link>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400">© 2026 Nurses Prép — <Link to="/" className="hover:underline">Retour à l'accueil</Link></p>
      </footer>
    </div>
  );
}
