'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Zap, AlertCircle, CheckCircle2, Send, Eye, Edit2, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import React from 'react';
import { createMarketFromDraft, connectWallet, getCreateMarketCosts } from '@/lib/contract';
import Link from 'next/link';

interface DraftMarket {
  title?: string;
  description?: string;
  resolution_type?: string;
  category?: string;
  outcomes?: string[];
  options?: string[];
  [key: string]: unknown;
}

interface DeploymentState {
  isDeploying: boolean;
  deployError: string | null;
  txHash: string | null;
  blockNumber?: number;
}

interface EditableFields {
  title: string;
  description: string;
  category: string;
  resolution_type: string;
}

export default function ArchitectPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftMarket | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableFields, setEditableFields] = useState<EditableFields>({
    title: '',
    description: '',
    category: '',
    resolution_type: '',
  });
  const [deployment, setDeployment] = useState<DeploymentState>({
    isDeploying: false,
    deployError: null,
    txHash: null,
  });

  // Generate a unique session ID on mount
  useEffect(() => {
    const id = `architect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(id);
  }, []);

  // Initialize editable fields when draft is loaded
  useEffect(() => {
    if (draft) {
      setEditableFields({
        title: draft.title || '',
        description: draft.description || '',
        category: draft.category || '',
        resolution_type: draft.resolution_type || '',
      });
      setIsEditMode(false);
    }
  }, [draft]);

  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a market prompt');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSubmitted(true);
    setDeployment({ isDeploying: false, deployError: null, txHash: null });

    try {
      const response = await fetch('/api/market/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const data: DraftMarket = await response.json();
      setDraft(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate draft. Please try again.';
      setError(message);
      setDraft(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeployMarket = async () => {
    if (!draft) {
      setDeployment({ isDeploying: false, deployError: 'No draft to deploy', txHash: null });
      return;
    }

    // Merge edited fields into draft
    const finalDraft = {
      ...draft,
      title: editableFields.title,
      description: editableFields.description,
      category: editableFields.category,
      resolution_type: editableFields.resolution_type,
    };

    setDeployment({ isDeploying: true, deployError: null, txHash: null });

    try {
      // Check if wallet is connected, if not, connect
      let address = userAddress;
      if (!address) {
        console.log('Connecting wallet...');
        address = await connectWallet();
        setUserAddress(address);
      }

      // Get cost info for user display
      const { totalEth } = getCreateMarketCosts();

      console.log('Deploying market from wallet:', address);
      console.log('Required funds:', totalEth, 'KITE');

      // Call the blockchain deployment function
      const result = await createMarketFromDraft(finalDraft as any);

      console.log('Market deployed successfully:', result);

      setDeployment({
        isDeploying: false,
        deployError: null,
        txHash: result.hash,
        blockNumber: result.blockNumber,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Deployment failed. Please try again.';
      console.error('Deployment error:', message);
      setDeployment({ isDeploying: false, deployError: message, txHash: null });
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-gradient-to-b from-[#000000] to-[#0a0a0a]">
        {/* Header Section */}
        <section className="bg-gradient-to-b from-[#1a1a1a]/50 to-[#000000] border-b border-[#1a1a1a] px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-[#00ff00]" size={32} />
              <h1 className="text-4xl font-black text-white">Prompt to Deploy</h1>
            </div>
            <p className="text-[#888888] text-lg max-w-2xl">
              Describe the market you want to create. Our AI will generate a complete draft with all the details.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Input Form */}
            <form onSubmit={handleGenerateDraft} className="mb-8">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-3 text-sm">
                    Market Prompt
                  </label>
                  <Textarea
                    placeholder="E.g., 'Make a market about whether DeepSeek will release a new model in April' or 'Will Bitcoin reach $100k by end of Q2?'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    className="min-h-24 bg-[#1a1a1a] border-[#333333] text-white placeholder-[#666666] focus:border-[#00ff00] resize-none"
                  />
                  <p className="text-[#666666] text-xs mt-2">
                    Be specific about the market condition and resolution criteria.
                  </p>
                </div>

                <div className="flex gap-3 items-center pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="bg-[#00ff00] text-[#000000] hover:bg-[#00ff00]/90 font-bold flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="text-[#000000]" />
                        Generating Draft...
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        Generate Draft
                      </>
                    )}
                  </Button>
                  <p className="text-[#888888] text-sm">
                    {isLoading ? 'AI is analyzing your prompt...' : 'This typically takes 5-15 seconds'}
                  </p>
                  {isLoading && sessionId && (
                    <Link
                      href={`/terminal?session=${encodeURIComponent(sessionId)}`}
                      target="_blank"
                      className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded text-xs text-[#00ff00] hover:text-[#00ff00] hover:bg-[#00ff00]/10 border border-[#00ff00]/30 hover:border-[#00ff00]/60 transition-colors"
                    >
                      <Eye size={14} />
                      Watch AI Think
                    </Link>
                  )}
                </div>
              </div>
            </form>

            {/* Error State */}
            {error && hasSubmitted && (
              <div className="bg-[#ff3333]/10 border border-[#ff3333]/50 rounded-lg p-4 mb-8 flex gap-3">
                <AlertCircle className="text-[#ff3333] flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-[#ff3333] font-semibold text-sm">Error</h3>
                  <p className="text-[#ff3333]/80 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Draft Result */}
            {draft && hasSubmitted && !isLoading && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#00ff00]/10 to-[#00ccff]/10 border border-[#00ff00]/30 rounded-lg p-6">
                  <div className="flex gap-3 mb-4">
                    <CheckCircle2 className="text-[#00ff00] flex-shrink-0" size={24} />
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Draft Generated Successfully</h2>
                      <p className="text-[#888888] text-sm">Review the details below and deploy when ready</p>
                    </div>
                  </div>
                </div>

                {/* Draft Details - Editable Section */}
                <div className="space-y-4">
                  {/* Edit Mode Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Review Market Details</h2>
                    {!isEditMode && !deployment.txHash && (
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#00ff00] hover:bg-[#00ff00]/10 border border-[#00ff00]/30 rounded transition-colors"
                      >
                        <Edit2 size={14} />
                        Edit Details
                      </button>
                    )}
                  </div>

                  {isEditMode ? (
                    // Edit Mode
                    <div className="space-y-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6">
                      {/* Title Field */}
                      <div>
                        <label className="block text-white font-semibold mb-2 text-sm">Market Title</label>
                        <input
                          type="text"
                          value={editableFields.title}
                          onChange={(e) =>
                            setEditableFields({ ...editableFields, title: e.target.value })
                          }
                          className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 text-white placeholder-[#666666] focus:outline-none focus:border-[#00ff00]"
                          placeholder="Enter market title"
                        />
                      </div>

                      {/* Category Field */}
                      <div>
                        <label className="block text-white font-semibold mb-2 text-sm">Category</label>
                        <input
                          type="text"
                          value={editableFields.category}
                          onChange={(e) =>
                            setEditableFields({ ...editableFields, category: e.target.value })
                          }
                          className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 text-white placeholder-[#666666] focus:outline-none focus:border-[#00ff00]"
                          placeholder="Enter category (e.g., Technology, Politics, Sports)"
                        />
                      </div>

                      {/* Resolution Type Field */}
                      <div>
                        <label className="block text-white font-semibold mb-2 text-sm">Resolution Type</label>
                        <input
                          type="text"
                          value={editableFields.resolution_type}
                          onChange={(e) =>
                            setEditableFields({ ...editableFields, resolution_type: e.target.value })
                          }
                          className="w-full bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 text-white placeholder-[#666666] focus:outline-none focus:border-[#00ff00]"
                          placeholder="e.g., STANDARD, CONDITIONAL"
                        />
                      </div>

                      {/* Description Field */}
                      <div>
                        <label className="block text-white font-semibold mb-2 text-sm">Description</label>
                        <Textarea
                          value={editableFields.description}
                          onChange={(e) =>
                            setEditableFields({ ...editableFields, description: e.target.value })
                          }
                          className="w-full min-h-24 bg-[#1a1a1a] border border-[#333333] rounded px-3 py-2 text-white placeholder-[#666666] focus:outline-none focus:border-[#00ff00] resize-none"
                          placeholder="Enter market description"
                        />
                      </div>

                      {/* Edit Mode Actions */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setIsEditMode(false)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#00ff00] text-[#000000] hover:bg-[#00ff00]/90 font-bold rounded transition-colors"
                        >
                          <Check size={16} />
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            // Reset editable fields to original draft values
                            setEditableFields({
                              title: draft.title || '',
                              description: draft.description || '',
                              category: draft.category || '',
                              resolution_type: draft.resolution_type || '',
                            });
                            setIsEditMode(false);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#1a1a1a] text-white hover:bg-[#1a1a1a] rounded transition-colors"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Read-Only Mode
                    <div className="space-y-4">
                      {/* Grid Layout for Key Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
                          <p className="text-[#888888] text-xs font-semibold mb-2">MARKET TITLE</p>
                          <p className="text-white font-semibold text-lg">{editableFields.title || 'N/A'}</p>
                        </div>

                        {/* Category */}
                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
                          <p className="text-[#888888] text-xs font-semibold mb-2">CATEGORY</p>
                          <p className="text-white font-semibold text-lg">{editableFields.category || 'N/A'}</p>
                        </div>

                        {/* Resolution Type */}
                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
                          <p className="text-[#888888] text-xs font-semibold mb-2">RESOLUTION TYPE</p>
                          <span className="inline-block px-2 py-1 bg-[#00ffff]/10 text-[#00ffff] rounded text-sm font-mono">
                            {editableFields.resolution_type || 'STANDARD'}
                          </span>
                        </div>

                        {/* Outcomes */}
                        {draft.outcomes && Array.isArray(draft.outcomes) && (
                          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
                            <p className="text-[#888888] text-xs font-semibold mb-2">OUTCOMES</p>
                            <div className="flex flex-wrap gap-2">
                              {draft.outcomes.map((outcome, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2 py-1 bg-[#ffcc00]/10 text-[#ffcc00] rounded text-xs font-mono"
                                >
                                  {outcome}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description - Full Width */}
                      {editableFields.description && (
                        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
                          <p className="text-[#888888] text-xs font-semibold mb-2">DESCRIPTION</p>
                          <p className="text-white text-sm leading-relaxed">{editableFields.description}</p>
                        </div>
                      )}

                      {/* Raw JSON for debugging */}
                      <details className="group">
                        <summary className="cursor-pointer text-[#666666] hover:text-[#888888] text-xs font-mono py-2 select-none">
                          ▸ View full API response
                        </summary>
                        <pre className="bg-[#1a1a1a] border border-[#333333] rounded p-3 text-[#00ff00] text-xs overflow-auto max-h-48 font-mono mt-2">
                          {JSON.stringify(draft, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>

                {/* Deployment Error */}
                {deployment.deployError && (
                  <div className="bg-[#ff3333]/10 border border-[#ff3333]/50 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="text-[#ff3333] flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h3 className="text-[#ff3333] font-semibold text-sm">Deployment Error</h3>
                      <p className="text-[#ff3333]/80 text-sm mt-1">{deployment.deployError}</p>
                    </div>
                  </div>
                )}

                {/* Cost Breakdown */}
                {!deployment.txHash && (
                  <div className="bg-gradient-to-br from-[#ffcc00]/5 to-[#ff9900]/5 border border-[#ffcc00]/30 rounded-lg p-6">
                    <h3 className="text-white font-bold text-lg mb-4">Deployment Cost</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-[#1a1a1a]">
                        <span className="text-[#888888] text-sm">Liquidity Pool (MIN_LIQUIDITY)</span>
                        <span className="text-white font-mono font-semibold">0.01 KITE</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-[#1a1a1a]">
                        <span className="text-[#888888] text-sm">AI Service Fee (10%)</span>
                        <span className="text-white font-mono font-semibold">0.001 KITE</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-white font-bold text-base">Total Required</span>
                        <span className="text-[#ffcc00] font-mono font-black text-xl">0.011 KITE</span>
                      </div>
                    </div>
                    <p className="text-[#888888] text-xs mt-4">
                      ⓘ Please ensure your connected wallet has at least 0.011 KITE available to deploy this market.
                    </p>
                  </div>
                )}

                {/* Deployment Success */}
                {deployment.txHash && !deployment.isDeploying && (
                  <div className="bg-[#00ff00]/10 border border-[#00ff00]/50 rounded-lg p-4">
                    <div className="flex gap-3 mb-3">
                      <CheckCircle2 className="text-[#00ff00] flex-shrink-0" size={24} />
                      <div>
                        <h3 className="text-[#00ff00] font-bold text-sm">Market Deployed Successfully!</h3>
                        <p className="text-[#00ff00]/80 text-xs mt-1">Your prediction market is now live on the blockchain.</p>
                      </div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-[#00ff00]/20 rounded p-3 font-mono text-xs">
                      <p className="text-[#888888] mb-1">Transaction Hash:</p>
                      <p className="text-[#00ff00] break-all">{deployment.txHash}</p>
                      {deployment.blockNumber && (
                        <>
                          <p className="text-[#888888] mt-2 mb-1">Block Number:</p>
                          <p className="text-[#00ffff]">{deployment.blockNumber}</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    className="bg-[#00ff00] text-[#000000] hover:bg-[#00ff00]/90 font-bold flex-1 flex items-center justify-center gap-2"
                    onClick={handleDeployMarket}
                    disabled={deployment.isDeploying || !!deployment.txHash || isEditMode}
                  >
                    {deployment.isDeploying ? (
                      <>
                        <Spinner className="text-[#000000]" />
                        Deploying...
                      </>
                    ) : deployment.txHash ? (
                      <>
                        <CheckCircle2 size={18} />
                        Deployed
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        Deploy Market (0.011 KITE)
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#1a1a1a] text-white hover:bg-[#1a1a1a] flex-1"
                    onClick={() => {
                      setDraft(null);
                      setPrompt('');
                      setHasSubmitted(false);
                      setDeployment({ isDeploying: false, deployError: null, txHash: null });
                      setIsEditMode(false);
                    }}
                    disabled={deployment.isDeploying}
                  >
                    Start New
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!hasSubmitted && !draft && (
              <div className="text-center py-12 border-2 border-dashed border-[#1a1a1a] rounded-lg">
                <Zap size={48} className="text-[#333333] mx-auto mb-4" />
                <p className="text-[#888888] max-w-sm mx-auto">
                  Enter a market prompt above and click "Generate Draft" to create a new prediction market with AI-powered suggestions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
