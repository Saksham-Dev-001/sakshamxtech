import React, { useState } from 'react';
import { 
  Sparkles, 
  Youtube, 
  CheckCircle2, 
  Terminal, 
  Cloud, 
  Award, 
  Users, 
  ExternalLink,
  ArrowRight,
  Mail,
  Send,
  Building2,
  TrendingUp,
  Target,
  ShieldCheck,
  Check,
  Gift,
  FileText,
  Megaphone,
  Briefcase,
  HelpCircle,
  Clock,
  Laptop
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/shared/SEOHead';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { siteSettings, trackEvent } = useApp();

  // Collab Form State
  const [collabForm, setCollabForm] = useState({
    name: '',
    company: '',
    email: '',
    collabType: 'Dedicated YouTube Video',
    budget: '$300 - $600',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleCollabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('opportunity', `Collab Inquiry: ${collabForm.company} (${collabForm.collabType})`);
    
    // Construct prefilled email
    const subject = encodeURIComponent(`[Sponsorship Inquiry] ${collabForm.company} x SakshamXTech`);
    const body = encodeURIComponent(
      `Hi Saksham,\n\nI would like to discuss a collaboration with SakshamXTech.\n\n` +
      `• Brand / Company: ${collabForm.company}\n` +
      `• Contact Person: ${collabForm.name}\n` +
      `• Email: ${collabForm.email}\n` +
      `• Collaboration Type: ${collabForm.collabType}\n` +
      `• Proposed Budget: ${collabForm.budget}\n\n` +
      `Details:\n${collabForm.message}\n\nLooking forward to hearing from you!`
    );
    window.location.href = `mailto:${siteSettings.adminEmail}?subject=${subject}&body=${body}`;
    setFormSubmitted(true);
  };

  const milestones = [
    { year: '2023', title: 'SakshamXTech Founded', desc: 'Started creating Google Cloud Arcade walkthroughs and breaking down complex Qwiklabs tasks for engineering students.' },
    { year: '2024', title: 'Community Surpasses 20,000 Students', desc: 'Expanded into daily Unstop Problem of the Day algorithmic solutions across multiple programming languages.' },
    { year: '2025', title: 'C Academy Lecture Series', desc: 'Introduced deep-dive systems programming, memory allocation, and pointers curriculum.' },
    { year: '2026', title: 'Unified SakshamXTech Platform Launch', desc: 'Complete ecosystem integrating Cloud Arcade, POTD, interactive C playground, opportunities, and swag trackers.' },
  ];

  const partnershipDeliverables = [
    {
      icon: <Youtube className="w-6 h-6 text-red-600" />,
      title: 'Dedicated YouTube Video Tutorial',
      badge: 'Most Popular',
      desc: 'An in-depth 10–18 minute dedicated walkthrough covering your tool, platform, API, or hackathon. Includes live setup and student registration guidance.',
      deliverables: ['100% Dedicated coverage', 'Pinned comment with custom tracking link', 'Permanent video link in website blog', 'Push notification to all subscribers'],
    },
    {
      icon: <Megaphone className="w-6 h-6 text-amber-600" />,
      title: 'Integrated Video Segment (60-90s)',
      badge: 'High ROI',
      desc: 'Seamless mid-roll or pre-roll sponsor shoutout embedded into trending Google Cloud Arcade or Unstop POTD video tutorials.',
      deliverables: ['Natural transition from tutorial', 'Direct call to action with custom discount / link', 'Included in top 3 video description links', '20K+ guaranteed initial impressions'],
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: 'Featured Website Article & SEO Blog',
      badge: 'Long-term SEO',
      desc: 'Permanent technical article on SakshamXTech.com with step-by-step instructions, official registration buttons, and backlink to your product.',
      deliverables: ['High-ranking SEO article', 'Dedicated "Official Link" hero action card', 'Permanent index on Google Search', 'Featured on homepage carousel'],
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      title: 'Community Broadcast (Telegram & Discord)',
      badge: 'Instant Engagement',
      desc: 'Direct announcement blast to over 20,000+ active collegiate developers and cloud learners eager for hackathons and student licenses.',
      deliverables: ['Telegram Channel announcement', 'Discord Community @everyone ping', 'Direct link click tracking', 'Community Q&A and FAQ support'],
    },
  ];

  return (
    <div className="py-8 max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-12">
      <SEOHead
        title="About Saksham Sharma & SakshamXTech | Brand Partnerships & Collabs"
        description="Meet Saksham Sharma, Founder of SakshamXTech. Explore channel reach, brand sponsorship opportunities, developer audience demographics, and contact details."
      />

      {/* 1. CREATOR HERO PROFILE CARD */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-slate-950/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Creator Portrait */}
          <div className="relative shrink-0">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-red-500 dark:border-red-400 shadow-xl shadow-red-500/20 bg-slate-900">
              <img
                src={siteSettings.creatorAvatarUrl}
                alt={siteSettings.creatorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs shadow-lg flex items-center gap-1 border border-white/20">
              <Youtube className="w-3.5 h-3.5 fill-white" />
              <span>Verified Creator</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 dark:bg-red-950/60 dark:border-red-900/40 dark:text-red-400 text-xs font-mono font-bold">
              YOUTUBE CREATOR • CLOUD EDUCATOR • DEVELOPER
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Saksham Sharma
            </h1>

            <p className="text-xs sm:text-sm font-bold text-blue-600 dark:text-cyan-400">
              {siteSettings.creatorTitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1 max-w-2xl">
              Founder of SakshamXTech, empowering 50,000+ engineering students across India with Google Cloud Arcade solutions, daily algorithmic problem breakdowns, systems programming in C, and verified swag campaigns.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              <a
                href={`${siteSettings.socialLinks.youtube}?sub_confirmation=1`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 text-xs font-black bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all flex items-center gap-2 shadow-md shadow-red-500/20 cursor-pointer"
              >
                <Youtube className="w-4 h-4 fill-white" />
                <span>Subscribe on YouTube</span>
              </a>

              <a
                href="#collab-section"
                className="px-5 py-2.5 text-xs font-bold bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Brand Sponsorships &amp; Collabs</span>
              </a>

              <a
                href={siteSettings.socialLinks.telegram}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl transition-colors cursor-pointer"
              >
                Telegram Community
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE IMPACT & STATISTICS COUNTERS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 font-mono">
            {siteSettings.statistics.youtubeSubscribers || '13.5K+'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">YouTube Subscribers</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {siteSettings.statistics.studentCommunity || '50,000+'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">Students Reached</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {siteSettings.statistics.technicalSolutions || '450+'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">Tutorials &amp; Labs</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
            500+
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">Swag Kits Claimed</p>
        </div>
      </div>

      {/* 3. CORE MISSION & FOUR PILLARS */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            What SakshamXTech Delivers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real practical skills, verified cloud certifications, and career opportunities for tech students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-cyan-950 border border-blue-200 dark:border-cyan-500/40 flex items-center justify-center text-blue-600 dark:text-cyan-400">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google Cloud Arcade</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Step-by-step Qwiklabs and Cloud Shell commands so students can complete skill badges effortlessly.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Unstop POTD</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Clean, tested multi-language code solutions (C, C++, Java, Python) with time-complexity breakdown.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verified Swags &amp; Goodies</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              100% legitimate tech goodies from Microsoft, Salesforce, GFG, and Google — zero fake clickbait.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">C Academy &amp; Systems</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Memory allocation, pointers, compiler architecture, and low-level system programming.
            </p>
          </div>
        </div>
      </div>

      {/* 4. BRAND COLLABORATION & SPONSORSHIPS SECTION */}
      <div id="collab-section" className="scroll-mt-12 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Open for Tech Brands, Developer Tools &amp; EdTech</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight max-w-2xl">
            Partner with SakshamXTech &amp; Reach 50,000+ Engaged Developers
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Looking to promote your developer SaaS, cloud platform, hackathon, tech certification, or hardware product? SakshamXTech provides authentic, trusted technical reviews that drive real signups and engagement.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> High-Trust Organic Audience</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> 85% CS / Engineering Students</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Fast 3-5 Day Turnaround</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Comprehensive Analytics Report</span>
          </div>
        </div>

        {/* Deliverables Grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Partnership Packages &amp; Deliverables
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnershipDeliverables.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {item.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Included Deliverables:</span>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {item.deliverables.map((d, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Audience Demographics &amp; Insights</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Primary Age Group</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">18 – 24 Years</p>
              <p className="text-[11px] text-slate-400 mt-1">Undergraduate B.Tech, BCA, MCA and fresh computer science graduates.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Top Interests</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">Cloud &amp; Coding</p>
              <p className="text-[11px] text-slate-400 mt-1">Google Cloud, AWS, DSA algorithms, developer tools, AI/ML, hackathons.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Geographic Reach</p>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-1">India &amp; Global</p>
              <p className="text-[11px] text-slate-400 mt-1">Tier 1 &amp; Tier 2 engineering colleges across India (IITs, NITs, IIITs &amp; State Universities).</p>
            </div>
          </div>
        </div>

        {/* Official Collaboration Inquiry Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-600" />
                <span>Submit a Collaboration Inquiry</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Fill out the proposal details below to connect directly with Saksham Sharma. Average response time is within 12 hours.
              </p>
            </div>

            <a
              href={`mailto:${siteSettings.adminEmail}?subject=Direct%20Sponsorship%20Proposal`}
              className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Mail className="w-3.5 h-3.5 text-red-600" />
              <span>{siteSettings.adminEmail}</span>
            </a>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-300">
                Inquiry Prepared &amp; Sent!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
                Thank you for reaching out. Your default email client was opened with the proposal. You can also reach out directly on Telegram at <strong>@SakshamXTech</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCollabSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={collabForm.name}
                    onChange={(e) => setCollabForm({ ...collabForm, name: e.target.value })}
                    placeholder="e.g. John Doe / Marketing Lead"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Company / Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={collabForm.company}
                    onChange={(e) => setCollabForm({ ...collabForm, company: e.target.value })}
                    placeholder="e.g. Google Cloud, Appwrite, GeeksforGeeks"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Work Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={collabForm.email}
                    onChange={(e) => setCollabForm({ ...collabForm, email: e.target.value })}
                    placeholder="partner@company.com"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Collaboration Type
                  </label>
                  <select
                    value={collabForm.collabType}
                    onChange={(e) => setCollabForm({ ...collabForm, collabType: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Dedicated YouTube Video">Dedicated YouTube Video</option>
                    <option value="Integrated Video Segment (60-90s)">Integrated Video Segment (60-90s)</option>
                    <option value="Featured Website Article & Blog">Featured Website Article &amp; Blog</option>
                    <option value="Community Broadcast (Telegram & Discord)">Community Broadcast (Telegram &amp; Discord)</option>
                    <option value="Hackathon / Contest Sponsorship">Hackathon / Contest Sponsorship</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Estimated Budget Range
                  </label>
                  <select
                    value={collabForm.budget}
                    onChange={(e) => setCollabForm({ ...collabForm, budget: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="$200 - $400">$200 - $400</option>
                    <option value="$400 - $800">$400 - $800</option>
                    <option value="$800 - $1500">$800 - $1500</option>
                    <option value="$1500+">$1500+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Campaign Brief / Proposal
                </label>
                <textarea
                  rows={4}
                  required
                  value={collabForm.message}
                  onChange={(e) => setCollabForm({ ...collabForm, message: e.target.value })}
                  placeholder="Tell us about your product, campaign goals, key features to highlight, and desired launch dates..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
                <span className="text-[11px] text-slate-400">
                  ⚡ All inquiries receive an executive response within 24 business hours.
                </span>

                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Collaboration Proposal</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sponsor FAQs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Sponsorship &amp; Collaboration FAQs</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">What is the production turnaround time?</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Standard turnaround is 3 to 5 business days after product access and script points approval. Rush turnarounds (48h) are available upon request.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Do you provide performance analytics?</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes! We share detailed 7-day and 30-day metrics reports including YouTube views, watch time, audience retention, and tracking link clicks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">What types of products do you promote?</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We accept cloud platforms, developer tools, AI/ML APIs, hackathons, coding contests, developer hardware, student software packs, and verified swag campaigns.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">How do we get started?</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Fill the form above or email us at <strong>{siteSettings.adminEmail}</strong> with your brief. We'll reply with available calendar dates and rate card!
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 5. JOURNEY TIMELINE */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          <span>The SakshamXTech Journey</span>
        </h3>

        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4">
          {milestones.map((m, i) => (
            <div key={i} className="relative pl-6">
              <span className="absolute -left-2.5 top-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-red-500 dark:border-red-400 flex items-center justify-center shadow-sm" />
              <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">{m.year}</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{m.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
