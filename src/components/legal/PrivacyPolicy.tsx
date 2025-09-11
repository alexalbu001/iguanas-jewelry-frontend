import React from 'react';
import { ShieldCheckIcon, EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <ShieldCheckIcon className="h-16 w-16 text-iguana-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Iguanas Jewelry ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you visit our website or make a purchase from us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Name and contact information (email, phone number)</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Account credentials and preferences</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <EyeIcon className="h-8 w-8 text-iguana-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Service Provision</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Process and fulfill orders</li>
                  <li>• Provide customer support</li>
                  <li>• Send order confirmations and updates</li>
                  <li>• Manage your account</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <PencilSquareIcon className="h-8 w-8 text-iguana-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Communication</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Send marketing communications (with consent)</li>
                  <li>• Respond to inquiries</li>
                  <li>• Send important updates about our service</li>
                  <li>• Conduct surveys and feedback collection</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our website and conducting our business (e.g., payment processors, shipping companies)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> When you have given explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
              <li>SSL encryption for data transmission</li>
              <li>Secure payment processing through Stripe</li>
              <li>Regular security assessments and updates</li>
              <li>Limited access to personal information on a need-to-know basis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights (GDPR)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are in the European Union, you have the following rights regarding your personal data:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-iguana-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Access & Portability</h3>
                <p className="text-sm text-gray-700">Request a copy of your personal data in a structured format</p>
              </div>
              <div className="bg-iguana-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Rectification</h3>
                <p className="text-sm text-gray-700">Correct inaccurate or incomplete personal data</p>
              </div>
              <div className="bg-iguana-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Erasure</h3>
                <p className="text-sm text-gray-700">Request deletion of your personal data</p>
              </div>
              <div className="bg-iguana-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Restriction</h3>
                <p className="text-sm text-gray-700">Limit how we process your personal data</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your browsing experience. You can control cookie preferences through our cookie banner or browser settings.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Cookie Management:</strong> You can manage your cookie preferences at any time by clicking the "Cookie Settings" link in our cookie banner.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Order information is typically retained for 7 years for accounting and legal purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not directed to children under 16. We do not knowingly collect personal information from children under 16. If you become aware that a child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> privacy@iguanasjewelry.com</p>
                <p><strong>Address:</strong> [Your Business Address]</p>
                <p><strong>Phone:</strong> [Your Phone Number]</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
