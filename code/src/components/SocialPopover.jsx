import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocialIcons } from "../images/SocialIcons";
import { motion } from "framer-motion";

import { Copy, ExternalLink, User, Check, WifiOff, Wifi, Mail } from "lucide-react";
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaReddit } from "react-icons/fa";

const SocialPopover = () => {
    const SocialProfiles = useSelector((state) => state.settings.socialProfiles);
    const userName = useSelector((state) => state.settings.userName);
    const userRole = useSelector((state) => state.settings.userRole);
    const userPortfolioUrl = useSelector((state) => state.settings.userPortfolioUrl);


    const [isOpen, setIsOpen] = React.useState(false);
    const [copiedText, setCopiedText] = React.useState("");
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [profileImageError, setProfileImageError] = useState(false);

    useEffect(() => (window.ononline = window.onoffline = () => setIsOnline(navigator.onLine)), []);

    const SocialIcons = {
        linkedin: <FaLinkedin />,
        github: <FaGithub />,
        twitter: <FaTwitter />,
        instagram: <FaInstagram />,
        reddit: <FaReddit />,
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(""), 2000);
    };

    const validateUrl = (url) => { if (!/^https?:\/\//i.test(url)) { return `https://${url}`; } return url; };

    // Set GitHub profile image directly
    const githubUrl = SocialProfiles.github;
    const githubUsername = githubUrl ? githubUrl.split("github.com/")[1] : null;
    const profileImageUrl = githubUsername ? `https://github.com/${githubUsername}.png` : null;

    return (
        <div className="relative inline-block">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-4 -left-4 text-3xl transform -rotate-12 z-20 filter drop-shadow-lg pointer-events-none"
            >
                🎅
            </motion.div>
            <button
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className="flex items-center space-x-3 rounded-xl bg-[#1a1b26]/80 px-3 py-2.5 text-base backdrop-blur-lg transition-all hover:bg-[#1a1b26] border border-white/10"
            >
                {profileImageUrl && !profileImageError ? (
                    <img
                        className="h-6 w-6 rounded-md"
                        src={profileImageUrl}
                        alt={userName}
                        onError={() => setProfileImageError(true)} // Handle error case
                    />
                ) : (
                    <User className="h-5 w-5 text-white/80" />
                )}
                <span className="text-white font-medium">
                    {userName.length > 12 ? `${userName.slice(0, 12)}...` : userName}
                </span>
                {!isOnline ? (
                    <WifiOff size={20} className="text-red-400 ml-2" />
                ) : (
                    <Wifi size={20} className="text-green-400 ml-2" />
                )}
            </button>

            {isOpen && (
                <motion.div
                    className="absolute right-0 pt-1 z-50"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-72 rounded-xl border border-white/10 bg-[#1a1b26]/95 p-4 backdrop-blur-xl shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                            <div>
                                <h3 className="text-base font-medium text-white">{userName.length > 12 ? `${userName.slice(0, 12)}...` : userName}</h3>
                                {userRole !== '' && <p className="text-sm text-white/70 mt-0.5 capitalize">{userRole.length > 15 ? `${userRole.slice(0, 15)}..` : userRole}</p>}
                            </div>
                            <div className="flex gap-1.5">
                                <a href="https://mail.google.com/" className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 transition-colors">
                                    <Mail className="h-4 w-4" />
                                </a>
                                {userPortfolioUrl !== '' && (
                                    <>
                                        <button
                                            onClick={() => copyToClipboard(userPortfolioUrl)}
                                            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 transition-colors"
                                            title="Copy portfolio URL"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                        <a
                                            href={validateUrl(userPortfolioUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 transition-colors"
                                            title="Open porfolio website"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            {Object.entries(SocialProfiles).map(
                                ([key, value]) =>
                                    value !== '' && (
                                        <motion.div
                                            key={key}
                                            className="group relative flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/10"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <a
                                                href={value}
                                                rel="noopener noreferrer"
                                                className="flex flex-1 items-center gap-3 text-white"
                                            >
                                                <span className="text-lg text-white/80">{SocialIcons[key]}</span>
                                                <p className="text-base capitalize">{key}</p>
                                            </a>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => copyToClipboard(value)}
                                                    className="rounded-lg p-1.5 text-white/70 hover:bg-white/20 transition-colors"
                                                    title="Copy URL"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                                <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-lg p-1.5 text-white/70 hover:bg-white/20 transition-colors"
                                                    title="Open link"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </div>
                                        </motion.div>
                                    )
                            )}
                        </div>
                    </div>

                    {copiedText && (
                        <motion.div
                            className="fixed top-1 right-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1a1b26]/95 px-4 py-3 shadow-xl backdrop-blur-xl">
                                <Check className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm text-white/90">Copied to clipboard</span>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default SocialPopover;
