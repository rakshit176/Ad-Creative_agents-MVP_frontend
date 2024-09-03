// import Header from "../components/Header";
// import { adStudio } from "../assets/defaultStrings";
import AdCtreative from "../components/AdCreative/AdCtreative";

function AdStudio() {
    // const { activeTool }  = useSelector((state: ReduxStateType) => state.canvas);

    return (
        <>
            {/* <Header location={adStudio} /> */}

            {/* <div className="flex">
                <ToolsBar location={adStudio} />
                {(parseInt(activeTool) != 6) && <AdCreativeSideBar activeTool={activeTool} />}
                <CanvasSection />
            </div> */}

            <AdCtreative />
        </>
    )
}

export default AdStudio