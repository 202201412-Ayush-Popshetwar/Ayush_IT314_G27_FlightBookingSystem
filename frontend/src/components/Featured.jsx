import "./index.css";

const Featured = () => {
    return (
        <div className="featured">
            <div className="featuredItem">
                <img src="/img/featured/BOM_DEL.jpg" alt="BOM_DEL" className="featuredImg"/>
                <div className="featuredTitles">
                    <h1>BOM to DEL</h1>
                </div>                
            </div>
            <div className="featuredItem">
            <img src="/img/featured/BLR_DEL.jpg" alt="BLR_DEL" className="featuredImg"/>
                <div className="featuredTitles">
                    <h1>BLR to DEL</h1>
                </div>                
            </div>
            <div className="featuredItem">
            <img src="/img/featured/AMD_BOM.jpg" alt="AMD_BOM" className="featuredImg"/>
                <div className="featuredTitles">
                    <h1>AMD TO BOM</h1>
                </div>
            </div>
        </div>
    )
}

export default Featured;