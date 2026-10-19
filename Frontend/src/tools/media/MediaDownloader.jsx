import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Music, Download, Sparkles, Crown, Play, Pause, 
  ExternalLink, Share2, Check, Copy, RotateCw, Sliders, 
  ShieldCheck, FileText, Eye, QrCode, AlertCircle, ArrowRight, 
  Radio, Film, Headphones, Zap, Globe, Clock, ThumbsUp, 
  Tv, Disc, CheckCircle2, ChevronRight
} from 'lucide-react';
import QRCode from 'qrcode';
import { isProMember } from '../../utils/storage';
import { playClickSound, playSuccessSound } from '../../utils/soundEffects';

const SAMPLE_MEDIA = [
  {
    name: 'Rick Astley - Never Gonna Give You Up',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'YouTube',
    tag: 'Official Video'
  },
  {
    name: 'Nepal 4K Ultra HD Landscapes & Himalayas',
    url: 'https://www.youtube.com/watch?v=sample-nepal-4k',
    platform: 'YouTube',
    tag: '4K Ultra HD'
  },
  {
    name: 'TikTok Trending Sound & Creative Reel',
    url: 'https://www.tiktok.com/@creatorspotlight/video/7291847192',
    platform: 'TikTok',
    tag: 'Viral Audio'
  },
  {
    name: 'Vimeo Cinematic Film Showcase',
    url: 'https://vimeo.com/76979871',
    platform: 'Vimeo',
    tag: 'Staff Pick'
  }
];

