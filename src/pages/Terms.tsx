
const Terms = () => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Conditions Générales</h1>
      
      <div className="bg-white rounded-lg shadow p-4 md:p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Bienvenue sur l'application TaxiApp. Les présentes conditions générales régissent
            votre utilisation de notre application mobile et des services associés. En utilisant notre
            application, vous acceptez d'être lié par ces conditions. Veuillez les lire attentivement.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">2. Services</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Notre application permet aux chauffeurs de taxi de recevoir et gérer des réservations,
            de suivre leurs courses et de gérer leurs paiements. Nous fournissons une plateforme
            technologique qui connecte les chauffeurs et les passagers, mais nous ne fournissons pas
            directement de services de transport.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">3. Compte utilisateur</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Pour utiliser notre service, vous devez créer un compte avec des informations exactes,
            complètes et à jour. Vous êtes responsable du maintien de la confidentialité de votre
            mot de passe et de toutes les activités qui se produisent sous votre compte. Vous devez
            nous informer immédiatement de toute utilisation non autorisée de votre compte.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">4. Obligations du chauffeur</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            En tant que chauffeur utilisant notre application, vous vous engagez à :
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 space-y-1">
            <li>Maintenir à jour toutes les licences et autorisations requises</li>
            <li>Fournir un service professionnel et courtois aux passagers</li>
            <li>Respecter toutes les lois et réglementations applicables</li>
            <li>Maintenir votre véhicule en bon état de fonctionnement</li>
            <li>Arriver à l'heure pour les courses planifiées</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Paiements</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Les paiements sont traités conformément aux tarifs et frais convenus dans l'application.
            Nous pouvons prélever des frais de service pour l'utilisation de notre plateforme. Vous
            recevrez un relevé détaillé de toutes les transactions.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">6. Confidentialité</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Nous recueillons et traitons vos données conformément à notre politique de confidentialité.
            En utilisant notre application, vous consentez à la collecte et au traitement de vos
            données personnelles conformément à cette politique.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">7. Résiliation</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Nous nous réservons le droit de suspendre ou de résilier votre accès à notre service
            à tout moment, pour quelque raison que ce soit, y compris, sans limitation, si vous
            enfreignez les présentes conditions générales.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-3">8. Modification des conditions</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Nous pouvons modifier ces conditions générales à tout moment. Les modifications
            entreront en vigueur dès leur publication sur l'application. Votre utilisation continue
            de l'application après de telles modifications constitue votre acceptation des nouvelles conditions.
          </p>
        </section>
        
        <section className="pt-4 border-t">
          <p className="text-xs text-gray-500">
            Dernière mise à jour : 15 mai 2025
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
