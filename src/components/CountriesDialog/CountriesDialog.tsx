import * as React from 'react';
import { searchCountries } from '@api/countries';
import { useQuery } from '@tanstack/react-query';
import './CountriesDialog.scss';

interface DialogProps {
    onClose: () => void;
    selectedCountry: string;
}

const CountriesDialog = ({ onClose, selectedCountry }: DialogProps) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['selected-country', selectedCountry],
        queryFn: () => searchCountries(selectedCountry),
        enabled: !!selectedCountry
    });

    React.useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        dialog.showModal();
        return () => dialog.close();
    }, []);

    return (
        <dialog
            className="countries-dialog"
            ref={dialogRef}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
        >
            <button className="countries-dialog__close" type="button" onClick={onClose} aria-label="Close country details">
                X
            </button>
            <span className="countries-dialog__header">
                {(!isLoading && data ) ? <h2>{selectedCountry}</h2> : null}
                {(!isLoading && data ) ? <img className="countries-dialog__flag" src={data?.data.objects?.[0].flag.url_svg} alt="" /> : null}
            </span>
            {isLoading && (
                <div className="countries-dialog__loading-message">
                    <p>Loading country details...</p>
                </div>
            )}
            {error && (
                <div className="countries-dialog__error-message">
                    <p role="alert">Could not load country details.</p>
                </div>
            )}
            {!isLoading && !error && data && (
                <div className="countries-dialog__section--container">
                    <div className="countries-dialog__section">
                        <h6></h6>
                        {data.data.objects?.[0].capitals.map((city: any) => {
                            return <span key={city.name}>
                                <strong>Capital:</strong> {city.name}
                            </span>
                        })}
                        <span><strong>Area (miles): </strong>{`${data.data.objects?.[0].area.miles.toLocaleString()}`}</span>
                        <span><strong>Area (kilometres): </strong>{`${data.data.objects?.[0].area.kilometers.toLocaleString()}`}</span>
                        <span><strong>Population: </strong>{`${data.data.objects?.[0].population.toLocaleString()}`}</span>
                    </div>
                    <div className="countries-dialog__grid">
                        <div className="countries-dialog__section">
                            <h6>Economy</h6>
                            <hr />
                            <strong>Currencies:</strong>
                            <ul>
                                {data.data.objects?.[0].currencies.map((currency: any) => {
                                    return (
                                        <li key={currency.name}>{currency.name} ({currency.symbol})</li>
                                    )
                                })}
                            </ul>
                            {Object.keys(data.data.objects?.[0].economy.gini_coefficient).length > 0 ? (
                                <div className="countries-dialog__gini-container">
                                    <strong>Gini Coefficient:</strong>
                                    <div className="countries-dialog__gini-elements">
                                        {Object.keys(data.data.objects?.[0].economy.gini_coefficient).map((item) => {
                                            return (
                                                <div className="countries-dialog__gini-item" key={item}>
                                                    <span className="countries-dialog__gini-item-year">{item}</span>
                                                    <span className="countries-dialog__gini-item-value">{data.data.objects?.[0].economy.gini_coefficient[item]}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <div className="countries-dialog__section">
                            <h6>Political</h6>
                            <hr />
                            <span>
                                <strong>Government:</strong> {data.data.objects?.[0].government_type}
                            </span>
                            <span>
                                <strong>Languages:</strong>
                                <ul>
                                    {data.data.objects?.[0].languages.map((language: any) => {
                                    return (
                                        <li key={language.name}>{language.name}</li>
                                    )
                                })}
                                </ul>
                            </span>
                        </div>
                        <div className="countries-dialog__section">
                            <h6>Other</h6>
                            <hr />
                            <span>
                                <strong>Units:</strong>
                                <ul>
                                    <li><strong>Measurements: </strong>{data.data.objects?.[0].units.measurement_system}</li>
                                    <li><strong>Temperature: </strong>{data.data.objects?.[0].units.temperature_scale}</li>
                                </ul>
                            </span>
                        </div>
                    </div>
                    <div className="countries-dialog__section">
                        <p className="countries-dialog__description">{data.data.objects?.[0].descriptions.long}</p>
                    </div>
                </div>
            )}
        </dialog>
    )
};

export default CountriesDialog;