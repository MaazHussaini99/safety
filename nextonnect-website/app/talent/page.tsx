import { getContentBySlug } from '@/lib/markdown';
import Hero from '@/components/ui/Hero';

export const metadata = {
  title: 'Talent Solutions - Nextonnect',
  description:
    'Comprehensive talent acquisition and management solutions to build exceptional teams.',
};

export default async function TalentPage() {
  const content = await getContentBySlug('talent', 'overview');

  return (
    <>
      <Hero
        title="Talent Solutions"
        subtitle="Connecting exceptional talent with opportunities for growth and success"
        ctaText="Contact Us"
        ctaLink="/contact"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900
              prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6
              prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-brand-blue-800
              prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-brand-blue-700
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:my-6 prose-ul:space-y-2
              prose-li:text-gray-600
              prose-strong:text-gray-900 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: content?.content || '' }}
          />
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-brand-blue-800 to-brand-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Dream Team?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let us help you find the talent that will drive your success.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 rounded-md text-lg font-medium text-brand-blue-900 bg-brand-yellow-500 hover:bg-brand-yellow-600 transition-colors shadow-lg"
          >
            Get Started
          </a>
        </div>
      </section>
    </>
  );
}
