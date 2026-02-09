import React from 'react';

interface RichTextProps {
  text: string;
  className?: string;
}

export const RichText: React.FC<RichTextProps> = ({ text, className = "" }) => {
  if (!text) return null;

  // Split by bold markdown markers, ensuring we capture the content correctly
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <div className={`${className} leading-relaxed`}>
      {parts.map((part, i) => {
        // Test if the part is a bolded segment
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          const content = part.slice(2, -2);
          return (
            <strong key={i} className="text-white font-bold inline shadow-white/10 text-shadow-sm">
              {content}
            </strong>
          );
        }
        // Render normal text with slight transparency for hierarchy
        return <span key={i} className="text-zinc-300/90">{part}</span>;
      })}
    </div>
  );
};