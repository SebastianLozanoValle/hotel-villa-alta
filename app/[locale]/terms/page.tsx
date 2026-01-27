'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from "@/src/components/layout/navbar";
import Footer from "@/src/components/layout/footer";
import content from "@/content/es.json";
import Link from 'next/link';

export default function TermsPage() {
  const params = useParams();
  const locale = params?.locale as string || 'es';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar content={content.navbar} />
      
      <div className="pt-24 pb-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 md:mb-16">
            <Link 
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-secondary/60 hover:text-secondary transition-colors mb-8 font-source text-sm uppercase tracking-wider"
            >
              <span>←</span>
              <span>Volver al inicio</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-prata text-secondary uppercase leading-tight mb-4">
              Términos y Condiciones
            </h1>
            <p className="font-source text-sm text-secondary/60 uppercase tracking-wider">
              Políticas de Cancelación y Devoluciones
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-sm border border-secondary/10 shadow-lg">
              <div className="space-y-8 font-source text-sm md:text-base leading-relaxed text-secondary/90">
                
                <section>
                  <p className="mb-6">
                    El <strong className="font-medium">HUÉSPED</strong> puede ejercer derecho al retracto únicamente en compras no presenciales realizadas a través de portales web o en la central de reservas telefónica. La solicitud debe realizarla en máximo <strong className="font-medium">cinco (5) días hábiles</strong> posteriores a la confirmación de la compra. Si la fecha de ingreso es antes de los cinco días, no procederá el derecho al retracto y en caso de cancelación se aplicarán las condiciones de cancelación y devolución que son:
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="border-l-4 border-accent-rose pl-6 py-2">
                    <p className="font-medium text-secondary mb-2">
                      Cancelación con 8 o más días de anticipación
                    </p>
                    <p>
                      Si la cancelación de la reserva se realiza de <strong>8 o más días antes</strong> de la fecha de check in, se realizará una devolución del <strong className="text-accent-rose">80%</strong> correspondiente al valor depositado.
                    </p>
                  </div>

                  <div className="border-l-4 border-accent-rose pl-6 py-2">
                    <p className="font-medium text-secondary mb-2">
                      Cancelación entre 8 y 3 días antes del check in
                    </p>
                    <p>
                      Si la cancelación de la reserva se realiza dentro de <strong>8 a 3 días antes</strong> del check in se cobrará el <strong className="text-accent-rose">50%</strong> del valor depositado.
                    </p>
                  </div>

                  <div className="border-l-4 border-accent-rose pl-6 py-2">
                    <p className="font-medium text-secondary mb-2">
                      Cancelación dentro de las 48 horas antes del check in
                    </p>
                    <p>
                      Si la cancelación de la reserva se realiza dentro de las <strong>48 horas antes</strong> del check in se cobrará la <strong className="text-accent-rose">totalidad</strong> del valor depositado.
                    </p>
                  </div>

                  <div className="border-l-4 border-accent-rose pl-6 py-2">
                    <p className="font-medium text-secondary mb-2">
                      Salida anticipada
                    </p>
                    <p>
                      En caso que estando alojado tenga una salida anticipada y se haya realizado el pago total del alojamiento, tendrá un saldo a favor que podrá utilizar en cualquier establecimiento en convenios con el hotel, que deberá redimirse en <strong>1 año</strong>.
                    </p>
                  </div>
                </section>

                <section className="pt-6 border-t border-secondary/10">
                  <p className="text-sm md:text-base leading-relaxed">
                    Una vez recibida la solicitud, si se aplica devolución con base a las políticas establecidas por el hotel, te reintegraremos el valor de devolución en un término máximo de <strong className="font-medium">30 días calendarios</strong> contados a partir de tu solicitud. Lo realizaremos mediante consignación bancaria al titular de la reserva.
                  </p>
                </section>

              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-12 p-6 bg-secondary/5 rounded-sm border border-secondary/10">
              <p className="font-source text-xs uppercase tracking-wider text-secondary/60 mb-4">
                ¿Tienes preguntas sobre nuestras políticas?
              </p>
              <div className="space-y-2 font-source text-sm text-secondary">
                <p>
                  <a href="tel:+573215062187" className="hover:text-accent-rose transition-colors">
                    +57 321 5062187
                  </a>
                </p>
                <p>
                  <a href="mailto:hotelvillaaltac@gmail.com" className="hover:text-accent-rose transition-colors">
                    hotelvillaaltac@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer content={content} />
    </main>
  );
}

