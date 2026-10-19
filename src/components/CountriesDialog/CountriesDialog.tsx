import * as React from 'react';
import { searchCountries } from '@api/countries';
import { handleNavigate } from '@helpers/dataHelpers';
import { useQuery } from '@tanstack/react-query';
import { SyncLoader } from 'react-spinners';
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

    const helperDict: Record<string, string> = {
        "african_union": "African Union",
        "arab_league": "Arab League",
        "asean": "ASEAN",
        "brics": "BRICS",
        "commonwealth": "Commonwealth",
        "eu": "EU",
        "eurozone": "Eurozone",
        "g7": "G7",
        "g20": "G20",
        "nato": "NATO",
        "oecd": "OECD",
        "opec": "OPEC",
        "schengen": "Schengen",
        "un": "UN"
    }

    const organizationArr = (orgObj: any) => {
        const orgArr = [] as any;

        Object.keys(orgObj).map((item: string) => {
            if(orgObj[item] === true) {
                const updatedValue = helperDict[item];
                orgArr.push(updatedValue);
            }
        })

        console.log('orgAR', orgObj, orgArr)

        return orgArr;
    }

    return (
        <dialog
            className="countries-dialog"
            ref={dialogRef}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
        >
            <div className="countries-dialog__header-title">
                <button className="countries-dialog__close" type="button" onClick={onClose} aria-label="Close country details">
                    X
                </button>
                <span className="countries-dialog__header">
                    {(!isLoading && data ) ? <h2 className="countries-dialog__header-title" onClick={() => handleNavigate(data.links.wikipedia)}>{selectedCountry}</h2> : null}
                    {(!isLoading && data ) ? <img className="countries-dialog__flag" src={data?.flag.url_svg} alt="" /> : null}
                </span>
                <span className="countries-dialog__subheader">
                    <h6>{(!isLoading && data) ? data?.names.official : null} </h6>
                </span>
            </div>
            {isLoading && (
                <div className="countries-dialog__loading-message">
                    <SyncLoader 
                        color="#ffffff"
                        size={20}
                    />
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
                    <div className="countries-dialog__grid">
                        <div className="countries-dialog__section">
                            <h6></h6>
                            {data.capitals.map((city: any) => {
                                return <span key={city.name}>
                                    <strong>Capital:</strong> {city.name}
                                </span>
                            })}
                            <span><strong>Area (miles): </strong>{`${data.area.miles.toLocaleString()}`}</span>
                            <span><strong>Area (kilometres): </strong>{`${data.area.kilometers.toLocaleString()}`}</span>
                            <span><strong>Population: </strong>{`${data.population.toLocaleString()}`}</span>
                            <span><strong>Coordinates: </strong>
                                <span><strong>Lat:</strong> {data.coordinates.lat} <strong>Long:</strong> {data.coordinates.lng}</span>
                             </span>
                        </div>
                        <div className="countries-dialog__section">
                            <span><strong>{`Dialling Code${data.calling_codes.length > 1 ? 's' : ''}`}: </strong>{`${data.calling_codes[0]}`}</span>
                            <strong>Timezones:</strong>
                                <div className="countries-dialog__time-grid">
                                    {data.timezones.map((item: string) => {
                                        return (
                                            <div className="countries-dialog__time-item" key={item}>
                                                <span className="countries-dialog__time-item-zone">{item}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            <strong>Top Level Domains:</strong>
                                <div className="countries-dialog__time-grid">
                                    {data.tlds.map((item: string) => {
                                        return (
                                            <div className="countries-dialog__time-item" key={item}>
                                                <span className="countries-dialog__time-item-zone">{item}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                        </div>
                        <div className="countries-dialog__section">
                            <h6>Economy</h6>
                            <hr />
                            <strong>Currencies:</strong>
                            <ul>
                                {data.currencies.map((currency: any) => {
                                    return (
                                        <li key={currency.name}>{currency.name} ({currency.symbol})</li>
                                    )
                                })}
                            </ul>
                            {Object.keys(data.economy.gini_coefficient).length > 0 ? (
                                <div className="countries-dialog__gini-container">
                                    <strong>Gini Coefficient:</strong>
                                    <div className="countries-dialog__gini-elements">
                                        {Object.keys(data.economy.gini_coefficient).map((item) => {
                                            return (
                                                <div className="countries-dialog__gini-item" key={item}>
                                                    <span className="countries-dialog__gini-item-year">{item}</span>
                                                    <span className="countries-dialog__gini-item-value">{data.economy.gini_coefficient[item]}</span>
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
                                <strong>Government Type:</strong> {data.government_type}
                            </span>
                            <span>
                                <strong>Languages:</strong>
                                <ul>
                                    {data.languages.map((language: any) => {
                                    return (
                                        <li key={language.name}>{language.name}</li>
                                    )
                                })}
                                </ul>
                            </span>
                            <strong>International Organization Membership:</strong>
                                <div className="countries-dialog__political-elements">
                                    {organizationArr(data.memberships).map((item: string) => {
                                        return (
                                            <div className="countries-dialog__political-item" key={item}>
                                                <span className="countries-dialog__political-item-name">{item}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                        </div>
                        <div className="countries-dialog__section">
                            <h6>Other</h6>
                            <hr />
                            <span>
                                <strong>Units:</strong>
                                <ul>
                                    <li><strong>Measurements: </strong>{data.units.measurement_system}</li>
                                    <li><strong>Temperature: </strong>{data.units.temperature_scale}</li>
                                </ul>
                            </span>
                        </div>
                    </div>
                    <div className="countries-dialog__section">
                        <p className="countries-dialog__description">{data.descriptions.long}</p>
                    </div>
                </div>
            )}
        </dialog>
    )
};

export default CountriesDialog;