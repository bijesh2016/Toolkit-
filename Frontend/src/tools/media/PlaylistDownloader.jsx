import React, { useState, useEffect } from 'react';
import { 
  ListMusic, Video, Music, Download, Sparkles, Crown, 
  Play, ExternalLink, Share2, Check, Copy, RotateCw, 
  ShieldCheck, FileText, Eye, QrCode, AlertCircle, 
  ArrowRight, CheckSquare, Square, Layers, Clock, 
  Radio, Film, Headphones, Zap, RefreshCw, X, ChevronRight
} from 'lucide-react';
import { isProMember } from '../../utils/storage';
import { playClickSound, playSuccessSound } from '../../utils/soundEffects';

const SAMPLE_PLAYLISTS = [
  {
    name: 'Mahabharat All Episodes (B.R. Chopra)',
    url: 'https://youtube.com/playlist?list=PLFr_jkwUp0hhm1lR1TSdgESOfoyLQR3t2&si=NJ1WMP6sHsPWmaRi',
    count: '15 Episodes',
    tag: 'Live Series'
  },
  {
    name: 'Lo-Fi Chillhop Beats & Study Soundtracks',
    url: 'https://www.youtube.com/playlist?list=PLlofi-beats-2026',
    count: '8 Tracks',
    tag: 'Chill / Study'
  },
  {
    name: 'Full-Stack Modern Web Engineering Masterclass',
    url: 'https://www.youtube.com/playlist?list=PLwebdev-masterclass-2026',
    count: '7 Lessons',
    tag: 'Web Dev'
  },
  {
    name: 'Nepal Classical Acoustic & Sarangi Folk',
    url: 'https://www.youtube.com/playlist?list=PLnepal-acoustic-2026',
    count: '6 Tracks',
    tag: 'Nepal Heritage'
  }
];

const DOWNLOAD_FORMATS = [
  { id: 'mp4_720p', label: 'MP4 Video (720p HD)', type: 'video', quality: '720p', isPro: false, badge: 'Free HD' },
  { id: 'mp4_1080p', label: 'MP4 Video (1080p Full HD)', type: 'video', quality: '1080p', isPro: true, badge: 'Pro 1080p' },
  { id: 'mp4_4k', label: 'MP4 Video (4K Ultra HD)', type: 'video', quality: '4k', isPro: true, badge: 'Pro 4K' },
  { id: 'mp4_360p', label: 'MP4 Video (360p Data Saver)', type: 'video', quality: '360p', isPro: false, badge: 'Free' },
  { id: 'mp3_128k', label: 'MP3 Audio (128 kbps Standard)', type: 'audio', quality: '128k', isPro: false, badge: 'Free MP3' },
  { id: 'mp3_320k', label: 'MP3 Audio (320 kbps Studio Master)', type: 'audio', quality: '320k', isPro: true, badge: 'Pro Hi-Fi' },
  { id: 'mp3_192k', label: 'MP3 Audio (192 kbps High Quality)', type: 'audio', quality: '192k', isPro: true, badge: 'Pro Audio' }
];

