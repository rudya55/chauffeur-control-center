
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Conditions Générales</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Conditions Générales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="mb-4">
              Bienvenue sur notre plateforme. Les présentes conditions générales régissent l'utilisation de nos services.
            </p>
            <h3 className="text-lg font-semibold mb-2">1. Acceptation des conditions</h3>
            <p className="mb-4">
              En utilisant notre plateforme, vous acceptez ces conditions générales dans leur intégralité. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
            </p>
            <h3 className="text-lg font-semibold mb-2">2. Description du service</h3>
            <p className="mb-4">
              Notre plateforme offre des services de mise en relation entre chauffeurs professionnels et clients. Nous facilitons la réservation et la gestion des courses.
            </p>
            <h3 className="text-lg font-semibold mb-2">3. Conditions d'utilisation</h3>
            <p className="mb-4">
              L'utilisation de nos services est soumise au respect des lois en vigueur et de nos politiques internes. Tout comportement abusif pourra entraîner la suspension ou la résiliation de votre compte.
            </p>
            <h3 className="text-lg font-semibold mb-2">4. Responsabilité</h3>
            <p className="mb-4">
              Nous nous efforçons d'assurer la qualité et la fiabilité de nos services, mais ne pouvons être tenus responsables des dommages indirects résultant de l'utilisation de notre plateforme.
            </p>
            <h3 className="text-lg font-semibold mb-2">5. Modifications</h3>
            <p className="mb-4">
              Nous nous réservons le droit de modifier ces conditions générales à tout moment. Les modifications prendront effet dès leur publication sur notre plateforme.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;
