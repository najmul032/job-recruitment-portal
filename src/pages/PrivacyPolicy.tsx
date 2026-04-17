import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="text-slate-600 dark:text-slate-300 mb-4">
        We respect your privacy and protect your personal data.
      </p>

      <ul className="space-y-3">
        <li>• Your email and personal data are safe</li>
        <li>• We do not share your data with third parties</li>
        <li>• Your CV is only visible to employers</li>
      </ul>
    </div>
  );
};

export default PrivacyPolicy;