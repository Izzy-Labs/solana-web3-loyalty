function getMinterAddress() {
    const port = process.env.MINTER_PORT;
    const host = process.env.MINTER_HOST;

    return `${host}:${port}`;
}

module.exports = { getMinterAddress };