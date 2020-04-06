import * as Daf from 'daf-core'
import { JwtMessageHandler } from 'daf-did-jwt'
import { W3cMessageHandler } from 'daf-w3c'
import { SdrMessageHandler } from 'daf-selective-disclosure'
import { DafResolver } from 'daf-resolver'
import { ApolloServer } from 'apollo-server'
import merge from 'lodash.merge'
import { createConnection, getConnectionOptions } from 'typeorm'

const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'

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
  typeDefs: [Daf.Gql.baseTypeDefs, Daf.Gql.Core.typeDefs],
  resolvers: merge(Daf.Gql.Core.resolvers),
  context: ({ req }) => {
    const token = req.headers.authorization || ''
    if (token !== 'Bearer hardcoded-example-token') {
      throw Error('Auth error')
    }

    return { agent }
  },
  introspection: true,
})

agent.on(Daf.EventTypes.savedMessage, async (message: Daf.Message) => {
  // Add your business logic here
  console.log(message)
})

const main = async () => {
  const connectionOptions = await getConnectionOptions()
  Object.assign(connectionOptions, {
    logging: false,
    entities: [...Daf.Entities],
    synchronize: true
  });
  const c = await createConnection(connectionOptions)

  const info = await server.listen()
  console.log(`🚀  Server ready at ${info.url}`)
}

main().catch(console.log)
