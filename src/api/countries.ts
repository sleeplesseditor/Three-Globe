const apiKey = import.meta.env.VITE_COUNTRIES_API_KEY;

export const searchCountries = async (countryName: string) => {
    const response = await fetch(`https://api.restcountries.com/countries/v5?q=${encodeURIComponent(countryName)}`,
        {
            headers: {
            Authorization: `Bearer ${apiKey}`,
            },
        }
    );
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    const filteredData = await data.data.objects.filter((item: any) => item.names.common === countryName);
    return filteredData[0];
}