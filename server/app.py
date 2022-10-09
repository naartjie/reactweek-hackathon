import asyncio
import json
from typing import AsyncGenerator, Optional
from os import getenv
import asyncio
import strawberry
import uvicorn
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from psycopg.rows import class_row
from psycopg_pool import AsyncConnectionPool, ConnectionPool


DATABASE_URL = getenv(
    "DATABASE_URL",
    default="postgres://postgres:postgres@localhost:5432/postgres",
)
pool_async = AsyncConnectionPool(DATABASE_URL, open=False)


async def card_updates():
    async with pool_async.connection() as conn:
        await conn.set_autocommit(True)
        await conn.execute('LISTEN "card.updated"')
        gen = conn.notifies()
        async for notify in gen:
            card_dict = json.loads(notify.payload)
            yield card_dict


@strawberry.type
class Card:
    id: int
    x: int
    y: int
    text: str


@strawberry.type
class CardRemoved:
    card_id: int


@strawberry.input
class CreateCardInput(Card):
    id: Optional[int] = None


@strawberry.type
class UpsertCardResult:
    card: Card


async def get_cards_async(root) -> list[Card]:
    async with pool_async.connection() as conn, conn.cursor(
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


async def upsert_card_resolver(root, card: CreateCardInput) -> UpsertCardResult:
    sql_insert = """
        INSERT INTO card
            ( x
            , y
            , text )
        VALUES
            ( %(x)s
            , %(y)s
            , %(text)s )
        RETURNING *
    """
    sql_update = """
        UPDATE card SET
            x = %(x)s
            , y = %(y)s
            , text = %(text)s
        WHERE id = %(id)s
        RETURNING *
    """
    sql = sql_update if card.id else sql_insert

    async with pool_async.connection() as conn, conn.cursor(
        row_factory=class_row(Card)
    ) as cur:
        await cur.execute(sql, card.__dict__)
        inserted = await cur.fetchone()
        assert inserted is not None
        return UpsertCardResult(card=inserted)


@strawberry.type
class Query:
    cards: list[Card] = strawberry.field(resolver=get_cards_async)


@strawberry.type
class Mutation:
    upsert_card: UpsertCardResult = strawberry.field(resolver=upsert_card_resolver)


@strawberry.type
class Subscription:
    @strawberry.subscription
    async def card_updated(self) -> AsyncGenerator[Card, None]:
        async for json in card_updates():
            card = Card(id=json["id"], x=json["x"], y=json["y"], text=json["text"])
            yield card

    @strawberry.subscription
    async def card_removed(self) -> AsyncGenerator[CardRemoved, None]:
        id = 1
        for _ in range(100):
            yield CardRemoved(card_id=id)
            id += 1
            await asyncio.sleep(1)


schema = strawberry.Schema(query=Query, mutation=Mutation, subscription=Subscription)

graphql_app = GraphQLRouter(schema)

app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")


@app.on_event("startup")
async def open_pool():
    await pool_async.open()


@app.on_event("shutdown")
async def close_pool():
    await pool_async.close()


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
