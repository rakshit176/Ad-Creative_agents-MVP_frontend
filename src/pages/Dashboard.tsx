import "../assets/stylesheets/dashboard.css"
import Header from "../components/Header"
import background from "/images/dashboard-background.png"
import productStudioTile from "/images/ProductStudio.png"
import ModelStudioTile from "/images/ModelStudio.png"
import AdStudioTile from "/images/AdStudio.png"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { dashboard } from "../assets/defaultStrings"
import ReferUser from "../components/ReferUser"


function Dashboard() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const Navigate = useNavigate();
    const feedbackRef = useRef(null);
    const [activeTileIndex, setActiveTileIndex] = useState(null);

    const handleTileMouseEnter = (index: number) => {
        setActiveTileIndex(index);
    };

    const handleTileMouseLeave = () => {
        setActiveTileIndex(null);
    };

    const backgroundImageStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    };

    const tiles = [
        {
            title: "Product Studio",
            description: `Optimize efficiency, save resources, and boost quality with an AI-powered product Studio`,
            image: productStudioTile,
            video: "https://krut-ai-assets.s3.amazonaws.com/videos/ProductStudio.mp4",
            link: "/productStudio?tool_id=1&tool=Ad%20Layout"
        },
        {
            title: "Model Studio",
            description: "Kickstart the effortless generation of human models for your ads",
            image: ModelStudioTile,
            video: "https://krut-ai-assets.s3.amazonaws.com/videos/ModelStudio.mp4",
            link: "/modelStudio?tool_id=2&tool=Generate"
        },
    ]
    const tile2 = {
        title: "Ad Creative",
        description: "Transform your generated images into full-fledged advertisements in seconds",
        image: AdStudioTile,
        video: "https://krut-ai-assets.s3.amazonaws.com/videos/adCreative.mp4",
        link: "/adCreative"
    }

    //() => {
    //     function handleClickOutside(event: { target: any; }) {
    //         if (feedbackRef.current && !feedbackRef.current.contains(event.target)) {
    //             setIsMenuOpen(false);
    //         }
    //     }

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, []);

    return (
        <>
            <Header location={dashboard} />
            <div className="flex flex-col justify-center items-center min-h-[94vh]" style={backgroundImageStyle}>

                <h1 className="text-4xl sm:text-5xl mt-4 font-bold">Discover <span className="colourGrade font-extrabold">Krut AI</span></h1>
                <div className="sm:w-1/2 lg:w-2/5 text-center my-3 lg:p-3 2xl:w-2/5">
                    <p className="text-sm lg:text-base font-medium">Krut AI gives you the tools to create eye-catching visuals in seconds. Design images for ads, banners, websites, and more - all with the click of a button</p>
                </div>

                <div className="flex space-x-8 justify-center mt-3">
                    {tiles.map((tile, index) => (
                        <div key={index} className="card bg-white p-4 rounded-3xl mb-10 shadow-md cursor-pointer zoomEffect"
                            onMouseEnter={() => handleTileMouseEnter(index)}
                            onMouseLeave={handleTileMouseLeave}
                            onClick={() => { Navigate(tile.link); }}>
                            {
                                <>
                                    <img src={tile.image} alt={tile.title} className={activeTileIndex === index ? "hidden" : "block h-[284px] object-cover transition-opacity duration-500"} />
                                    <video src={tile.video} autoPlay loop className={activeTileIndex === index ? "block h-[284px] rounded-3xl object-cover transition-opacity duration-500" : "hidden"} />
                                    <h3 className="mt-2 mb-1 font-bold text-xl">{tile.title}</h3>
                                    <h5 className="text-helperText max-w-[450px]">{tile.description}</h5>
                                </>
                            }

                        </div>
                    ))}

                </div>
                <div className="card p-4 bg-white rounded-3xl mb-10 shadow-md cursor-pointer zoomEffect"
                    style={{
                        backgroundImage: `url(${"/images/adStudioBG.png"})`,
                        backgroundSize: "cover",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}
                    // onMouseEnter={() => handleTileMouseEnter(2)}
                    // onMouseLeave={handleTileMouseLeave}
                    onClick={() => Navigate(tile2.link)}>
                    <div className="flex w-[1000px]">
                        <div className="flex-col">
                            <h3 className="mt-2 mb-1 font-bold text-xl">{tile2.title}</h3>
                            <h5 className="text-helperText pe-5">{tile2.description}</h5>
                        </div>
                        <img src={tile2.image} alt={tile2.title} className={"h-[193px]"} />
                        {/* <img src={tile2.image} alt={tile2.title} className={activeTileIndex === 2 ? "hidden" : "block h-[193px] object-cover transition-opacity duration-500"} />
                        <video src={tile2.video} autoPlay loop className={activeTileIndex === 2 ? "block h-[193px] rounded-3xl object-cover transition-opacity duration-500" : "hidden"} /> */}
                    </div>
                </div>

                <div className="fixed bottom-10 end-10 bg-violetTxt text-center rounded-full px-4 py-1.5 cursor-pointer" onClick={() => setIsMenuOpen(isMenuOpen ? false : true)}>
                    <h2 className="text-white text-4xl">?</h2>
                </div>

                {isMenuOpen && <div ref={feedbackRef} className="fixed flex-col bottom-28 -end-10 sm:pe-12 -mt-2">
                    <div className="mx-2 sm:mx-12 bg-white px-10 py-2.5 text-start flex items-center rounded-lg shadow-lg cursor-pointer rounded-b-none border-x-0 border-t-0 border">
                        <span className="material-symbols-outlined pe-2  text-gray-500">mail</span>
                        <p className="text-base font-normal mb-0 py-1.5"> Contact us</p>
                    </div>

                    <div className="mx-2 sm:mx-12 bg-white px-10 py-2.5 text-start flex items-center shadow-lg cursor-pointer border-x-0 border-t-0 border">
                        <span className="material-symbols-outlined pe-2  text-gray-500">chat </span>
                        <p className="text-base font-normal pe-2 mb-0 py-1.5"> Feedback</p>
                    </div>

                    <ReferUser />
                </div>}

            </div>
        </>
    )
}

export default Dashboard