export default function PlaylistDownloader({ onShowToast, onOpenPricing }) {
  const [url, setUrl] = useState('https://www.youtube.com/playlist?list=PLlofi-beats-2026');
  const [loading, setLoading] = useState(false);
  const [playlistData, setPlaylistData] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedFormat, setSelectedFormat] = useState(DOWNLOAD_FORMATS[0]);
  const [isPro, setIsPro] = useState(false);

  // Batch queue state
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [queueIndex, setQueueIndex] = useState(0);
  const [queueProgress, setQueueProgress] = useState(0);
  const [completedIds, setCompletedIds] = useState(new Set());

  // Preview Modal
  const [previewVideo, setPreviewVideo] = useState(null);

  useEffect(() => {
    setIsPro(isProMember());
    const handleProUpdate = () => setIsPro(isProMember());
    window.addEventListener('toolshub_pro_updated', handleProUpdate);
    return () => window.removeEventListener('toolshub_pro_updated', handleProUpdate);
  }, []);

  // Fetch playlist metadata
  const handleFetchPlaylist = async (targetUrl = url) => {
    if (!targetUrl || !targetUrl.trim()) {
      if (onShowToast) onShowToast('Please enter a YouTube playlist URL or ID.');
      return;
    }

    try {
      setLoading(true);
      playClickSound();

      const response = await fetch('/api/tools/playlist-downloader/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setPlaylistData(resJson.data);
        // Select all by default
        const allIds = new Set(resJson.data.videos.map(v => v.id));
        setSelectedIds(allIds);
        setCompletedIds(new Set());
        playSuccessSound();
        if (onShowToast) onShowToast(`Loaded playlist: ${resJson.data.title} (${resJson.data.videos.length} tracks)`);
      } else {
        throw new Error(resJson.error || 'Failed to parse playlist.');
      }
    } catch (err) {
      console.warn('Playlist metadata request failed:', err);
      setPlaylistData(null);
      setSelectedIds(new Set());
      if (onShowToast) onShowToast(err.message || 'Playlist metadata is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load on mount
  useEffect(() => {
    handleFetchPlaylist('https://www.youtube.com/playlist?list=PLlofi-beats-2026');
  }, []);

  // Toggle selection for a video
  const toggleSelect = (id) => {
    playClickSound();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Select all / Deselect all
  const handleToggleSelectAll = () => {
    playClickSound();
    if (!playlistData) return;
    if (selectedIds.size === playlistData.videos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(playlistData.videos.map(v => v.id)));
    }
  };

  // Single track direct download trigger
  const handleDownloadSingleTrack = (video, formatObj = selectedFormat) => {
    if (formatObj.isPro && !isPro) {
      if (onShowToast) onShowToast(`${formatObj.label} is a Pro feature. Upgrade to unlock 4K & studio audio!`);
      if (onOpenPricing) onOpenPricing();
      return;
    }

    playClickSound();
    const ext = formatObj.type === 'audio' ? 'mp3' : 'mp4';
    const cleanName = (video.title || 'track').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35);
    const filename = `${cleanName}_${formatObj.quality}.${ext}`;
    const downloadUrl = `/api/tools/media-downloader/download?format=${ext}&quality=${encodeURIComponent(formatObj.quality)}&id=${video.id}`;

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setCompletedIds(prev => new Set([...prev, video.id]));
    playSuccessSound();
    if (onShowToast) onShowToast(`Started downloading: ${video.title}`);
  };

  // Sequential Batch Download Runner
  const handleStartBatchDownload = async () => {
    const selectedList = playlistData?.videos.filter(v => selectedIds.has(v.id)) || [];
    if (!selectedList.length) {
      if (onShowToast) onShowToast('Please select at least one track to download.');
      return;
    }

    // Check Pro requirements
    if (selectedFormat.isPro && !isPro) {
      if (onShowToast) onShowToast(`${selectedFormat.label} is reserved for Pro members.`);
      if (onOpenPricing) onOpenPricing();
      return;
    }

    // Free users quota limit: up to 5 tracks at once
    if (selectedList.length > 5 && !isPro) {
      if (onShowToast) onShowToast(`Free tier allows batch downloading up to 5 tracks at once. Upgrade to Pro for unlimited bulk playlist downloads!`);
      if (onOpenPricing) onOpenPricing();
      return;
    }

    setIsBatchRunning(true);
    setQueueIndex(0);
    setQueueProgress(0);
    playClickSound();

    for (let i = 0; i < selectedList.length; i++) {
      const video = selectedList[i];
      setQueueIndex(i + 1);
      setQueueProgress(Math.round(((i + 1) / selectedList.length) * 100));

      // Trigger track download
      handleDownloadSingleTrack(video, selectedFormat);

      // Grace period between downloads so browser doesn't block multi-download
      await new Promise(res => setTimeout(res, 900));
    }

    setIsBatchRunning(false);
    playSuccessSound();
    if (onShowToast) onShowToast(`Completed batch download of ${selectedList.length} tracks!`);
  };

  // Export M3U Playlist file
  const handleExportM3U = async () => {
    if (onShowToast) onShowToast('Download playlists are not generated because no authorized media streams are available.');
    return;

    if (!playlistData) return;
    try {
      playClickSound();
      const selectedList = playlistData.videos.filter(v => selectedIds.has(v.id));
      const res = await fetch('/api/tools/playlist-downloader/export-m3u', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: playlistData.title,
          videos: selectedList.length ? selectedList : playlistData.videos,
          format: selectedFormat.type === 'audio' ? 'mp3' : 'mp4',
          quality: selectedFormat.quality
        })
      });

      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${playlistData.title.slice(0, 30).replace(/[^a-zA-Z0-9_-]/g, '_')}.m3u`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      playSuccessSound();
      if (onShowToast) onShowToast('Downloaded .M3U playlist file.');
    } catch (err) {
      if (onShowToast) onShowToast('Failed to export M3U.');
    }
  };

  // Export Text Links for IDM / JDownloader / yt-dlp
  const handleExportLinks = async () => {
    if (onShowToast) onShowToast('Direct download links cannot be generated without an authorized media provider.');
    return;

    if (!playlistData) return;
    try {
      playClickSound();
      const selectedList = playlistData.videos.filter(v => selectedIds.has(v.id));
      const res = await fetch('/api/tools/playlist-downloader/export-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: playlistData.title,
          videos: selectedList.length ? selectedList : playlistData.videos,
          format: selectedFormat.type === 'audio' ? 'mp3' : 'mp4',
          quality: selectedFormat.quality
        })
      });

      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${playlistData.title.slice(0, 30).replace(/[^a-zA-Z0-9_-]/g, '_')}_links.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      playSuccessSound();
      if (onShowToast) onShowToast('Downloaded links.txt for external download managers.');
    } catch (err) {
      if (onShowToast) onShowToast('Failed to export links.');
    }
  };

  const selectedCount = selectedIds.size;
  const totalCount = playlistData?.videos.length || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#13151b] border border-[#222631] relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-600/10 border border-rose-500/20 text-rose-400">
              <ListMusic className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
                  YouTube Playlist Downloader
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Bulk Video & MP3
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Pro Bulk Engine
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Download whole YouTube playlists in one click. Select all or specific tracks, customize MP4 video (360p to 4K) or high-bitrate MP3 audio, and export .M3U files for VLC and media players.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            {isPro ? (
              <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Pro Member (Unlimited Bulk Downloads)</span>
              </div>
            ) : (
              <button
                onClick={onOpenPricing}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>Unlock Unlimited Batch (Pro)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* URL Input Bar & Quick Sample Chips */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#13151b] border border-[#222631]">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Paste YouTube Playlist URL (or Playlist ID)
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchPlaylist(url)}
              placeholder="https://www.youtube.com/playlist?list=PL..."
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
            onClick={() => handleFetchPlaylist(url)}
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/20 cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Loading Playlist...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Fetch All Tracks</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-4 pt-4 border-t border-[#1e222d] flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          {SAMPLE_PLAYLISTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrl(item.url);
                handleFetchPlaylist(item.url);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#181b22] hover:bg-[#222631] text-slate-300 hover:text-white border border-[#222631] transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <span className="text-rose-400 font-medium">[{item.count}]</span>
              <span className="truncate max-w-[170px] sm:max-w-[220px]">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Playlist Meta Showcase Card */}
      {playlistData && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#13151b] border border-[#222631] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Banner Thumbnail */}
            <div className="md:col-span-4 relative rounded-2xl overflow-hidden bg-black/60 aspect-video border border-[#222631]">
              <img
                src={playlistData.banner || playlistData.videos[0]?.thumbnail}
                alt={playlistData.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#0b0c0e]/85 backdrop-blur-sm text-slate-200 text-xs font-semibold border border-[#222631] flex items-center gap-1.5">
                <ListMusic className="w-3.5 h-3.5 text-rose-400" />
                {playlistData.videoCount} Tracks
              </span>
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-white text-[11px] font-mono">
                {playlistData.totalDuration}
              </span>
            </div>

            {/* Info */}
            <div className="md:col-span-8 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/20">
                  YouTube Playlist
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-2 line-clamp-2">
                  {playlistData.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Curator: <span className="text-slate-200 font-semibold">{playlistData.author}</span> · {playlistData.videoCount} items · Total Duration: {playlistData.totalDuration}
                </p>
                {playlistData.description && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {playlistData.description}
                  </p>
                )}
              </div>

              {/* Selection Summary & Quick Actions */}
              <div className="pt-4 mt-4 border-t border-[#1e222d] flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleSelectAll}
                    className="px-3 py-1.5 rounded-xl bg-[#181b22] hover:bg-[#222631] text-slate-300 text-xs font-semibold border border-[#222631] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {selectedCount === totalCount ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5 text-rose-400" />
                        <span>Deselect All</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-3.5 h-3.5" />
                        <span>Select All ({totalCount})</span>
                      </>
                    )}
                  </button>

                  <span className="text-xs text-slate-400 font-medium">
                    <strong className="text-slate-200">{selectedCount}</strong> of {totalCount} selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportM3U}
                    className="px-3 py-1.5 rounded-xl bg-[#181b22] hover:bg-[#222631] text-slate-300 hover:text-white text-xs font-semibold border border-[#222631] flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Export .M3U file for VLC or media players"
                  >
                    <ListMusic className="w-3.5 h-3.5 text-amber-400" />
                    <span>Export .M3U</span>
                  </button>

                  <button
                    onClick={handleExportLinks}
                    className="px-3 py-1.5 rounded-xl bg-[#181b22] hover:bg-[#222631] text-slate-300 hover:text-white text-xs font-semibold border border-[#222631] flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Export plain text URL list for IDM or yt-dlp"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Links (.txt)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Global Batch Download Toolbar */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#13151b] border border-[#222631] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Batch Format:
                </span>
                <select
                  value={selectedFormat.id}
                  onChange={(e) => {
                    const match = DOWNLOAD_FORMATS.find(f => f.id === e.target.value);
                    if (match) setSelectedFormat(match);
                  }}
                  className="py-2 px-3 rounded-xl bg-[#0b0c0e] border border-[#222631] text-slate-200 text-xs font-semibold focus:outline-none focus:border-rose-500/50"
                >
                  {DOWNLOAD_FORMATS.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.label} {f.isPro ? '★ Pro' : '· Free'}
                    </option>
                  ))}
                </select>

                {selectedFormat.isPro ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1">
                    <Crown className="w-3 h-3" /> {selectedFormat.badge}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                    {selectedFormat.badge}
                  </span>
                )}
              </div>

              {/* Batch Download Button */}
              <button
                onClick={handleStartBatchDownload}
                disabled={isBatchRunning || selectedCount === 0}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all cursor-pointer whitespace-nowrap"
              >
                {isBatchRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Downloading {queueIndex} of {selectedCount}...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download {selectedCount} Selected Tracks</span>
                  </>
                )}
              </button>
            </div>

            {/* Active Batch Progress Bar */}
            {isBatchRunning && (
              <div className="pt-3 border-t border-[#1e222d] space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Batch Queue Progress ({queueIndex}/{selectedCount})</span>
                  <span className="font-mono text-rose-400">{queueProgress}%</span>
                </div>
                <div className="w-full bg-[#0b0c0e] h-2.5 rounded-full overflow-hidden border border-[#222631]">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${queueProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tracklist Table */}
          <div className="rounded-3xl bg-[#13151b] border border-[#222631] overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#222631] flex items-center justify-between">
              <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                <span>Playlist Tracklist ({totalCount} Videos)</span>
              </h4>
              <span className="text-xs text-slate-400">
                Click track checkbox to include/exclude
              </span>
            </div>

            <div className="divide-y divide-[#1e222d]">
              {playlistData.videos.map((item, idx) => {
                const isSelected = selectedIds.has(item.id);
                const isCompleted = completedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                      isSelected ? 'bg-[#151821]/60 hover:bg-[#181c27]' : 'bg-[#111318]/50 opacity-60 hover:opacity-85'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleSelect(item.id)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-rose-500" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      {/* Index Number */}
                      <span className="text-xs font-mono font-bold text-slate-500 w-5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Thumbnail with quick watch play icon */}
                      <div
                        onClick={() => setPreviewVideo(item)}
                        className="relative w-20 sm:w-24 aspect-video rounded-lg overflow-hidden bg-black/60 shrink-0 cursor-pointer group border border-[#222631]"
                        title="Click to preview video"
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                          <Play className="w-3.5 h-3.5 fill-white text-white drop-shadow" />
                        </div>
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white">
                          {item.duration}
                        </span>
                      </div>

                      {/* Title & Metadata */}
                      <div className="min-w-0 flex-1">
                        <h5
                          onClick={() => setPreviewVideo(item)}
                          className="text-xs sm:text-sm font-bold text-slate-200 hover:text-white truncate cursor-pointer"
                          title={item.title}
                        >
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {item.author} · {item.views} views
                        </p>
                      </div>
                    </div>

                    {/* Single Track Quick Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {isCompleted && (
                        <span className="text-emerald-400 text-xs font-medium flex items-center gap-1 mr-1">
                          <Check className="w-3.5 h-3.5" /> Saved
                        </span>
                      )}

                      <button
                        onClick={() => handleDownloadSingleTrack(item, { ...selectedFormat, type: 'video' })}
                        className="px-2.5 py-1.5 rounded-lg bg-[#181b22] hover:bg-[#222631] text-slate-300 hover:text-white border border-[#222631] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Download as MP4 Video"
                      >
                        <Film className="w-3 h-3 text-rose-400" />
                        <span>MP4</span>
                      </button>

                      <button
                        onClick={() => handleDownloadSingleTrack(item, { ...selectedFormat, type: 'audio' })}
                        className="px-2.5 py-1.5 rounded-lg bg-[#181b22] hover:bg-[#222631] text-slate-300 hover:text-white border border-[#222631] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Extract as MP3 Audio"
                      >
                        <Headphones className="w-3 h-3 text-cyan-400" />
                        <span>MP3</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pro Membership Callout */}
      {!isPro && (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-950/30 via-[#161922] to-amber-950/20 border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white">
                Batch Download Complete Playlists in 4K & 320kbps
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Pro members can download unlimited tracks in a single queue, export 1080p 60fps & 4K Ultra videos, and extract 320kbps Studio Master MP3s.
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

      {/* Embedded Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#13151b] border border-[#222631] rounded-3xl p-5 max-w-2xl w-full relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-sm font-bold text-white truncate max-w-[80%]">
                {previewVideo.title}
              </h4>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#222631] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[#222631]">
              <iframe
                title={previewVideo.title}
                src={`https://www.youtube-nocookie.com/embed/${previewVideo.id}?autoplay=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{previewVideo.author} · Duration: {previewVideo.duration}</span>
              <button
                onClick={() => {
                  handleDownloadSingleTrack(previewVideo, selectedFormat);
                  setPreviewVideo(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download This Track</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
