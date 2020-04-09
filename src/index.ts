import * as Daf from 'daf-core'
import { JwtMessageHandler } from 'daf-did-jwt'
import { W3cMessageHandler } from 'daf-w3c'
import { SdrMessageHandler } from 'daf-selective-disclosure'
import { DafResolver } from 'daf-resolver'
import { ApolloServer } from 'apollo-server'
import merge from 'lodash.merge'
import { createConnection, getConnectionOptions } from 'typeorm'
import { Authenticator } from "./auth"

// We will be using 'did:ethr' identities
import { IdentityProvider } from 'daf-ethr-did'

// Storing key pairs in the database
import { KeyStore } from 'daf-core'

// KeyManagementSystem is responsible for managing encryption and signing keys
import { KeyManagementSystem } from 'daf-libsodium'

// Storing managed identities in the database
import { IdentityStore } from 'daf-core'

const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'
const identityStore = new IdentityStore('unique-store-name');

const keyStore = new KeyStore();
const kms = new KeyManagementSystem(keyStore);
// Infura is being used to access Ethereum blockchain. https://infura.io

// Injecting required dependencies, and specifying which blockchain to use and how to access it
const rinkebyIdentityProvider = new IdentityProvider({
  kms,
  identityStore,
  network: 'rinkeby',
  rpcUrl: 'https://rinkeby.infura.io/v3/' + infuraProjectId,
})




let didResolver = new DafResolver({ infuraProjectId })

const messageHandler = new JwtMessageHandler()
messageHandler
  .setNext(new W3cMessageHandler())
  .setNext(new SdrMessageHandler())

export const agent = new Daf.Agent({
  identityProviders: [],
  serviceControllers: [],
  didResolver,
  messageHandler,
})

const server = new ApolloServer({
  typeDefs: [Daf.Gql.baseTypeDefs, Daf.Gql.Core.typeDefs, Daf.Gql.IdentityManager.typeDefs],
  resolvers: merge(Daf.Gql.Core.resolvers, Daf.Gql.IdentityManager.resolvers),
  context: ({ req }) => {
    const authentication = new Authenticator(agent)
    authentication.setIdentity(req.headers.authorization)

    return { agent }
  },
  introspection: true,
})

agent.on(Daf.EventTypes.savedMessage, async (message: Daf.Message) => {
  // Add your business logic here
  console.log(message)
})

const main = async () => {
  const c = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "development",
    username: "docker",
    password: "docker",
    // synchronize: true,
    logging: false,
    entities: [...Daf.Entities],
  })
  // await c.synchronize();
  const info = await server.listen()
  console.log(`🚀  Server ready at ${info.url}`)
}

main().catch(console.log);
