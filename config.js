var config = {}

config.endpoint = "https://localhost:8081";
config.primaryKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
config.database = {
    "id": "DevDB"
};
config.collection = {
    "id": "DeviceColl"
};
config.documents = {
    "Apple": {
        "id": "101",
        "DeviceId": 101,
        "DeviceName": "iPhone",
        "DeviceKey": "ASFDF",
        "DeviceType": "Mobile"
    },
    "Nokia": {
        "id": "102",
        "DeviceId": 102,
        "DeviceName": "1100",
        "DeviceKey": "ASFDF",
        "DeviceType": "Mobile"
    }

};

module.exports = config;