const axios = require('axios');

async function searchRawFood(query) {
    try {
        const apiUrlBase = 'https://api.nal.usda.gov/fdc/v1/foods/search?';
        const apiKey = process.env.FDC_API_KEY;
        const apiQuery = query;
        const apiUrl = `${apiUrlBase}api_key=${apiKey}&query=${apiQuery}&dataType=Survey%20(FNDDS)%20&pageSize=3`;

        const apiResponse = await axios.get(apiUrl);

        const firstFood = apiResponse.data.foods[0];
        const response = {
            description: apiResponse.data.totalHits ? firstFood.description : query,
            foodNutrients: apiResponse.data.totalHits ? firstFood.foodNutrients : [],
        }

        return response;
    } catch (error) {
        throw (error);
    }
}

module.exports = {
    searchRawFood,
}