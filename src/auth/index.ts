import { verifyJWT, decodeJWT } from 'did-jwt'
import { Agent } from 'daf-core';
import { decode } from 'querystring';

export class Authenticator {
    public identity?: string 
    private agent: Agent
    constructor (agent: Agent) {
        this.agent = agent
    }
    async setIdentity(token?: string) {
        // token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1ODYzODgyNzYsImV4cCI6MTU4NjM4ODQ3NiwiaXNzIjoiZGlkOmV0aHI6cmlua2VieToweDMxMjlmNjg5NzBmYzY2MTQzNGNiNDZjY2I0ODBhYmQwOWE1YTRhNTcifQ.kWNZm_RJBS5p1aYHvxzH_ODtlNZWBPnIehsuARYHO5dElHi_g31JMV8mw1Ca6Q8ljRBkENudnjMHg7qt3QtT3g";
        // if (typeof token !== "string") {
        //   throw Error('Auth error')
        // }
        // const decoded = decodeJWT(token)
        // console.log("decoded " + JSON.stringify(decoded, null, 2))
        const doc = await this.agent.didResolver.resolve("did:ethr:rinkeby:0x3129f68970fc661434cb46ccb480abd09a5a4a57")
        console.log("doc: " + JSON.stringify(doc, null, 2))
        try {
            const verified = await verifyJWT(
                "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1ODYzODk2NDIsImV4cCI6MTU4NjM4OTg0MiwiaXNzIjoiZGlkOmV0aHI6cmlua2VieToweDMxMjlmNjg5NzBmYzY2MTQzNGNiNDZjY2I0ODBhYmQwOWE1YTRhNTcifQ.vBgBgnxkOWAsDc5fE4LZ92tSuYsYuZL-Ia39GEVAORVwCgRIi9kRT4KLx3lVJAEBwrV2aLSvW31UJAMdBZuz3g"
                // "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1ODYzODg3NjUsImV4cCI6MTU4NjM4ODk2NSwiaXNzIjoiZGlkOmV0aHI6cmlua2VieToweDMxMjlmNjg5NzBmYzY2MTQzNGNiNDZjY2I0ODBhYmQwOWE1YTRhNTcifQ.zHemagOi2vQMUG6lQMWy_0qC70wjNejZBGhr4WJUHTaFEtOszDsrY92c-De8NuMtfhP4kTVtlRUElBFLnJuJPA"
                // "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1ODYzODg1MjYsImV4cCI6MTU4NjM4ODcyNiwiaXNzIjoiZGlkOmV0aHI6cmlua2VieToweDMxMjlmNjg5NzBmYzY2MTQzNGNiNDZjY2I0ODBhYmQwOWE1YTRhNTcifQ.hf2T1V3ReB2Rn39G1bEsKum0DqAUooglp4QpOautoFJ8ry_F2dx20TGy6diuqY2Ce8KwbTpSz8-bg3Mae_HBhg"
                // "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1ODYzODgyNzYsImV4cCI6MTU4NjM4ODQ3NiwiaXNzIjoiZGlkOmV0aHI6cmlua2VieToweDMxMjlmNjg5NzBmYzY2MTQzNGNiNDZjY2I0ODBhYmQwOWE1YTRhNTcifQ.kWNZm_RJBS5p1aYHvxzH_ODtlNZWBPnIehsuARYHO5dElHi_g31JMV8mw1Ca6Q8ljRBkENudnjMHg7qt3QtT3g"
            , {resolver: this.agent.didResolver});
            console.log(verified)
        } catch (e) {
            console.log("uh oh")
            console.log(e)
        }
    }
}
