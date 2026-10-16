import * as React from 'react';
import { searchCountries } from '@api/countries';
import { useQuery } from '@tanstack/react-query';

interface DialogProps {
    dialogRef: React.RefObject<any>;
    selectedCountry: string;
}

const CountriesDialog = ({ dialogRef, selectedCountry }: DialogProps) => {
    const { data, isLoading, error} = useQuery({
        queryKey: ['selected-country', selectedCountry],
        queryFn: () => searchCountries(selectedCountry),
        enabled: selectedCountry !== null
    });

    React.useEffect(() => {        
        const dialog = dialogRef.current;
        if (dialog) {
            try {
                dialog.showModal();
            } catch (e) {
                console.error('✗ showModal() failed:', e);
            }
        } else {
            console.warn('✗ dialogRef.current is null/undefined');
        }
    }, []);

    return (
        <dialog>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error</p>
            ) : (
                <div></div>
            )}
        </dialog>
    )
};

export default CountriesDialog;