import { useState } from "react"
import { useMutation, useSubscription } from "urql"
import Draggable, { DraggableCore } from "react-draggable"

const UpsertCard = `
  mutation
    ( $id: Int
    , $x: Int!
    , $y: Int!
    , $zIndex: Int!
    , $title: String!
    , $text: String! ) {
    upsertCard(card:
      { id: $id
      , x: $x
      , y: $y
      , zIndex: $zIndex
      , title: $title
      , text: $text }) {
      card {
        id
        x
        y
        zIndex
        title
        text
      }
    }
  }
`

const DeleteCard = `
  mutation ($cardId: Int!) {
    deleteCard(cardId: $cardId) { success }
  }
`

const CardUpdates = `
  subscription {
    cardUpdates {
      cardId
      card {
        id
        x
        y
        zIndex
        title
        text
      }
    }
  }
`

export const AddCard = () => {
  const [cardTitle, setCardTitle] = useState("")
  const [disabled, setDisabled] = useState(false)
  const [_upsertCardResult, upsertCard] = useMutation(UpsertCard)

  const addCard = async (_ev) => {
    setDisabled(true)
    try {
      const _result = await upsertCard({
        title: cardTitle,
        x: 1,
        y: 1,
        zIndex: 1,
        text: "",
      })
      setCardTitle("")
    } finally {
      setDisabled(false)
    }
  }

  return (
    <div className="form-control">
      <div className="input-group">
        <input
          type="text"
          placeholder="Add note..."
          value={cardTitle}
          onChange={(ev) => setCardTitle(ev.target.value)}
          className="input input-bordered"
        />
        <button className="btn" onClick={addCard} disabled={disabled}>
          +
        </button>
      </div>
    </div>
  )
}

const Card = ({ card }) => {
  const [_deleteCardMutationResult, deleteCardMutation] =
    useMutation(DeleteCard)

  const deleteCard = async (cardId) => {
    const _result = await deleteCardMutation({ cardId })
  }

  const [_upsertCardResult, upsertCard] = useMutation(UpsertCard)

  const updateCardPos = async ({ x, y }) => {
    const _result = await upsertCard({
      ...card,
      x,
      y,
    })
  }

  return (
    <Draggable
      onDrag={(ev, data) => updateCardPos(data)}
      position={{ x: card.x, y: card.y }}
    >
      <div>
        <div className="card w-96 bg-neutral shadow-xl">
          <div className="card-body">
            <div className="card-actions justify-end">
              <button
                className="btn btn-square btn-sm"
                onClick={(_ev) => deleteCard(card.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <h2 className="card-title">{card.title}</h2>
            <p>{card.text}</p>
          </div>
        </div>
      </div>
    </Draggable>
  )
}

export const AllCards = () => {
  const handleCardUpdatesSubscription = (cards = {}, data) => {
    const newUpdates = data.cardUpdates
      ? Object.fromEntries(data.cardUpdates.map((x) => [x.cardId, x.card]))
      : {}
    return {
      ...cards,
      ...newUpdates,
    }
  }
  const [result] = useSubscription(
    { query: CardUpdates },
    handleCardUpdatesSubscription
  )

  const { fetching, data, error } = result
  if (fetching) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <div>
      {Object.values(data)
        .filter((id) => id)
        .map((card) => (
          <Card key={card.id} card={card} />
        ))}
    </div>
  )
}
