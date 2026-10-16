import './App.scss';
import Globe from '@components/Globe';
import 'tailwindcss';

function App() {

  return (
    <div className="app-container">
      {/* <div id="popUpEl" className="bg-black bg-opacity-75 fixed px-4 py-2 rounded-lg">
      <h2 className="text-white text-xs">
        <span id="populationEl"></span>
        <span>Population</span>
      </h2>
      <p id="populationValueEl" className="text-white font-bold text-lg">300</p>
    </div> */}
    <div className="xl:flex h-screen bg-black">
      <div className="xl:w-1/2 flex flex-col justify-center px-8 pt-16 xl:pt-0">
        <div style={{ maxWidth:500 }} className="mx-auto">
          <h1 className="text-white text-4xl mb-8 font-exo leading-none">WORKING WITH SHADERS IN THREE.JS</h1>
          <p className="text-gray-400 mb-8 font-lato">
            Click and drag the globe to see the populations of nations around the world
          </p>
          <div>
            <a href="" className="text-white bg-green-600 inline-block px-8 py-4 rounded-full font-lato">Learn More</a>
          </div>
        </div>
      </div>
      <Globe />
    </div>
    </div>
  )
}

export default App
