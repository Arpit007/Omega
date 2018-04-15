module.exports = {
    "appName" : "Omega",
    "port" : 3000,
    "dbConfig" : {
        "url" : "mongodb://localhost:27017",
        "db" : "OmegaD"
    },
    "crypto" : {
        "SessionKey" : "Hello World!",
        "JwtExpiry" : '1y',
        "JwtKey" : "Hello To My World"
    },
    "auth" : {
        "expiry" : 365 * 24 * 60 * 60 * 1000
    }
};