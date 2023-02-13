export const getUserInfoRequest = `SELECT 
    users.id,
    users.email,
    address.street,
    address.house,
    city.name AS city_name,
    region.name AS region_name,
    country.name AS country_name
FROM address
    LEFT JOIN users ON users.id = address.userid 
    LEFT JOIN city ON city.id  = address.cityid 
    LEFT JOIN region ON region.id = address.regionid
    LEFT JOIN country ON country.id = address.countryid 
WHERE userid = $1	`;
