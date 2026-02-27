'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Send, 
  Copy, 
  RefreshCw, 
  Trash2, 
  AlertCircle,
  Check
} from 'lucide-react';
import { generateCommentAction, generateCommentActionGemma } from './actions';

type ModelOption = 'gemini' | 'gemma';

export default function Home() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedComment, setGeneratedComment] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelOption>('gemma');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = async () => {
    if (generatedComment) {
      await navigator.clipboard.writeText(generatedComment);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateComment = async () => {
    const rawTitle = title.trim();
    const rawBody = body;
    let normalizedTitle = rawTitle;
    let normalizedBody = rawBody;

    if (!rawTitle && rawBody.trim()) {
      const bodyLines = rawBody.split(/\r?\n/);
      const firstLineIndex = bodyLines.findIndex((line) => line.trim().length > 0);

      if (firstLineIndex !== -1) {
        normalizedTitle = bodyLines[firstLineIndex].trim();
        normalizedBody = bodyLines
          .filter((_, index) => index !== firstLineIndex)
          .join('\n')
          .replace(/^\s*\n/, '');
        setTitle(normalizedTitle);
        setBody(normalizedBody);
      }
    }

    if (!normalizedTitle && !normalizedBody.trim() && !image) {
      setError('Please provide at least a title, body, or image.');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedComment('');

    try {
      const action =
        selectedModel === 'gemma'
          ? generateCommentActionGemma
          : generateCommentAction;

      const result = await action({
        title: normalizedTitle,
        body: normalizedBody,
        image:
          image && imagePreview
            ? {
                mimeType: image.type,
                data: imagePreview.split(',')[1],
              }
            : null,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.comment) {
        setGeneratedComment(result.comment);
      }
    } catch (err) {
      console.error('Error generating comment:', err);
      setError('Failed to generate comment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">
            <span className="text-orange-500">Reddit</span> Comment Gen
          </h1>
          <p className="text-zinc-400 text-lg">
            Generate authentic, human-sounding replies for any post.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <section className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                Post Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Model
                  </label>
                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-1">
                    <button
                      type="button"
                      onClick={() => setSelectedModel('gemini')}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        selectedModel === 'gemini'
                          ? 'bg-orange-600 text-white'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      Gemini
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedModel('gemma')}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        selectedModel === 'gemma'
                          ? 'bg-orange-600 text-white'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      Gemma
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-zinc-400 mb-1">
                    Post Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., AITA for eating my roommate's yogurt?"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-zinc-400 mb-1">
                    Post Body (Optional)
                  </label>
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Paste the post content here..."
                    rows={6}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Image (Optional)
                  </label>
                  
                  {!imagePreview ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500/50 hover:bg-zinc-900 transition-all group"
                    >
                      <ImageIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2 group-hover:text-orange-500 transition-colors" />
                      <p className="text-sm text-zinc-500">Click to upload an image</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-800 group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-red-500/80 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={generateComment}
                disabled={isLoading}
                className="w-full mt-6 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Generate Comment
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Output Section */}
          <section>
            <div className="h-full bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-zinc-500">Result</span>
              </h2>
              
              <div className="flex-grow flex flex-col">
                <AnimatePresence mode="wait">
                  {generatedComment ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 relative group"
                    >
                      <div className="font-mono text-sm text-zinc-500 mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500"></div>
                        <span className="font-bold text-zinc-300">u/ai_commenter</span>
                        <span>•</span>
                        <span>just now</span>
                      </div>
                      
                      <p className="text-zinc-100 text-lg leading-relaxed whitespace-pre-wrap">
                        {generatedComment}
                      </p>

                      <div className="mt-6 flex items-center gap-4 border-t border-zinc-900 pt-4">
                        <button 
                          onClick={copyToClipboard}
                          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          {copied ? 'Copied!' : 'Copy Text'}
                        </button>
                        
                        <button 
                          onClick={generateComment}
                          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-orange-400 transition-colors ml-auto cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Try Again
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-grow flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800/50 rounded-xl p-8"
                    >
                      <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-center max-w-xs">
                        Enter post details and click generate to see the AI&apos;s response here.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>
        
        <footer className="mt-12 text-center text-zinc-600 text-sm">
          <p>
            Powered by {selectedModel === 'gemma' ? 'Gemma 3 27B (NVIDIA)' : 'Gemini 3 Flash'} • Built with Next.js
          </p>
        </footer>
      </div>
    </main>
  );
}
