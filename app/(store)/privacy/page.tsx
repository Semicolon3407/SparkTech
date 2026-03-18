import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Privacy Policy | ${APP_NAME}`,
  description: `Read how ${APP_NAME} collects, uses, and protects your personal information.`,
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy' },
        ]}
        className="mb-12"
      />

      <div className="max-w-3xl mx-auto prose prose-lg prose-primary prose-headings:font-black prose-headings:tracking-tight prose-p:text-gray-600 prose-p:font-medium">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-950 mb-10">Privacy Policy</h1>
        
        <p className="lead">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-950 tracking-tight mt-12 mb-6">1. Introduction</h2>
          <p>
            Welcome to {APP_NAME}. We respect your privacy and want to protect your personal information. To learn more, please read this Privacy Policy.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-950 tracking-tight mt-12 mb-6">2. Data We Collect</h2>
          <p>
            We may collect various pieces of information if you seek to place an order for a product with us on the Site. We collect, store and process your data for processing your purchase on the Site and any possible later claims, and to provide you with our services.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 font-medium">
            <li>Identity Data (Name, Email, Phone)</li>
            <li>Contact Data (Billing, Shipping Addresses)</li>
            <li>Transaction Data (Payment info, order history)</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-950 tracking-tight mt-12 mb-6">3. Use of Your Information</h2>
          <p>
            We use the information we collect to process orders, improve our website, and communicate with you about your orders or promotional offers.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-950 tracking-tight mt-12 mb-6">4. Security</h2>
          <p>
            We have in place appropriate technical and security measures to prevent unauthorized or unlawful access to or accidental loss of or destruction or damage to your information.
          </p>
        </section>

        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 mt-20">
          <h3 className="text-xl font-black text-gray-950 tracking-tight mb-4">Questions?</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
            If you have any questions regarding this privacy policy, you can contact our privacy officer at:
          </p>
          <div className="text-sm font-bold text-gray-950">privacy@sparktech.com</div>
        </div>
      </div>
    </div>
  );
}
