from typing import AsyncGenerator, Optional
from os import getenv
import json
import uvicorn
import strawberry
from strawberry.fastapi import GraphQLRouter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import class_row
from psycopg_pool import AsyncConnectionPool


DATABASE_URL = getenv(
    "DATABASE_URL",
    default="postgres://postgres:postgres@localhost:5432/postgres",
)
pool = AsyncConnectionPool(DATABASE_URL, open=False)


@strawberry.type
class Card:
    id: int
    x: int
    y: int
    z_index: int
    title: str
    text: str


@strawberry.type
class CardUpdate:
    card_id: int
    card: Optional[Card]


@strawberry.input
class UpsertCardInput(Card):
    id: Optional[int] = None


@strawberry.type
class UpsertCardResult:
    card: Card


@strawberry.type
class DeleteCardResult:
    success: bool = True


async def get_cards(root) -> list[Card]:
    async with pool.connection() as conn, conn.cursor(
        row_factory=class_row(Card)
    ) as cur:
        await cur.execute(
            """
            SELECT *
            FROM card
            ORDER BY id
            """
        )
        return await cur.fetchall()


async def upsert_card_resolver(root, card: UpsertCardInput) -> UpsertCardResult:
    sql_insert = """
        INSERT INTO card
            ( x
            , y
            , z_index
            , title
            , text )
        VALUES
            ( %(x)s
            , %(y)s
            , %(z_index)s
            , %(title)s
            , %(text)s )
        RETURNING *
    """
    sql_update = """
        UPDATE card SET
            x = %(x)s
            , y = %(y)s
            , z_index = %(z_index)s
            , title = %(title)s
            , text = %(text)s
        WHERE id = %(id)s
    """
    sql = sql_update if card.id else sql_insert

    async with pool.connection() as conn, conn.cursor(
        row_factory=class_row(Card)
    ) as cur:
        await cur.execute(sql, card.__dict__)
        return UpsertCardResult(
            card=card if card.id else await cur.fetchone()  # type:ignore
        )


async def delete_card_resolver(root, card_id: int) -> DeleteCardResult:
    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute("DELETE FROM card WHERE id = %s", [card_id])
        return DeleteCardResult()


async def card_updates() -> AsyncGenerator[Card, None]:
    async with pool.connection() as conn:
        await conn.set_autocommit(True)
        await conn.execute('LISTEN "card.updated"')
        gen = conn.notifies()
        async for notify in gen:
            card_dict = json.loads(notify.payload)
            card = Card(**card_dict)
            yield card


@strawberry.type
class Query:
    cards: list[Card] = strawberry.field(resolver=get_cards)


@strawberry.type
class Mutation:
    upsert_card: UpsertCardResult = strawberry.field(resolver=upsert_card_resolver)
    delete_card: DeleteCardResult = strawberry.field(resolver=delete_card_resolver)


@strawberry.type
class Subscription:
    @strawberry.subscription
    async def card_updates(self) -> AsyncGenerator[list[CardUpdate], None]:
        conv = lambda card: CardUpdate(card_id=card.id, card=card)
        cards = await get_cards(None)
        yield [conv(card) for card in cards]
        async for card in card_updates():
            if card.x:
                yield [conv(card)]
            else:
                yield [CardUpdate(card_id=card.id, card=None)]


schema = strawberry.Schema(query=Query, mutation=Mutation, subscription=Subscription)

graphql_app = GraphQLRouter(schema)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(graphql_app, prefix="/graphql")


@app.on_event("startup")
async def open_pool():
    print(f"opening connection")
    await pool.open()


@app.on_event("shutdown")
async def close_pool():
    await pool.close()


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
