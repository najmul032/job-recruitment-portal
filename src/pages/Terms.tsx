import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="text-slate-600 dark:text-slate-300 mb-4">
        By using this platform, you agree to the following:
      </p>

      <ul className="space-y-3">
        <li>• You will not misuse the platform</li>
        <li>• Fake job posting is not allowed</li>
        <li>• Respect other users</li>
      </ul>
    </div>
  );
};

export default Terms;