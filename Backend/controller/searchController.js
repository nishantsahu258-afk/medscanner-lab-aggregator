const {searchService} = require("../service/searchService")

const handleSearch = async (req,res)=>{
    const testName = await req.query.search_query;
    const pincode =  await req.query.pincode;
    const result = searchService(testName,pincode);
    return res.status(200).json(result);
    
}

module.exports = {handleSearch}