'use client';

import { useEffect, useMemo, useRef, useState, type SVGProps } from "react";

type EmojiPickerProps = {
  onSelect: (emoji: string) => void;
  disabled?: boolean;
};

type EmojiCategory = {
  id: string;
  label: string;
  icon: string;
  emojis: string[];
};

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: "smileys",
    label: "Smileys and emotion",
    icon: "🙂",
    emojis: ["😀", "😁", "😂", "🤣", "😅", "😊", "😍", "🤩", "😘", "😎", "😇", "🥳"],
  },
  {
    id: "gestures",
    label: "People and gestures",
    icon: "👍",
    emojis: ["👍", "👋", "🙏", "👏", "🙌", "🤌", "🤟", "🤔", "🤗", "🤫", "🤝", "🤷"],
  },
  {
    id: "objects",
    label: "Objects and symbols",
    icon: "🎉",
    emojis: ["🎉", "🔥", "⭐️", "⚡️", "❤️", "💡", "✅", "❌", "📌", "🧠", "🛠️", "⏰"],
  },
];

const EmojiIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 14.5c.6.9 1.8 1.5 3 1.5s2.4-.6 3-1.5" strokeLinecap="round" />
    <path d="M9 10h.01M15 10h.01" strokeLinecap="round" />
  </svg>
);

const EmojiPicker = ({ onSelect, disabled = false }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(EMOJI_CATEGORIES[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const currentCategory = useMemo(
    () => EMOJI_CATEGORIES.find((category) => category.id === activeCategory) ?? EMOJI_CATEGORIES[0],
    [activeCategory]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!liveRegionRef.current) return;
    liveRegionRef.current.textContent = `${currentCategory.label} category selected`;
  }, [currentCategory]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((previous) => !previous);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  const handleSelectEmoji = (emoji: string) => {
    if (disabled) {
      setIsOpen(false);
      return;
    }

    onSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        ref={buttonRef}
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Open emoji picker"
        disabled={disabled}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <EmojiIcon className="h-5 w-5" />
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-label="Emoji picker"
          className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="mb-3 flex items-center justify-between gap-2" role="tablist" aria-label="Emoji categories">
            {EMOJI_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.id}
                aria-controls={`emoji-grid-${category.id}`}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex flex-1 items-center justify-center rounded-xl px-2 py-1 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span aria-hidden="true" className="mr-1 text-lg">
                  {category.icon}
                </span>
                {category.label}
              </button>
            ))}
          </div>

          <div
            id={`emoji-grid-${currentCategory.id}`}
            role="grid"
            aria-label={`${currentCategory.label} emojis`}
            className="grid grid-cols-6 gap-2"
          >
            {currentCategory.emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                role="gridcell"
                onClick={() => handleSelectEmoji(emoji)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-800"
                aria-label={`Insert emoji ${emoji}`}
              >
                <span aria-hidden="true">{emoji}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div ref={liveRegionRef} className="sr-only" aria-live="polite" />
    </div>
  );
};

export default EmojiPicker;
