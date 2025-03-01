import React, { useState, useEffect } from 'react';
import { Copy, Sparkles, HelpCircle, Mail } from 'lucide-react';

function App() {
  const [feedback, setFeedback] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [showEmailPopup, setShowEmailPopup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Use proper API endpoint instead of direct MongoDB connection
  const apiUrl = "https://ui-feedback.onrender.com";  // Use absolute URL during development

  useEffect(() => {
    // Check if email exists in localStorage
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setIsEmailSubmitted(true);
    } else {
      // Show popup immediately
      setShowEmailPopup(true);
    }
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting to API:", apiUrl);
      
      // Send email to backend API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Store email in localStorage
        localStorage.setItem('userEmail', email);
        setIsEmailSubmitted(true);
        setShowEmailPopup(false);
        setEmailError('');
      } else {
        setEmailError(data.error || 'Failed to submit email. Please try again.');
      }
      
    } catch (error) {
      console.error('Error submitting email:', error);
      setEmailError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackPrompts = [
    "Try increasing the contrast for better readability.",
    "Consider using a grid system for better alignment.",
    "Add more whitespace to make it less cluttered.",
    "Experiment with a different color palette for better mood setting.",
    "Simplify your navigation to improve user flow.",
    "Use consistent spacing between elements.",
    "Consider adding subtle animations for better user engagement.",
    "Ensure text is legible on all background colors.",
    "Check your design for accessibility compliance.",
    "Try a different font pairing for better hierarchy.",
    "Reduce the number of competing visual elements.",
    "Ensure your call-to-action buttons stand out.",
    "Consider using icons to enhance visual communication.",
    "Test your UI with different screen sizes for responsiveness.",
    "Add subtle shadows to create depth in your interface.",
    "Ensure your color choices convey the right emotion for your brand.",
    "Consider using fewer fonts for a more cohesive look.",
    "Check if your UI maintains visual hierarchy effectively.",
    "Try using the 60-30-10 color rule for better balance.",
    "Ensure there's enough padding inside interactive elements,",
    "Use consistent iconography for a cohesive design.",
    "Ensure clickable elements are easily tappable on mobile.",
    "Test color contrast for accessibility compliance.",
    "Align text and images for better visual harmony.",
    "Use a consistent grid system throughout your design.",
    "Consider using micro-interactions to delight users.",
    "Avoid using too many bright colors; they can overwhelm users.",
    "Use whitespace strategically to guide user focus.",
    "Ensure all images are optimized for faster loading.",
    "Check for consistent alignment across all sections.",
    "Use hover states to indicate interactivity.",
    "Maintain consistent padding and margin for a balanced layout.",
    "Consider breaking long paragraphs into smaller chunks.",
    "Use a consistent button style for better usability.",
    "Test font sizes on different devices for readability.",
    "Ensure your primary action is the most visually prominent.",
    "Use breadcrumbs for easier navigation in deep hierarchies.",
    "Check if the UI follows the principle of least surprise.",
    "Experiment with different layouts for better engagement.",
    "Make sure your loading animations are not too distracting.",
    "Ensure all links are easily distinguishable from text.",
    "Keep forms short and easy to complete.",
    "Use contrasting colors for error and success messages.",
    "Add a progress bar for multi-step processes.",
    "Ensure consistent border-radius for rounded elements.",
    "Test your design with real content for better context.",
    "Use placeholder text that guides users effectively.",
    "Ensure there's a clear visual hierarchy on every screen.",
    "Make sure all interactive elements are accessible by keyboard.",
    "Consider using illustrations to add personality.",
    "Ensure consistent use of drop shadows for depth.",
    "Use color psychology to influence user behavior.",
    "Check that all text is legible against background images.",
    "Keep navigation options minimal for better focus.",
    "Ensure that animations enhance, not distract from UX.",
    "Use cards to organize related content cleanly.",
    "Try using a sticky header for better navigation.",
    "Ensure all icons are labeled for accessibility.",
    "Test your design's usability with real users.",
    "Ensure consistent hover and active states for buttons.",
    "Add a search bar for content-heavy interfaces.",
    "Use contrasting colors for better call-to-action visibility.",
    "Check that input fields are clearly distinguishable.",
    "Ensure form validation messages are clear and helpful.",
    "Optimize for touch gestures on mobile devices.",
    "Use visual anchors to guide the user's eye movement.",
    "Add animations to create a sense of continuity.",
    "Ensure there's a logical flow between interactive steps.",
    "Make sure modal windows are easily dismissible.",
    "Test your UI in both light and dark modes.",
    "Ensure icons are intuitive and universally understood.",
    "Use storytelling elements to engage users emotionally.",
    "Add subtle loading indicators for asynchronous actions.",
    "Use real-world metaphors to make UI intuitive.",
    "Ensure consistent use of typography scales.",
    "Check if your UI communicates brand identity clearly.",
    "Use tooltips to provide additional context without clutter.",
    "Ensure focus states are clear for accessibility users.",
    "Add error prevention measures to minimize user mistakes.",
    "Make sure feedback is provided for every action.",
    "Consider using collapsible sections to save space.",
    "Ensure consistent use of visual metaphors."
  ];

  const generateFeedback = () => {
    const randomIndex = Math.floor(Math.random() * feedbackPrompts.length);
    setFeedback(feedbackPrompts[randomIndex]);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (feedback) {
      navigator.clipboard.writeText(feedback)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Email Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full animate-fade-in">
            <p className="text-gray-600 mb-6">
              <b>Spark Some UI Feedback! ✨</b>
            </p>
            
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Magic Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className={`w-full pl-10 pr-4 py-2 border ${emailError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2`}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-500 hover:bg-indigo-600'} text-white font-medium rounded-lg transition-colors flex items-center justify-center`}
              >
                {isSubmitting ? 'Submitting...' : "Let's Go"}
              </button>
              
              <p className="mt-4 text-xs text-gray-500 text-center">
                We promise - No Spam, Just UI-Inspiration!
              </p>
            </form>
          </div>
        </div>
      )}
      
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 space-y-6 mt-16 pt-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800">UI Feedback Generator</h1>
        
        <button 
          onClick={generateFeedback}
          disabled={!isEmailSubmitted}
          className={`w-full py-3 px-4 ${isEmailSubmitted ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-indigo-300 cursor-not-allowed'} text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2`}
        >
          <Sparkles size={20} />
          Generate UI Feedback
        </button>
        
        {!isEmailSubmitted && (
          <p className="text-sm text-amber-600 text-center">
            Please provide your email to unlock feedback generation
          </p>
        )}
        
        <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] flex items-center justify-center">
          {feedback ? (
            <p className="text-gray-700 text-center">{feedback}</p>
          ) : (
            <p className="text-gray-400 text-center italic">Click the button above to generate feedback</p>
          )}
        </div>
        
        <button 
          onClick={copyToClipboard}
          disabled={!feedback || !isEmailSubmitted}
          className={`w-full py-2 px-4 ${feedback && isEmailSubmitted ? 'bg-gray-800 hover:bg-gray-900' : 'bg-gray-300 cursor-not-allowed'} text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2`}
        >
          <Copy size={18} />
          {copied ? 'Copied!' : 'Copy Feedback'}
        </button>
        
        {copied && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-sm">
            Feedback copied to clipboard!
          </div>
        )}

      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm mb-4">
          No Design Uploads Needed – Just Play and Practice with UI Feedback Ideas!
        </p>
      </div>
      
      <div className="mt-6 mb-8 relative">
        <div 
          className="cursor-help inline-flex items-center text-gray-500 text-sm"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <HelpCircle size={16} className="text-gray-400 hover:text-indigo-500 transition-colors mr-1" />
          <span className="text-indigo-500 font-medium">Why UI Feedback Generator?</span>
          
          {showTooltip && (
            <div className="absolute mt-2 p-5 bg-white rounded-lg shadow-lg text-sm text-gray-700 w-[90vw] max-w-2xl z-10 left-1/2 transform -translate-x-1/2">
              <p className="mb-3 leading-relaxed">
                Get quick ideas to break creative blocks and practice UI skills – no uploads, no mockups, no critiques. 
                Just fun prompts to play, experiment, and grow your design instincts. It's a safe space to learn, get inspired, and build confidence.
              </p>
              <p className="font-medium text-indigo-600">
                Made for UI Designers.
              </p>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="w-full mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <span className="text-gray-500 text-sm">
              © 2025 UI Feedback Generator
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
