import React, { useState } from 'react';
import { useAuth } from '../auth';
import { 
  ArrowDownTrayIcon, 
  TrashIcon, 
  EyeIcon, 
  PencilSquareIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const DataManagement: React.FC = () => {
  const { user, apiRequest } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDataExport = async () => {
    if (!user) return;
    
    setLoading('export');
    setMessage(null);
    
    try {
      const response = await apiRequest('/user/data-export', {
        method: 'GET',
      });
      
      // Create and download the file
      const blob = new Blob([JSON.stringify(response, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `iguanas-jewelry-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: 'Your data has been exported successfully!' });
    } catch (error) {
      console.error('Data export error:', error);
      setMessage({ type: 'error', text: 'Failed to export your data. Please try again.' });
    } finally {
      setLoading(null);
    }
  };

  const handleDataDeletion = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete all your data? This action cannot be undone. ' +
      'You will lose access to your account, order history, and all personal information.'
    );
    
    if (!confirmed) return;
    
    setLoading('delete');
    setMessage(null);
    
    try {
      await apiRequest('/user/delete-account', {
        method: 'DELETE',
      });
      
      setMessage({ type: 'success', text: 'Your account and data have been deleted successfully.' });
      
      // Redirect to home page after successful deletion
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Data deletion error:', error);
      setMessage({ type: 'error', text: 'Failed to delete your data. Please contact support.' });
    } finally {
      setLoading(null);
    }
  };

  const handleDataUpdate = async () => {
    if (!user) return;
    
    setLoading('update');
    setMessage(null);
    
    try {
      // This would typically open a form or redirect to account settings
      window.location.href = '/account/settings';
    } catch (error) {
      console.error('Data update error:', error);
      setMessage({ type: 'error', text: 'Failed to open account settings. Please try again.' });
    } finally {
      setLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
          <p className="text-gray-600">Please log in to manage your data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
          <p className="text-gray-600">Manage your personal data and privacy preferences</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Data Export */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <ArrowDownTrayIcon className="h-6 w-6 text-iguana-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Export Your Data</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Download a copy of all your personal data, including account information, 
                  order history, and preferences in a machine-readable format.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Account information and profile data</li>
                  <li>• Order history and purchase records</li>
                  <li>• Communication preferences</li>
                  <li>• Cookie consent history</li>
                </ul>
              </div>
              <button
                onClick={handleDataExport}
                disabled={loading === 'export'}
                className="ml-4 px-4 py-2 bg-iguana-600 text-white rounded-md hover:bg-iguana-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading === 'export' ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Data Update */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <PencilSquareIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Update Your Data</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Correct or update your personal information, including name, email, 
                  address, and communication preferences.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Update personal information</li>
                  <li>• Change email address</li>
                  <li>• Update shipping addresses</li>
                  <li>• Modify communication preferences</li>
                </ul>
              </div>
              <button
                onClick={handleDataUpdate}
                disabled={loading === 'update'}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading === 'update' ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <PencilSquareIcon className="h-4 w-4 mr-2" />
                    Update Data
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Data Deletion */}
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <TrashIcon className="h-6 w-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Delete Your Account</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Permanently delete your account and all associated personal data. 
                  This action cannot be undone.
                </p>
                <div className="bg-red-100 p-3 rounded-md">
                  <p className="text-sm text-red-800 font-medium mb-1">Warning: This will permanently delete:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Your account and profile information</li>
                    <li>• All order history and purchase records</li>
                    <li>• Saved addresses and preferences</li>
                    <li>• All personal data we have collected</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={handleDataDeletion}
                disabled={loading === 'delete'}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading === 'delete' ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Your Rights Under GDPR</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Right to Access</h4>
              <p>You have the right to know what personal data we hold about you and how we use it.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Right to Rectification</h4>
              <p>You can request correction of inaccurate or incomplete personal data.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Right to Erasure</h4>
              <p>You can request deletion of your personal data in certain circumstances.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Right to Portability</h4>
              <p>You can receive your personal data in a structured, machine-readable format.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            For questions about your data rights, contact us at{' '}
            <a href="mailto:privacy@iguanasjewelry.com" className="text-iguana-600 hover:text-iguana-700">
              privacy@iguanasjewelry.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
