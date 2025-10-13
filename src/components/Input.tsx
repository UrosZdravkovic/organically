import { useState } from 'react';
import parseUrl from '../utils/parseUrl';


export default function Input() {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = parseUrl(inputValue);
        console.log(result);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Unesite tekst..."
            />
            <button type="submit">Pošalji</button>
        </form>
    );
}