export function getMinterAddress() {
    // const port = process.env.MINTER_PORT;
    // const host = process.env.MINTER_HOST;
    const port = 5000;
    const host = "minter";


    return `${host}:${port}`;
}