import fastify from 'fastify';
import { getVrfDocument, bulkUploadVrf, updateWeb3Name, getPassportsByTier, doLottery, updatePfp, testConnectivity } from './handlers';

export function createApp() {
    const app = fastify();
    
    app.get('/vrf/:vrf', getVrfDocument);
    app.post('/vrf/:vrf/update/web3Name', updateWeb3Name);
    app.post('/vrf/:vrf/update/pfp', updatePfp);

    app.get('/test-connectivity', testConnectivity);

    app.post('/admin/vrf/bulkUpload', bulkUploadVrf);
    app.get('/admin/passports', getPassportsByTier);
    app.get('/admin/lottery', doLottery);

    return app;
}

if (require.main === module) {
    createApp().listen({ port: 3000 }, (err) => {
        if (err) console.error(err);
        console.log('server listening on 3000');
    });
} else {
    module.exports = { createApp };
}
