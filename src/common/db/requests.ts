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

export const getRolesByUserId = `SELECT
    users.email,
    roles.description AS role_name,
    roles.value AS role_value
FROM user_roles
    LEFT JOIN users ON users.id = user_roles.userid
    LEFT JOIN roles ON roles.id = user_roles.roleid
WHERE userid = $1	`;
