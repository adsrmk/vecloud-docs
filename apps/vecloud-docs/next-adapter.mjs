// With an adapter, Next writes prerendered files directly to their scoped
// route-cache paths during the build. The standalone server can use them as-is.
/** @type {import('next').NextAdapter} */
const adapter = { name: 'vecloud-docs' };

export default adapter;
