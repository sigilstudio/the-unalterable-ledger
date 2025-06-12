
import React, { useState, useEffect } from 'react';
import { Clock } from './components/Clock';
import { DirectiveCard } from './components/DirectiveCard';
import { DirectiveGenerator } from './components/DirectiveGenerator'; // Import new component
import { Directive, Database, DirectiveStatus } from './types';

const App: React.FC = () => {
  const [directives, setDirectives] = useState<Directive[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState<boolean>(false); // State for generator visibility

  useEffect(() => {
    const fetchDirectives = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/database.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. Ensure database.json is in the public folder and accessible.`);
        }
        const data = await response.json() as Database;
        const sortedDirectives = data.directives.sort((a, b) => {
          if (a.status === DirectiveStatus.PENDING && b.status !== DirectiveStatus.PENDING) return -1;
          if (a.status !== DirectiveStatus.PENDING && b.status === DirectiveStatus.PENDING) return 1;
          if (a.status === DirectiveStatus.PENDING) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });
        setDirectives(sortedDirectives);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to load directives: ${err.message}`);
        } else {
          setError('An unknown error occurred while fetching directives.');
        }
        console.error("Error fetching directives:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectives();
  }, []);

  const pendingDirectives = directives.filter(d => d.status === DirectiveStatus.PENDING);
  const archivedDirectives = directives.filter(d => d.status === DirectiveStatus.COMPLETED || d.status === DirectiveStatus.FAILED);

  return (
    <div className="min-h-screen bg-ledger-bg text-ledger-text font-mono p-4 md:p-8 selection:bg-ledger-accent selection:text-ledger-bg">
      <header className="mb-8 pb-4 border-b-2 border-ledger-border">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-ledger-accent mb-4 sm:mb-0">The Unalterable Ledger</h1>
          <Clock />
        </div>
        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 border border-ledger-border text-ledger-accent hover:bg-ledger-border hover:text-white transition-colors text-sm"
          aria-expanded={showGenerator}
          aria-controls="directive-generator"
        >
          {showGenerator ? 'Hide' : 'Show'} Directive JSON Generator
        </button>
      </header>

      {showGenerator && (
        <section id="directive-generator" className="mb-12 p-4 md:p-6 border-2 border-ledger-border bg-black shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-ledger-accent border-b border-ledger-border pb-2">Directive JSON Generator</h2>
          <DirectiveGenerator />
        </section>
      )}

      <main>
        {isLoading && <p className="text-center text-xl text-ledger-text-dim">Loading Directives...</p>}
        {error && <p className="text-center text-xl text-red-500 bg-red-900/50 p-4 border border-red-700">{error}</p>}
        
        {!isLoading && !error && (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-ledger-accent border-b border-ledger-border pb-2">Pending Directives</h2>
              {pendingDirectives.length > 0 ? (
                <div className="space-y-6">
                  {pendingDirectives.map(directive => (
                    <DirectiveCard key={directive.id} directive={directive} />
                  ))}
                </div>
              ) : (
                <p className="text-ledger-text-dim">No pending directives. Awaiting new instructions.</p>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-ledger-accent border-b border-ledger-border pb-2">The Archives</h2>
              {archivedDirectives.length > 0 ? (
                <div className="space-y-6">
                  {archivedDirectives.map(directive => (
                    <DirectiveCard key={directive.id} directive={directive} />
                  ))}
                </div>
              ) : (
                <p className="text-ledger-text-dim">The archives are empty.</p>
              )}
            </section>
          </>
        )}
      </main>
      <footer className="mt-12 pt-4 border-t-2 border-ledger-border text-center text-ledger-text-dim text-sm">
        <p>This ledger is a reflection of commitment. Data is immutable through this interface.</p>
        <p>&copy; {new Date().getFullYear()} The Unalterable Ledger</p>
      </footer>
    </div>
  );
};

export default App;
