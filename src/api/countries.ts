export const searchCountries = async (countryName: string) => {
    const response = await fetch(`https://api.restcountries.com/countries/v5?q=${countryName}`,
        { headers: { 
            'Authorization': `Bearer ${import.meta.env.COUNTRIES_API_KEY}`
        }}
    );
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
}