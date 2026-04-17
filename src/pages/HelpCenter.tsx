import React from 'react';

const HelpCenter = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>

      <p className="mb-4 text-slate-600 dark:text-slate-300">
        Welcome to Job Recruitment Portal Help Center. Here are some common questions:
      </p>

      <ul className="space-y-4">
        <li>
          <strong>How to apply for a job?</strong><br />
          Browse jobs → Click job → Click Apply button.
        </li>

        <li>
          <strong>How to upload CV?</strong><br />
          Go to Profile → Upload CV.
        </li>

        <li>
          <strong>How to post a job?</strong><br />
          Login as employer → Dashboard → Post Job.
        </li>
      </ul>
    </div>
  );
};

export default HelpCenter;