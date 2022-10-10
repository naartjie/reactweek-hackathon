import {
  createClient,
  defaultExchanges,
  subscriptionExchange,
  Provider,
} from "urql"
import { SubscriptionClient } from "subscriptions-transport-ws"
import { AddCard, AllCards } from "./Cards"

const subscriptionClient = new SubscriptionClient(
  "ws://localhost:8000/graphql",
  { reconnect: true }
)

const client = createClient({
  url: "http://localhost:8000/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
})

function App() {
  return (
    <div>
      <Provider value={client}>
        <AddCard />
        <AllCards />
      </Provider>
    </div>
  )
}

export default App
