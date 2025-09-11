import React from 'react';
import { DocumentTextIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <DocumentTextIcon className="h-16 w-16 text-iguana-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Iguanas Jewelry's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Iguanas Jewelry provides an online platform for the sale of handcrafted jewelry. Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Online jewelry catalog and product information</li>
              <li>E-commerce platform for purchasing jewelry</li>
              <li>Customer account management</li>
              <li>Order processing and fulfillment</li>
              <li>Customer support services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Account Requirements</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• You must be at least 18 years old to create an account</li>
                <li>• You must provide accurate and complete information</li>
                <li>• You are responsible for maintaining account security</li>
                <li>• You must notify us immediately of any unauthorized use</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Product Information and Pricing</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Accuracy</h3>
                <p className="text-sm text-gray-700">
                  We strive to provide accurate product descriptions, images, and pricing. However, we cannot guarantee that all information is completely accurate or up-to-date.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Pricing Changes</h3>
                <p className="text-sm text-gray-700">
                  We reserve the right to change prices at any time without notice. Prices are subject to change until your order is confirmed and payment is processed.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Orders and Payment</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Order Processing</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• All orders are subject to acceptance and availability</li>
                  <li>• We reserve the right to refuse or cancel any order</li>
                  <li>• Orders are processed in the order they are received</li>
                  <li>• You will receive an order confirmation via email</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Payment Terms</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Payment is required at the time of order placement</li>
                  <li>• We accept major credit cards and PayPal</li>
                  <li>• All payments are processed securely through Stripe</li>
                  <li>• Prices are in USD and include applicable taxes</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Shipping and Delivery</h2>
            <div className="bg-iguana-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-iguana-800 mb-3">Shipping Information</h3>
              <ul className="text-sm text-iguana-700 space-y-2">
                <li>• <strong>Processing Time:</strong> 1-3 business days</li>
                <li>• <strong>Shipping Time:</strong> 3-7 business days (domestic)</li>
                <li>• <strong>International:</strong> 7-14 business days</li>
                <li>• <strong>Tracking:</strong> Provided for all shipments</li>
                <li>• <strong>Insurance:</strong> Included for orders over $100</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              Delivery times are estimates and may vary due to factors beyond our control. We are not responsible for delays caused by shipping carriers or customs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Returns and Exchanges</h2>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 mb-3">Return Policy</h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• <strong>Return Window:</strong> 30 days from delivery</li>
                <li>• <strong>Condition:</strong> Items must be unworn and in original packaging</li>
                <li>• <strong>Process:</strong> Contact us for return authorization</li>
                <li>• <strong>Refunds:</strong> Processed within 5-7 business days</li>
                <li>• <strong>Shipping:</strong> Return shipping costs are customer's responsibility</li>
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-red-700">
                <strong>Note:</strong> Custom or personalized items cannot be returned unless there is a defect in workmanship.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Iguanas Jewelry and is protected by copyright and other intellectual property laws.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Restrictions:</strong> You may not reproduce, distribute, modify, or create derivative works from our content without written permission.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, Iguanas Jewelry shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our service, to understand our practices regarding the collection and use of your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date. Your continued use of our service after any such changes constitutes your acceptance of the new Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> legal@iguanasjewelry.com</p>
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

export default TermsOfService;
