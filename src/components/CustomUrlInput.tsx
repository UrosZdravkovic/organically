import { useState, useEffect, useRef } from 'react';
import parseUrl, { type ParsedUrl, type UrlType } from '../utils/parseUrl';
import { IoChevronDown } from 'react-icons/io5';
import HighlightedUrlPart from '@/utils/HighlightedUrlPart';


export default function CustomUrlInput() {
    const [inputValue, setInputValue] = useState('');
    const [urlData, setUrlData] = useState<ParsedUrl | null>(null);
    const [selectedType, setSelectedType] = useState<UrlType | ''>('');
    const [isManualSelect, setIsManualSelect] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const lastRootDomainRef = useRef<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 🧠 Detekcija URL-a i sinhronizacija selecta
    useEffect(() => {
        if (!inputValue.trim()) {
            setUrlData(null);
            setSelectedType('');
            return;
        }

        const parsed = parseUrl(inputValue);

        const domainChanged = parsed.rootDomain !== lastRootDomainRef.current;
        const pathChanged = parsed.path !== urlData?.path;
        const subdomainChanged = parsed.subdomain !== urlData?.subdomain;

        lastRootDomainRef.current = parsed.rootDomain;
        setUrlData(parsed);

        // Ako korisnik promeni strukturu (doda subfolder, subdomen, promeni root domen)
        // vraćamo automatski mod
        if (domainChanged || pathChanged || subdomainChanged) {
            setIsManualSelect(false);
        }

        // Ako nije manuelno izabrao tip — ili smo ga resetovali gore
        if (!isManualSelect) {
            setSelectedType(parsed.type);
        }
    }, [inputValue]);


    // 🎯 Zatvori dropdown kada se klikne van komponente
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSelectOption = (value: UrlType) => {
        setSelectedType(value);
        setIsManualSelect(true);
        setIsDropdownOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Final URL data:', { ...urlData, type: selectedType });
    };

    // 🧩 Uslovni prikaz selecta
    const showSelect =
        urlData && urlData.type !== 'invalid' && !!urlData.rootDomain;

    const options: { value: UrlType; label: string }[] = [
        { value: 'root domain', label: 'Root domain' },
        { value: 'subdomain', label: 'Subdomain' },
        { value: 'subfolder', label: 'Subfolder' },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-lg mx-auto">
            <div className="relative w-96 mx-auto" ref={containerRef}>
                {/* Input container */}
                <div className="flex justify-between gap-2 border border-gray-300 rounded-md bg-white shadow-sm">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="Enter URL (root, subdomain, or subfolder)"
                        className="flex-1 outline-none text-sm p-3"
                    />

                    {/* Custom Select Trigger */}
                    {showSelect && (
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 border border-l-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm transition-colors min-w-[180px] justify-between"
                        >
                            <span className="truncate">{selectedType}</span>
                            <IoChevronDown
                                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                    )}
                </div>

                {/* Custom Dropdown - Ispod celog input diva */}
                {showSelect && isDropdownOpen && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelectOption(option.value)}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors flex items-center justify-between ${selectedType === option.value ? 'bg-blue-50 text-blue-600' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-gray-500 text-xs">
                                        <HighlightedUrlPart urlData={urlData!} option={option.value} />
                                    </span>
                                    <span>{option.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={!urlData || urlData.type === 'invalid'}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
                Submit
            </button>
        </form>
    );
}