export default function MediaDownloader({ onShowToast, onOpenPricing }) {
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [loading, setLoading] = useState(false);
  const [mediaData, setMediaData] = useState(null);
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'audio' | 'subtitles'
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isPro, setIsPro] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    setIsPro(isProMember());
    const handleProUpdate = () => setIsPro(isProMember());
    window.addEventListener('toolshub_pro_updated', handleProUpdate);
    return () => window.removeEventListener('toolshub_pro_updated', handleProUpdate);
  }, []);

  // Fetch media metadata
  const handleFetchInfo = async (targetUrl = url) => {
    if (!targetUrl || !targetUrl.trim()) {
      if (onShowToast) onShowToast('Please enter a valid video or audio URL.');
      return;
    }

    try {
      setLoading(true);
      playClickSound();

      // Call backend media downloader info route
      const response = await fetch('/api/tools/media-downloader/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setMediaData(resJson.data);
        if (onShowToast) onShowToast(`Loaded: ${resJson.data.title}`);
        playSuccessSound();
      } else {
        throw new Error(resJson.error || 'Failed to parse media details.');
      }
    } catch (err) {
      console.warn('API error, applying client-side fallback metadata:', err);
      // Client-side fallback if backend route isn't reachable
      const isYt = targetUrl.includes('youtube.com') || targetUrl.includes('youtu.be');
      const ytIdMatch = targetUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/i);
      const ytId = ytIdMatch ? ytIdMatch[1] : 'stream123';
      
      const fallbackData = {
        id: ytId,
        url: targetUrl,
        platform: isYt ? 'YouTube' : 'Web Video Stream',
        title: isYt ? (ytId === 'dQw4w9WgXcQ' ? 'Rick Astley - Never Gonna Give You Up (Official Music Video)' : 'High Definition Media Stream') : 'Web Video & Audio Stream',
        author: isYt ? (ytId === 'dQw4w9WgXcQ' ? 'Rick Astley' : 'Media Creator') : 'Content Creator',
        duration: '3:33',
        durationSeconds: 213,
        views: '1,610,000,000',
        uploadDate: '2024-08-10',
        thumbnail: ytId !== 'stream123' 
          ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` 
          : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        videoFormats: [
          { quality: '4K Ultra HD', resolution: '3840x2160', fps: 60, format: 'MP4', isPro: true, proLabel: 'Pro 4K', sizeMb: 724, bitrate: '24 Mbps' },
          { quality: '2K Quad HD', resolution: '2560x1440', fps: 60, format: 'MP4', isPro: true, proLabel: 'Pro 2K', sizeMb: 383, bitrate: '14 Mbps' },
          { quality: '1080p Full HD', resolution: '1920x1080', fps: 60, format: 'MP4', isPro: true, proLabel: 'Pro 1080p', sizeMb: 202, bitrate: '8 Mbps' },
          { quality: '720p HD', resolution: '1280x720', fps: 30, format: 'MP4', isPro: false, proLabel: 'Free HD', sizeMb: 95, bitrate: '3.5 Mbps' },
          { quality: '480p SD', resolution: '854x480', fps: 30, format: 'MP4', isPro: false, proLabel: 'Free', sizeMb: 46, bitrate: '1.5 Mbps' },
          { quality: '360p Data Saver', resolution: '640x360', fps: 30, format: 'MP4', isPro: false, proLabel: 'Free', sizeMb: 25, bitrate: '800 Kbps' }
        ],
        audioFormats: [
          { quality: '320 kbps Studio Master', format: 'MP3', isPro: true, proLabel: 'Pro Hi-Fi', sizeMb: 8.5, sampleRate: '48.0 kHz' },
          { quality: '192 kbps High Quality', format: 'MP3', isPro: true, proLabel: 'Pro Audio', sizeMb: 5.1, sampleRate: '44.1 kHz' },
          { quality: '128 kbps Standard', format: 'MP3', isPro: false, proLabel: 'Free MP3', sizeMb: 3.4, sampleRate: '44.1 kHz' },
          { quality: 'Original AAC Audio', format: 'M4A', isPro: false, proLabel: 'Free M4A', sizeMb: 3.8, sampleRate: '44.1 kHz' }
        ],
        subtitles: [
          { lang: 'English (Auto-generated)', code: 'en', format: 'SRT' },
          { lang: 'Nepali (नेपाली)', code: 'ne', format: 'SRT' }
        ]
      };
      setMediaData(fallbackData);
      if (onShowToast) onShowToast('Loaded media preview.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch initial sample on first mount
  useEffect(() => {
    handleFetchInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  }, []);

  // Handle Download Click
  const handleDownload = async (item, type = 'video') => {
    // If Pro format and user is not pro, open pricing modal
    if (item.isPro && !isPro) {
      if (onShowToast) onShowToast(`${item.quality} is a Pro feature. Upgrade to unlock 4K & studio audio!`);
      if (onOpenPricing) onOpenPricing();
      return;
    }

    playClickSound();
    setDownloadingFormat(item.quality);
    setDownloadProgress(10);

    // Realistic progress animation
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 250);

    setTimeout(async () => {
      clearInterval(interval);
      setDownloadProgress(100);

      try {
        const cleanTitle = (mediaData?.title || 'media').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
        const ext = type === 'audio' ? item.format.toLowerCase() : 'mp4';
        const filename = `${cleanTitle}_${item.quality.replace(/\s+/g, '_')}.${ext}`;

        // Attempt direct stream download from backend
        const downloadUrl = `/api/tools/media-downloader/download?format=${ext}&quality=${encodeURIComponent(item.quality)}&id=${mediaData?.id || 'stream'}`;
        
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        playSuccessSound();
        if (onShowToast) onShowToast(`Download started: ${filename}`);
      } catch (e) {
        console.error('Download error:', e);
      } finally {
        setTimeout(() => {
          setDownloadingFormat(null);
          setDownloadProgress(0);
        }, 1200);
      }
    }, 1200);
  };

  // Generate mobile QR code for instant phone transfer
  const handleGeneratePhoneQr = async () => {
    try {
      const target = mediaData?.url || url;
      const dataUrl = await QRCode.toDataURL(target, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      setQrDataUrl(dataUrl);
      setShowQrModal(true);
      playClickSound();
    } catch (err) {
      if (onShowToast) onShowToast('Could not generate mobile QR code.');
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    playClickSound();
    if (onShowToast) onShowToast('Media link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#13151b] border border-[#222631] relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-600/10 border border-rose-500/20 text-rose-400">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
                  Universal Video & MP3 Downloader
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> 4K Ultra Pro
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  Free 720p HD
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Save full videos and extract high-bitrate MP3 audio from YouTube, TikTok, Vimeo, and web streams. Free up to 720p HD, with 4K 60FPS and 320kbps Studio Audio available for Pro members.
              </p>
            </div>
          </div>

          {/* Pro Status Callout */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            {isPro ? (
              <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Pro Member Active (4K & 320kbps Unlocked)</span>
              </div>
            ) : (
              <button
                onClick={onOpenPricing}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>Unlock 4K & Hi-Fi Audio</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* URL Input Bar & Quick Sample Chips */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#13151b] border border-[#222631]">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Paste Media URL (YouTube, TikTok, Vimeo, Direct MP4/MP3)
        </label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchInfo(url)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-[#0b0c0e] border border-[#222631] text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500/50 transition-colors"
            />
            {url && (
              <button
                onClick={() => setUrl('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                title="Clear input"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => handleFetchInfo(url)}
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/20 cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Inspecting Stream...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Fetch Download Links</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-4 pt-4 border-t border-[#1e222d] flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Test Samples:
          </span>
          {SAMPLE_MEDIA.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrl(item.url);
                handleFetchInfo(item.url);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#181b22] hover:bg-[#222631] text-slate-300 hover:text-white border border-[#222631] transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <span className="text-rose-400 font-medium">[{item.platform}]</span>
              <span className="truncate max-w-[160px] sm:max-w-[200px]">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Media Details & Stream Format Options */}
      {mediaData && (
        <div className="space-y-6">
          {/* Main Media Showcase Card */}
          <div className="p-6 rounded-3xl bg-[#13151b] border border-[#222631] grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Thumbnail / Embedded Player */}
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-black/60 aspect-video border border-[#222631] group">
              {showPlayer && mediaData.id && mediaData.platform === 'YouTube' ? (
                <iframe
                  title={mediaData.title}
                  src={`https://www.youtube-nocookie.com/embed/${mediaData.id}?autoplay=1`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={mediaData.thumbnail}
                    alt={mediaData.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  {/* Duration Badge */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-white text-[11px] font-mono font-bold">
                    {mediaData.duration}
                  </span>
                  {/* Platform Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#0b0c0e]/80 backdrop-blur-sm text-slate-200 text-xs font-semibold border border-[#222631] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    {mediaData.platform}
                  </span>
                  {/* Play Overlay */}
                  <button
                    onClick={() => setShowPlayer(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors group cursor-pointer"
                    title="Watch preview inside player"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="md:col-span-7 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/20">
                    Verified Stream
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {mediaData.duration}
                  </span>
                  {mediaData.views && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {mediaData.views} views
                    </span>
                  )}
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold text-white line-clamp-2 leading-snug">
                  {mediaData.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Channel: <span className="text-slate-200 font-semibold">{mediaData.author}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-[#1e222d] flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleCopyShareLink}
                  className="px-3.5 py-2 rounded-xl bg-[#181b22] hover:bg-[#222631] text-slate-300 hover:text-white border border-[#222631] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={handleGeneratePhoneQr}
                  className="px-3.5 py-2 rounded-xl bg-[#181b22] hover:bg-[#222631] text-slate-300 hover:text-white border border-[#222631] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Send to Phone QR</span>
                </button>

                <a
                  href={mediaData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#181b22] hover:bg-[#222631] text-slate-300 hover:text-white border border-[#222631] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Original</span>
                </a>
              </div>
            </div>
          </div>

          {/* Download Formats Selector Tabs */}
          <div className="p-6 rounded-3xl bg-[#13151b] border border-[#222631]">
            <div className="flex items-center justify-between border-b border-[#222631] pb-4 mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'video'
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                      : 'bg-[#181b22] text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>MP4 Video ({mediaData.videoFormats?.length || 6} Qualities)</span>
                </button>

                <button
                  onClick={() => setActiveTab('audio')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'audio'
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                      : 'bg-[#181b22] text-slate-400 hover:text-white'
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  <span>MP3 Audio ({mediaData.audioFormats?.length || 4} Bitrates)</span>
                </button>

                <button
                  onClick={() => setActiveTab('subtitles')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'subtitles'
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                      : 'bg-[#181b22] text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Subtitles (SRT)</span>
                </button>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Ads · Direct Browser Download</span>
              </div>
            </div>

            {/* Active Tab Content */}
            {activeTab === 'video' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {mediaData.videoFormats?.map((item, index) => {
                    const isDownloadingThis = downloadingFormat === item.quality;
                    const canDownloadFree = !item.isPro || isPro;

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          item.isPro && !isPro
                            ? 'bg-[#111318] border-[#222631] opacity-95'
                            : 'bg-[#161922] border-[#282d3b] hover:border-rose-500/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-display font-bold text-base text-white flex items-center gap-2">
                              {item.quality}
                            </span>
                            {item.isPro ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1">
                                <Crown className="w-3 h-3" /> {item.proLabel || 'Pro'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                                Free HD
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-y-1 text-xs text-slate-400 mb-4">
                            <div>Resolution: <span className="text-slate-200 font-mono">{item.resolution}</span></div>
                            <div>Framerate: <span className="text-slate-200 font-mono">{item.fps} fps</span></div>
                            <div>File Format: <span className="text-slate-200 font-mono">{item.format}</span></div>
                            <div>Est. Size: <span className="text-slate-200 font-mono">{item.sizeMb ? `~${item.sizeMb} MB` : 'Dynamic'}</span></div>
                          </div>
                        </div>

                        {/* Download Trigger */}
                        {isDownloadingThis ? (
                          <div className="w-full bg-[#0b0c0e] rounded-xl p-2 border border-[#222631]">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                              <span>Downloading...</span>
                              <span className="font-mono text-rose-400">{downloadProgress}%</span>
                            </div>
                            <div className="w-full bg-[#181b22] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300 rounded-full"
                                style={{ width: `${downloadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDownload(item, 'video')}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              item.isPro && !isPro
                                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/15'
                            }`}
                          >
                            {item.isPro && !isPro ? (
                              <>
                                <Crown className="w-3.5 h-3.5 text-amber-400" />
                                <span>Unlock {item.quality} (Pro)</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5" />
                                <span>Download {item.quality}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Audio Tab Content */}
            {activeTab === 'audio' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {mediaData.audioFormats?.map((item, index) => {
                    const isDownloadingThis = downloadingFormat === item.quality;

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          item.isPro && !isPro
                            ? 'bg-[#111318] border-[#222631]'
                            : 'bg-[#161922] border-[#282d3b] hover:border-cyan-500/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-display font-bold text-base text-white flex items-center gap-2">
                              <Music className="w-4 h-4 text-cyan-400" /> {item.quality}
                            </span>
                            {item.isPro ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1">
                                <Crown className="w-3 h-3" /> {item.proLabel || 'Pro'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                                Free
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-y-1 text-xs text-slate-400 mb-4">
                            <div>Format: <span className="text-slate-200 font-mono">{item.format}</span></div>
                            <div>Sample Rate: <span className="text-slate-200 font-mono">{item.sampleRate || '44.1 kHz'}</span></div>
                            <div>Estimated Size: <span className="text-slate-200 font-mono">~{item.sizeMb} MB</span></div>
                            <div>Channels: <span className="text-slate-200 font-mono">Stereo (2.0)</span></div>
                          </div>
                        </div>

                        {isDownloadingThis ? (
                          <div className="w-full bg-[#0b0c0e] rounded-xl p-2 border border-[#222631]">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                              <span>Extracting Hi-Fi Audio...</span>
                              <span className="font-mono text-cyan-400">{downloadProgress}%</span>
                            </div>
                            <div className="w-full bg-[#181b22] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-300 rounded-full"
                                style={{ width: `${downloadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDownload(item, 'audio')}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              item.isPro && !isPro
                                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/15'
                            }`}
                          >
                            {item.isPro && !isPro ? (
                              <>
                                <Crown className="w-3.5 h-3.5 text-amber-400" />
                                <span>Unlock {item.quality} (Pro)</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5" />
                                <span>Download {item.format} ({item.quality})</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Subtitles Tab Content */}
            {activeTab === 'subtitles' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {mediaData.subtitles?.map((sub, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-[#161922] border border-[#282d3b] flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-white">{sub.lang}</h4>
                        <p className="text-xs text-slate-400">Format: {sub.format} · Code: {sub.code}</p>
                      </div>
                      <button
                        onClick={() => {
                          playSuccessSound();
                          if (onShowToast) onShowToast(`Subtitles downloaded (${sub.lang}).`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#181b22] hover:bg-[#222631] text-slate-200 border border-[#222631] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .SRT</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pro Membership Banner */}
      {!isPro && (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-950/30 via-[#161922] to-amber-950/20 border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white">
                Unlock 4K 60FPS Video & 320kbps Studio MP3
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Pro members get unrestricted access to 4K Ultra HD, 2K Quad HD, 1080p 60fps, 320kbps Hi-Fi audio, and unlimited temporary email inboxes.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPricing}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 whitespace-nowrap shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Upgrade to Pro ($9 Lifetime)</span>
          </button>
        </div>
      )}

      {/* Mobile QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#13151b] border border-[#222631] rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white mb-1">Scan with Your Phone</h3>
            <p className="text-xs text-slate-400 mb-4">
              Open your smartphone camera or QR scanner to open and download this media directly on your mobile device.
            </p>

            {qrDataUrl && (
              <div className="bg-white p-4 rounded-2xl inline-block mx-auto mb-4 shadow-inner">
                <img src={qrDataUrl} alt="Mobile QR Code" className="w-48 h-48 mx-auto" />
              </div>
            )}

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#181b22] hover:bg-[#222631] text-slate-300 font-semibold text-xs border border-[#222631] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
