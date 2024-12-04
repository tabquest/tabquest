import React from "react";

const SocialPopover = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const socialLinks = [
        { name: 'LinkedIn', username: 'halith_smh', url: 'https://linkedin.com/in/halith_smh' },
        { name: 'GitHub', username: 'halith_smh', url: 'https://github.com/halith_smh' },
        { name: 'Twitter', username: 'halith_smh', url: 'https://twitter.com/halith_smh' },
        { name: 'Instagram', username: 'halith_smh', url: 'https://instagram.com/halith_smh' }
    ];

    return (
        <div className="relative inline-block">
            <button
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className="flex items-center space-x-2 rounded-lg bg-white/10 p-2 backdrop-blur-lg transition-all hover:bg-white/20"
            >
                <span className="text-white">halith_smh</span>
            </button>

            {isOpen && (
                <div
                    className="absolute bottom-18 right-0 mb-2"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <div className="w-64 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-lg">
                        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">halith_smh</h3>
                                <p className="text-sm text-white/70">Student</p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 rounded-lg p-2 text-white transition-colors hover:bg-white/10"
                                >
                                    <div>
                                        <p className="text-sm font-medium">{social.name}</p>
                                        <p className="text-xs text-white/70">@{social.username}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialPopover;