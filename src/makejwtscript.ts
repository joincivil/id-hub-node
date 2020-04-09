import { createJWT, verifyJWT, SimpleSigner } from 'did-jwt'
import { DafResolver } from 'daf-resolver'
const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'
let didResolver = new DafResolver({ infuraProjectId })

const signer = SimpleSigner('93ff99e1d56cbcc72487de3394d4a23cf2fc02f95632bc49752dbae2779b42eb')

createJWT(
    {},
    {expiresIn: 200,issuer: 'did:ethr:rinkeby:0x3129f68970fc661434cb46ccb480abd09a5a4a57', signer}).then(async (jwt) => {
        try {
            const verified = await verifyJWT(jwt, {resolver: didResolver});
            console.log(verified)
        } catch (e) {
            console.log("uh oh")
            console.log(e)
        }
})
