const md5ToHashbytesMd5 = query => {
    return query.replace(
        "MD5('",
        "HASHBYTES('MD5', '"
    );
};

module.exports = {md5ToHashbytesMd5};
