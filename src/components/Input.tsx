import { useState, useEffect, useRef } from 'react';
import parseUrl, { type ParsedUrl, type UrlType } from '../utils/parseUrl';
import { useParentWidth } from '@/hooks.ts/useParentWidth';
import { Input } from './ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,

} from "@/components/ui/select"


// PREPRAVITI KOMPONENTU SA SHADCN-om UI
export default function UrlInput() {
    const [inputValue, setInputValue] = useState('');
    const [urlData, setUrlData] = useState<ParsedUrl | null>(null);
    const [selectedType, setSelectedType] = useState<UrlType | ''>('');
    const [isManualSelect, setIsManualSelect] = useState(false);
    const lastRootDomainRef = useRef<string | null>(null);
    const { ref, width } = useParentWidth<HTMLDivElement>();

    // 🧠 Detekcija URL-a i sinhronizacija selecta
    useEffect(() => {
        if (!inputValue.trim()) {
            setUrlData(null);
            setSelectedType('');
            return;
        }

        const parsed = parseUrl(inputValue);
        setUrlData(parsed);

        const domainChanged = parsed.rootDomain !== lastRootDomainRef.current;
        lastRootDomainRef.current = parsed.rootDomain;

        // Ako korisnik nije ručno birao tip, ili ako je promenio domen → ažuriraj select
        if (!isManualSelect || domainChanged) {
            setSelectedType(parsed.type);
            setIsManualSelect(false);
        }
    }, [inputValue]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSelect = (value: string) => {
        setSelectedType(value as UrlType);
        setIsManualSelect(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Final URL data:', { ...urlData, type: selectedType });
    };

    // 🧩 Uslovni prikaz selecta
    const showSelect =
        urlData && urlData.type !== 'invalid' && !!urlData.rootDomain;

    return (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-lg mx-auto">
            <div className="flex relative w-96 justify-between gap-2 border p-2 rounded" ref={ref}>
                <Input
                    type='text'
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Enter URL (root, subdomain, or subfolder)"

                />
                {/* ⬇️ Dropdown se prikazuje samo kad imamo validan URL */}
                {showSelect && (
                    <Select value={selectedType} onValueChange={handleSelect}>
                        <SelectTrigger className="w-[180px]">
                            <span> {selectedType} </span>
                        </SelectTrigger>
                        <SelectContent 
                            disablePortal 
                            position="item-aligned"
                            style={{ width: width }}
                        >
                            <SelectItem value="root domain">{inputValue} Root domain</SelectItem>
                            <SelectItem value="subdomain">{inputValue} Subdomain</SelectItem>
                            <SelectItem value="subfolder">{inputValue} Subfolder</SelectItem>
                        </SelectContent>
                    </Select>
                )}

            </div>

            <button
                type="submit"
                disabled={!urlData || urlData.type === 'invalid'}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
                Submit
            </button>
        </form>
    );
}
