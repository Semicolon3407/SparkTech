import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Terms & Conditions | ${APP_NAME}`,
  description: `Read the terms and conditions for using ${APP_NAME}'s services and purchasing products.`,
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Terms & Conditions' },
        ]}
        className="mb-12"
      />

      <div className="max-w-3xl mx-auto prose prose-lg prose-primary prose-headings:font-extrabold prose-headings:tracking-tight prose-p:text-gray-600 prose-p:font-medium">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-950 mb-10">Terms & Conditions</h1>
        
        <p className="lead">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight mt-12 mb-6">1. General Terms</h2>
          <p>
            By accessing and placing an order with {APP_NAME}, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and {APP_NAME}.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight mt-12 mb-6">2. Product Availability</h2>
          <p>
            While we strive to ensure that all details, descriptions, and prices which appear on this Website are accurate, errors may occur. If we discover an error in the price of any goods which you have ordered, we will inform you of this as soon as possible and give you the option of reconfirming your order at the correct price or cancelling it.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight mt-12 mb-6">3. Payment</h2>
          <p>
            We accept various payment methods including eSewa, Khalti, and Cash on Delivery. All payments are processed securely. In the case of Cash on Delivery, payment must be made in full at the time of delivery.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight mt-12 mb-6">4. Limitation of Liability</h2>
          <p>
            {APP_NAME} will not be liable for any consequential, indirect, incidental, special, or punitive damages, however caused and under any theory of liability, and even if {APP_NAME} has been advised of the possibility of such damages.
          </p>
        </section>

        <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 mt-20">
          <h3 className="text-xl font-extrabold text-gray-950 tracking-tight mb-4">Agreement</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            By using our website, you hereby consent to our Terms & Conditions and agree to its terms.
          </p>
        </div>
      </div>
    </div>
  );
}
