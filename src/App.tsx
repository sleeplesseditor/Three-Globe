import * as React from 'react';
import './App.scss';
import Globe from '@components/Globe/Globe';
import CountriesDialog from '@components/CountriesDialog/CountriesDialog';
import 'tailwindcss';

function App() {
  const [selectedCountry, setSelectedCountry] = React.useState<string | null>(null);

  return (
    <div className="app-container">
      <div className="xl:flex h-screen bg-black">
        <div className="xl:w-1/2 flex flex-col justify-center px-8 pt-16 xl:pt-0">
          <div style={{ maxWidth:500 }} className="mx-auto">
            <h1 className="text-white text-4xl mb-8 font-exo leading-none">THREE.JS GLOBE</h1>
            <p className="text-gray-400 mb-8 font-lato">
              Click a marker to see learn more about that country, or drag the globe to rotate it.
            </p>
            {/* <div>
              <a href="" className="text-white bg-green-600 inline-block px-8 py-4 rounded-full font-lato">Learn More</a>
            </div> */}
          </div>
        </div>
        {selectedCountry && (
          <CountriesDialog
            onClose={() => setSelectedCountry(null)}
            selectedCountry={selectedCountry}
          />
        )}
        <Globe onCountrySelect={setSelectedCountry} />
      </div>
    </div>
  )
}

export default App
