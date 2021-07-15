GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO someuser;

[] ajouer les verification
/api sans connection
    post /api/main/mainsearch recherche ville par le cp
    post /api/main/searchbylocation recherche par le zip ou ville
    post /api/main/shopdetails horraire du shp et prochain rdv
    post /api/main/services avoir le detail des services proposé

    post /api/signin inscription
    post /api/login login
    post /api/logout logout
    get  /api/checkEmail/:crypto

/api/user
    post /api/user/profile
    put  /api/user/profile
    post /api/user/book prendre un rdv
    put  /api/user/bookmodify
    put  /api/user/bookcancel

/api/pro

    post /api/pro/profile
    put  /api/pro/profile
    post /api/pro/createappointments
    post /api/pro/getappointments
    put  /api/pro/confirmattendance confirmer que un client est bien venu