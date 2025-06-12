
import React from 'react';
import { Directive, DirectiveStatus } from '../types';

interface DirectiveCardProps {
  directive: Directive;
}

const DetailItem: React.FC<{ label: string; value: string | null | undefined; isStatus?: boolean; statusValue?: DirectiveStatus }> = ({ label, value, isStatus = false, statusValue }) => {
  let statusColorClass = '';
  if (isStatus) {
    switch (statusValue) {
      case DirectiveStatus.COMPLETED:
        statusColorClass = 'text-green-400';
        break;
      case DirectiveStatus.FAILED:
        statusColorClass = 'text-red-400';
        break;
      case DirectiveStatus.PENDING:
        statusColorClass = 'text-yellow-400';
        break;
    }
  }

  return (
    <div className="py-2">
      <span className="font-semibold text-ledger-text-dim">{label}: </span>
      <span className={isStatus ? statusColorClass : 'text-ledger-text'}>
        {value === null || value === undefined ? 'N/A' : value}
      </span>
    </div>
  );
};


export const DirectiveCard: React.FC<DirectiveCardProps> = ({ directive }) => {
  const cardClasses = `
    bg-black 
    border-2 
    p-4 md:p-6 
    shadow-md 
    ${directive.status === DirectiveStatus.FAILED ? 'border-ledger-fail-border bg-ledger-fail bg-opacity-20' : 'border-ledger-border'}
  `;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString(undefined, { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <article className={cardClasses}>
      <h3 className={`text-xl font-bold mb-3 ${directive.status === DirectiveStatus.FAILED ? 'text-red-300' : 'text-ledger-accent'}`}>
        {directive.title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-sm">
        <DetailItem label="ID" value={directive.id} />
        <DetailItem label="Type" value={directive.type} />
        <DetailItem label="Assigned" value={formatDate(directive.assignedDate)} />
        <DetailItem label="Due Date" value={formatDate(directive.dueDate)} />
        <DetailItem label="Status" value={directive.status} isStatus={true} statusValue={directive.status} />
      </div>
      
      <div className="mt-4 pt-3 border-t border-ledger-border">
        <h4 className="font-semibold text-ledger-text-dim mb-1">User Report:</h4>
        <p className="text-ledger-text text-sm whitespace-pre-wrap min-h-[2em]">
          {directive.userReport || <span className="italic text-ledger-text-dim">No report submitted.</span>}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-ledger-border">
        <h4 className="font-semibold text-ledger-text-dim mb-1">Mistress Appraisal:</h4>
        <p className="text-ledger-text text-sm whitespace-pre-wrap min-h-[2em]">
          {directive.mistressAppraisal || <span className="italic text-ledger-text-dim">Awaiting appraisal.</span>}
        </p>
      </div>
    </article>
  );
};
