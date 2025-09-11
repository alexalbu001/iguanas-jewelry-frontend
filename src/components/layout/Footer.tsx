import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShieldCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-iguana-400 mb-4">Iguanas Jewelry</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Handcrafted silver jewelry collection featuring rings, earrings, bracelets, and necklaces. 
              Each piece is carefully designed and crafted with attention to detail and timeless elegance.
            </p>
            <div className="flex items-center text-iguana-400">
              <HeartIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">Made with love for jewelry enthusiasts</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-iguana-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/rings" className="text-gray-300 hover:text-iguana-400 transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link to="/category/earrings" className="text-gray-300 hover:text-iguana-400 transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link to="/category/bracelets" className="text-gray-300 hover:text-iguana-400 transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link to="/category/necklaces" className="text-gray-300 hover:text-iguana-400 transition-colors">
                  Necklaces
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal & Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-iguana-400 transition-colors flex items-center">
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-iguana-400 transition-colors flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/data-management" className="text-gray-300 hover:text-iguana-400 transition-colors">
                  Data Management
                </Link>
              </li>
              <li>
                <a href="mailto:support@iguanasjewelry.com" className="text-gray-300 hover:text-iguana-400 transition-colors">
                  Customer Support
                </a>
              </li>
              <li>
                <a href="mailto:privacy@iguanasjewelry.com" className="text-gray-300 hover:text-iguana-400 transition-colors">
                  Privacy Inquiries
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Iguanas Jewelry. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>GDPR Compliant</span>
              <span>•</span>
              <span>Secure Payments</span>
              <span>•</span>
              <span>SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
