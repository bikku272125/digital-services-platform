import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Download,
  Send,
  Upload,
  Image as ImageIcon,
  Type,
  Palette,
  Maximize2,
  Undo2,
  RotateCcw,
  CheckCircle,
  Eye,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { posterAPI } from '../../api/client';

export default function PosterLiveEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const posterCanvasRef = useRef(null);

  // Categories & Templates
  const [categories, setCategories] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Active theme / layout preset
  const [theme, setTheme] = useState('panchayat'); // 'panchayat' | 'birthday' | 'business' | 'festival' | 'wedding' | 'education'

  // Editable Poster Elements State
  const [aspectRatio, setAspectRatio] = useState('1/1'); // '1/1' | '4/5' | '9/16'
  const [badgeText, setBadgeText] = useState('ग्राम पंचायत चुनाव 2026');
  const [headingText, setHeadingText] = useState('कर्मठ, जुझारू एवं योग्य प्रत्याशी');
  const [subheadingText, setSubheadingText] = useState('ग्राम सभा के सर्वांगीण विकास एवं जनसेवा हेतु');
  const [candidateName, setCandidateName] = useState('श्री बृजेश कुमार यादव');
  const [symbolText, setSymbolText] = useState('चुनाव चिन्ह: कलम-दवात');
  const [sloganText, setSloganText] = useState('विकास ही संकल्प, सेवा ही धर्म');
  const [contactNumber, setContactNumber] = useState('+91 9161420942');
  const [footerText, setFooterText] = useState('समस्त ग्रामवासी | वार्ड संख्या 12');

  // Styling customizers
  const [primaryColor, setPrimaryColor] = useState('#b45309'); // Amber 700
  const [secondaryColor, setSecondaryColor] = useState('#78350f'); // Amber 900
  const [textColor, setTextColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#fef08a'); // Yellow 200

  // Images state
  const [candidatePhoto, setCandidatePhoto] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  );
  const [logoPhoto, setLogoPhoto] = useState(null);

  // Customer order submission modal / drawer state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    posterAPI.getCategories()
      .then(res => setCategories(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingInitial(false));

    // Preset selection based on query param
    const preset = searchParams.get('preset');
    if (preset) {
      applyPreset(preset);
    }
  }, [searchParams]);

  const applyPreset = (presetKey) => {
    setTheme(presetKey);
    switch (presetKey) {
      case 'panchayat':
        setBadgeText('ग्राम पंचायत चुनाव 2026');
        setHeadingText('कर्मठ, जुझारू एवं योग्य प्रत्याशी');
        setSubheadingText('ग्राम सभा के सर्वांगीण विकास एवं जनसेवा हेतु');
        setCandidateName('श्री बृजेश कुमार यादव');
        setSymbolText('चुनाव चिन्ह: कलम-दवात');
        setSloganText('विकास ही संकल्प, सेवा ही धर्म');
        setFooterText('समस्त ग्रामवासी | वार्ड संख्या 12');
        setPrimaryColor('#d97706'); // warm amber
        setSecondaryColor('#7c2d12'); // deep reddish brown
        setAccentColor('#fef08a');
        setCandidatePhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');
        break;

      case 'birthday':
        setBadgeText('HAPPY BIRTHDAY');
        setHeadingText('जन्मदिन की हार्दिक शुभकामनाएं');
        setSubheadingText('ईश्वर आपको सदैव स्वस्थ, दीर्घायु एवं प्रसन्न रखे');
        setCandidateName('प्रिय रोहन यादव');
        setSymbolText('Date: 15 नवम्बर 2026');
        setSloganText('May your day be filled with joy and success!');
        setFooterText('शुभकामनाएं: समस्त परिवार एवं मित्रगण');
        setPrimaryColor('#ec4899'); // Pink
        setSecondaryColor('#831843'); // Deep Rose
        setAccentColor('#fde047');
        setCandidatePhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
        break;

      case 'business':
        setBadgeText('GRAND OPENING • 50% OFF');
        setHeadingText('भव्य शुभारंभ एवं विशेष छूट');
        setSubheadingText('उच्च गुणवत्ता एवं आकर्षक उपहार प्रत्येक खरीद पर');
        setCandidateName('यादव इलेक्ट्रॉनिक्स & होम एप्लायंसेज');
        setSymbolText('ऑफर: 1 से 10 नवम्बर तक');
        setSloganText('आपकी संतुष्टि ही हमारा विश्वास');
        setFooterText('मेन मार्केट, निकट बस स्टैंड, गोरखपुर | Call: +91 9161420942');
        setPrimaryColor('#2563eb'); // Royal Blue
        setSecondaryColor('#0f172a'); // Midnight
        setAccentColor('#fbbf24');
        setCandidatePhoto('https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=400&q=80');
        break;

      case 'festival':
        setBadgeText('शुभ दीपावली महोत्सव');
        setHeadingText('दीपावली की हार्दिक मंगलकामनाएं');
        setSubheadingText('सुख, शांति और समृद्धि आपके जीवन में सदैव बनी रहे');
        setCandidateName('बृजेश यादव एवं समस्त परिवार');
        setSymbolText('दीपोत्सव पर्व 2026');
        setSloganText('शुभ लाभ • समृद्धि • सफलता');
        setFooterText('आरध्या एनरटेक डिजिटल परिवार की ओर से सप्रेम भेंट');
        setPrimaryColor('#ea580c'); // Saffron orange
        setSecondaryColor('#450a0a'); // Deep maroon
        setAccentColor('#fde047');
        setCandidatePhoto('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80');
        break;

      case 'education':
        setBadgeText('ADMISSIONS OPEN 2026-27');
        setHeadingText('शिक्षा से सफलता की नई उड़ान');
        setSubheadingText('नर्सरी से 12वीं तक • स्मार्ट क्लासेस • अनुभवी शिक्षक');
        setCandidateName('सरस्वती विद्या मंदिर इंटर कॉलेज');
        setSymbolText('Helpline: +91 9161420942');
        setSloganText('अनुशासन, संस्कार एवं आधुनिक शिक्षा का संगम');
        setFooterText('आज ही संपर्क करें और अपने बच्चे का भविष्य संवारें');
        setPrimaryColor('#059669'); // Emerald Green
        setSecondaryColor('#064e3b'); // Forest Dark
        setAccentColor('#facc15');
        setCandidatePhoto('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80');
        break;

      default:
        break;
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setCandidatePhoto(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setLogoPhoto(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Instant HD Download using html2canvas
  const downloadPoster = async () => {
    if (!posterCanvasRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(posterCanvasRef.current, {
        scale: 2, // High resolution output
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `poster-studio-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download error', err);
      alert('Could not export canvas image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Submit live designed poster to backend orders API
  const handleOrderSubmission = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMsg('Please enter name, email, and phone.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Capture canvas as Blob
      const canvas = await html2canvas(posterCanvasRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const imageFile = new File([blob], `live-designed-poster.png`, { type: 'image/png' });

      const defaultCategory = categories[0]?.id || 1;
      const formData = new FormData();
      formData.append('customer_name', customerName);
      formData.append('email', customerEmail);
      formData.append('phone', customerPhone);
      formData.append('customer_type', 'INDIVIDUAL');
      formData.append('category', defaultCategory);
      formData.append('heading', headingText);
      formData.append('content', `${subheadingText} | ${candidateName} | ${symbolText} | ${sloganText}`);
      formData.append('language', 'BOTH');
      formData.append('output_size', aspectRatio === '1/1' ? 'WHATSAPP' : aspectRatio === '9/16' ? 'INSTAGRAM_STORY' : 'A4');
      formData.append('output_format', 'PNG');
      formData.append('privacy_consent', 'true');
      formData.append('reference_images', imageFile);

      const res = await posterAPI.createOrder(formData);

      if (res.data && res.data.order) {
        navigate('/poster-studio/order-success', {
          state: {
            order: res.data.order,
            reference: res.data.order.public_reference,
            customer_name: customerName,
            email: customerEmail,
          }
        });
      }
    } catch (err) {
      console.error('Order submission error', err);
      setErrorMsg(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top App Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/poster-studio"
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            ← Exit Editor
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-sm tracking-tight text-white">Live Poster Studio</span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Interactive
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={downloadPoster}
            disabled={downloading}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>{downloading ? 'Exporting...' : 'Download HD PNG'}</span>
          </button>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Order Professional Finishing</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Controls + Right Live Canvas */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Customization Sidebar */}
        <div className="lg:col-span-5 bg-slate-950/80 border-r border-slate-800 p-5 sm:p-6 overflow-y-auto max-h-[calc(100vh-60px)] space-y-6">
          {/* Preset Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1. Choose Theme Preset</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'panchayat', name: 'Panchayat & Election' },
                { id: 'birthday', name: 'Birthday Wishes' },
                { id: 'business', name: 'Shop & Discount' },
                { id: 'festival', name: 'Diwali / Festival' },
                { id: 'education', name: 'School Admission' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition border ${
                    theme === p.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-inner'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>2. Dimensions / Aspect Ratio</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '1/1', label: 'Square (1:1)', sub: 'WhatsApp & Insta' },
                { id: '4/5', label: 'Portrait (4:5)', sub: 'Feed Post' },
                { id: '9/16', label: 'Story (9:16)', sub: 'Status & Reel' },
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setAspectRatio(r.id)}
                  className={`p-2 rounded-xl text-xs font-semibold text-center transition border ${
                    aspectRatio === r.id
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div>{r.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{r.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Candidate Photo / Logo */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>3. Upload Photos</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative border border-dashed border-slate-700 rounded-xl p-3 text-center bg-slate-900/60 hover:border-indigo-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  id="canvas-photo-input"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="canvas-photo-input" className="cursor-pointer block">
                  <div className="w-10 h-10 mx-auto rounded-full overflow-hidden bg-slate-800 mb-2 border border-slate-700">
                    <img src={candidatePhoto} alt="Upload" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-400">Change Photo</span>
                </label>
              </div>

              <div className="relative border border-dashed border-slate-700 rounded-xl p-3 text-center bg-slate-900/60 hover:border-indigo-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  id="canvas-logo-input"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <label htmlFor="canvas-logo-input" className="cursor-pointer block">
                  <div className="w-10 h-10 mx-auto rounded-lg overflow-hidden bg-slate-800 mb-2 flex items-center justify-center border border-slate-700">
                    {logoPhoto ? (
                      <img src={logoPhoto} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <Upload className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-400">
                    {logoPhoto ? 'Change Logo' : 'Add Logo'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Text & Content Customizers */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-400" />
              <span>4. Edit Hindi / English Text</span>
            </label>

            <div>
              <span className="text-[11px] text-slate-400">Top Badge / Tag</span>
              <input
                type="text"
                value={badgeText}
                onChange={e => setBadgeText(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white mt-1"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400">Main Heading / Title</span>
              <input
                type="text"
                value={headingText}
                onChange={e => setHeadingText(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white mt-1"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400">Person / Shop Name</span>
              <input
                type="text"
                value={candidateName}
                onChange={e => setCandidateName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white mt-1"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400">Subheading / Description</span>
              <textarea
                rows={2}
                value={subheadingText}
                onChange={e => setSubheadingText(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400">Symbol / Offer</span>
                <input
                  type="text"
                  value={symbolText}
                  onChange={e => setSymbolText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white mt-1"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Phone / WhatsApp</span>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white mt-1"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-400">Slogan / Motivation</span>
              <input
                type="text"
                value={sloganText}
                onChange={e => setSloganText(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white mt-1"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400">Footer / Address</span>
              <input
                type="text"
                value={footerText}
                onChange={e => setFooterText(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-indigo-500 text-white mt-1"
              />
            </div>
          </div>

          {/* Color Palettes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>5. Background & Accent Colors</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Primary</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Gradient End</span>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Accent Gold</span>
                <input
                  type="color"
                  value={accentColor}
                  onChange={e => setAccentColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Poster Interactive Canvas Preview */}
        <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-8 flex items-center justify-center overflow-auto">
          <div className="w-full max-w-lg">
            {/* Live Canvas Render Target */}
            <div
              ref={posterCanvasRef}
              style={{
                aspectRatio: aspectRatio,
                background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
              }}
              className="w-full rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden transition-all duration-300 border border-white/20"
            >
              {/* Background ambient lighting overlay */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-black/20 rounded-full blur-3xl pointer-events-none"></div>

              {/* Header Badge */}
              <div className="flex items-center justify-between relative z-10">
                <div className="inline-block px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs sm:text-sm font-extrabold tracking-wide uppercase shadow">
                  {badgeText}
                </div>
                {logoPhoto && (
                  <div className="w-10 h-10 rounded-lg bg-white/90 p-1 flex items-center justify-center shadow">
                    <img src={logoPhoto} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              {/* Main Center Content */}
              <div className="my-auto text-center space-y-4 py-4 relative z-10">
                {/* Photo Portrait Frame */}
                {candidatePhoto && (
                  <div className="relative mx-auto w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 shadow-2xl overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, #ffffff)` }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-white">
                      <img
                        src={candidatePhoto}
                        alt={candidateName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Candidate / Entity Name */}
                <h2
                  style={{ color: accentColor }}
                  className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md"
                >
                  {candidateName}
                </h2>

                {/* Heading / Slogan */}
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug drop-shadow">
                  {headingText}
                </h3>

                {/* Subheading text */}
                <p className="text-xs sm:text-sm text-slate-100/90 max-w-sm mx-auto leading-relaxed drop-shadow">
                  {subheadingText}
                </p>

                {/* Symbol / Key Highlight Badge */}
                {symbolText && (
                  <div className="inline-block px-4 py-1.5 rounded-xl bg-black/35 backdrop-blur-md text-xs sm:text-sm font-bold border border-white/20 shadow">
                    {symbolText}
                  </div>
                )}
              </div>

              {/* Footer Banner */}
              <div className="pt-4 border-t border-white/20 text-center relative z-10 space-y-1">
                <div className="text-xs sm:text-sm font-bold tracking-wide" style={{ color: accentColor }}>
                  {sloganText}
                </div>
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-200">
                  <span>{footerText}</span>
                  {contactNumber && <span>📞 {contactNumber}</span>}
                </div>
              </div>
            </div>

            {/* Quick helper note under canvas */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WYSIWYG Live Preview</span>
              </span>
              <span>Click 'Download HD PNG' or 'Order Professional Finishing'</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit To Professional Finishing Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-100">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Submit Design for Pro Finishing</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Our graphic designers will take your live created layout, enhance the resolution in Canva / Photoshop, refine the Hindi typography, and deliver print-ready files.
            </p>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleOrderSubmission} className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brijesh Kumar Yadav"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. bikkuyadav9190@gmail.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile / WhatsApp Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 9161420942"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow"
                >
                  {submitting ? 'Submitting...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
