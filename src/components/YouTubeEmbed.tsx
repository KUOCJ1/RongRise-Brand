interface YouTubeEmbedProps {
  videoId?: string;
  channelId?: string;
  title?: string;
  className?: string;
}

export default function YouTubeEmbed({
  videoId,
  channelId,
  title = "YouTube 影片",
  className = "",
}: YouTubeEmbedProps) {
  const src = videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : channelId
    ? `https://www.youtube.com/embed?listType=playlist&list=${channelId}&rel=0&modestbranding=1`
    : "";

  if (!src) return null;

  return (
    <div className={`aspect-video rounded-2xl overflow-hidden shadow-lg ${className}`}>
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="w-full h-full"
      />
    </div>
  );
}
