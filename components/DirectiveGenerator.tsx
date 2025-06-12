
import React, { useState } from 'react';
import { DirectiveStatus } from '../types'; // Only for status enum values

interface GeneratedDirective {
  id: number;
  title: string;
  type: string;
  assignedDate: string; // YYYY-MM-DD
  dueDate: string;      // e.g., "Daily", or YYYY-MM-DD
  status: DirectiveStatus;
  userReport: string;
  mistressAppraisal: string;
}

export const DirectiveGenerator: React.FC = () => {
  const [id, setId] = useState<string>(''); // Keep as string for input, parse to number on generate
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [assignedDate, setAssignedDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [status, setStatus] = useState<DirectiveStatus>(DirectiveStatus.PENDING);
  const [userReport, setUserReport] = useState<string>('');
  const [mistressAppraisal, setMistressAppraisal] = useState<string>('');
  
  const [generatedJson, setGeneratedJson] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleGenerateJson = () => {
    setFormError(null);
    if (!id || !title || !type || !assignedDate || !dueDate) {
      setFormError('ID, Title, Type, Assigned Date, and Due Date are required.');
      setGeneratedJson('');
      return;
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        setFormError('ID must be a number.');
        setGeneratedJson('');
        return;
    }

    const directive: GeneratedDirective = {
      id: numericId,
      title,
      type,
      assignedDate,
      dueDate,
      status,
      userReport,
      mistressAppraisal,
    };

    const output = {
      directives: [directive],
    };

    setGeneratedJson(JSON.stringify(output, null, 2));
    setCopied(false);
  };

  const handleCopyToClipboard = () => {
    if (generatedJson) {
      navigator.clipboard.writeText(generatedJson)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  const inputClass = "w-full bg-black border border-ledger-border text-ledger-text p-2 focus:border-ledger-accent focus:ring-1 focus:ring-ledger-accent outline-none";
  const labelClass = "block text-ledger-text-dim text-sm font-semibold mb-1";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="gen-id" className={labelClass}>ID (Numeric e.g., 1, 23)</label>
          <input type="text" id="gen-id" value={id} onChange={(e) => setId(e.target.value)} className={inputClass} placeholder="e.g., 101" />
        </div>
        <div>
          <label htmlFor="gen-title" className={labelClass}>Title</label>
          <input type="text" id="gen-title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Directive Title" />
        </div>
        <div>
          <label htmlFor="gen-type" className={labelClass}>Type</label>
          <input type="text" id="gen-type" value={type} onChange={(e) => setType(e.target.value)} className={inputClass} placeholder="e.g., Action, Service" />
        </div>
        <div>
          <label htmlFor="gen-status" className={labelClass}>Status</label>
          <select id="gen-status" value={status} onChange={(e) => setStatus(e.target.value as DirectiveStatus)} className={inputClass}>
            <option value={DirectiveStatus.PENDING}>Pending</option>
            <option value={DirectiveStatus.COMPLETED}>Completed</option>
            <option value={DirectiveStatus.FAILED}>Failed</option>
          </select>
        </div>
        <div>
          <label htmlFor="gen-assignedDate" className={labelClass}>Assigned Date</label>
          <input type="text" id="gen-assignedDate" value={assignedDate} onChange={(e) => setAssignedDate(e.target.value)} className={inputClass} placeholder="YYYY-MM-DD" />
        </div>
        <div>
          <label htmlFor="gen-dueDate" className={labelClass}>Due Date</label>
          <input type="text" id="gen-dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} placeholder="e.g., Daily, YYYY-MM-DD" />
        </div>
      </div>

      <div>
        <label htmlFor="gen-userReport" className={labelClass}>User Report (Optional)</label>
        <textarea id="gen-userReport" value={userReport} onChange={(e) => setUserReport(e.target.value)} className={`${inputClass} min-h-[60px]`} placeholder="User's report content..."></textarea>
      </div>
      <div>
        <label htmlFor="gen-mistressAppraisal" className={labelClass}>Mistress Appraisal (Optional)</label>
        <textarea id="gen-mistressAppraisal" value={mistressAppraisal} onChange={(e) => setMistressAppraisal(e.target.value)} className={`${inputClass} min-h-[60px]`} placeholder="Mistress's appraisal content..."></textarea>
      </div>

      {formError && (
        <p className="text-red-400 bg-red-900/50 p-3 border border-red-700 text-sm">{formError}</p>
      )}

      <button
        onClick={handleGenerateJson}
        className="w-full bg-ledger-accent text-ledger-bg font-bold py-2 px-4 hover:bg-ledger-text hover:text-ledger-bg transition-colors"
        aria-label="Generate JSON for new directive"
      >
        Generate JSON
      </button>

      {generatedJson && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-ledger-accent mb-2">Generated JSON:</h4>
          <div className="relative">
            <textarea
              readOnly
              value={generatedJson}
              className="w-full h-64 bg-black border border-ledger-border text-ledger-text p-3 font-mono text-xs whitespace-pre-wrap"
              aria-label="Generated JSON output"
            ></textarea>
            <button
              onClick={handleCopyToClipboard}
              className="absolute top-2 right-2 bg-ledger-border text-ledger-accent px-3 py-1 text-xs hover:bg-ledger-text-dim transition-colors"
              aria-label="Copy JSON to clipboard"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-ledger-text-dim mt-2">
            Copy the above JSON and manually add it to your <code className="bg-gray-700 px-1 rounded">database.json</code> file within the <code className="bg-gray-700 px-1 rounded">directives</code> array.
            Ensure the <code className="bg-gray-700 px-1 rounded">id</code> is unique within your database. The main application expects string IDs (e.g., "task-001") and ISO 8601 date strings for full compatibility with existing display features like date formatting; you may need to adjust the generated JSON accordingly.
          </p>
        </div>
      )}
    </div>
  );
};
