import React from "react";
import { Copy, ExternalLink, User, Check, WifiOff, Wifi, Mail } from "lucide-react";

const SocialPopover = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [copiedText, setCopiedText] = React.useState("");

    const socialLinks = [
        {
            name: 'LinkedIn',
            username: 'mohamed-halith-smh',
            url: 'https://linkedin.com/in/mohamed-halith-smh',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            )
        },
        {
            name: 'GitHub',
            username: 'halith-smh',
            url: 'https://github.com/halith-smh',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
            )
        },
        {
            name: 'Twitter',
            username: 'halith_smh',
            url: 'https://twitter.com/halith_smh',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        },
        {
            name: 'Instagram',
            username: 'halith_smh',
            url: 'https://instagram.com/halith_smh',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            )
        }
    ];

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(""), 2000);
    };

    return (
        <div className="relative inline-block">
            <button
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className="flex items-center space-x-3 rounded-xl bg-[#1a1b26]/80 px-3 py-2.5 text-base backdrop-blur-lg transition-all hover:bg-[#1a1b26] border border-white/10"
            >
                <User className="h-5 w-5 text-white/80" />
                <span className="text-white font-medium">halith_smh</span>
                {!navigator.onLine ? (
                    <WifiOff size={20} className="text-red-400 ml-2" />
                ) : (
                    <Wifi size={20} className="text-green-400 ml-2" />
                )}
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 pt-2 z-50"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <div className="w-72 rounded-xl border border-white/10 bg-[#1a1b26]/95 p-3 backdrop-blur-xl shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <div>
                                <h3 className="text-base font-medium text-white">halith_smh</h3>
                                <p className="text-sm text-white/70 mt-1">Student</p>
                            </div>
                            <div className="flex gap-2">
                                <a href="https://mail.google.com/" className="rounded-lg p-2 text-white/70 hover:bg-white/10 transition-colors">
                                    <Mail className="h-5 w-5" />
                                </a>
                                <button
                                    onClick={() => copyToClipboard('https://halith.dev')}
                                    className="rounded-lg p-2 text-white/70 hover:bg-white/10 transition-colors"
                                    title="Copy profile URL"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                                <a
                                    href="https://halith.dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg p-2 text-white/70 hover:bg-white/10 transition-colors"
                                    title="Open profile"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {socialLinks.map((social) => (
                                <div key={social.name} className="group relative flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-white/10">
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-1 items-center gap-3 text-white"
                                    >
                                        <span className="text-white/80">{social.icon}</span>
                                        <p className="text-base">{social.name}</p>
                                    </a>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => copyToClipboard(social.url)}
                                            className="rounded-lg p-2 text-white/70 hover:bg-white/20 transition-colors"
                                            title="Copy URL"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-lg p-2 text-white/70 hover:bg-white/20 transition-colors"
                                            title="Open link"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {copiedText && (
                        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1a1b26]/95 px-4 py-3 shadow-xl backdrop-blur-xl">
                                <Check className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm text-white/90">Copied to clipboard</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SocialPopover;